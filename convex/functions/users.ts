import { query, mutation } from "../_generated/server";
import { v } from "convex/values";

// ✅ Ajusta estas listas según tu proyecto
const ADMIN_EMAILS = ["info@megapesca.co"];
// 👉 Consigue el Clerk User ID de tu admin (Clerk Dashboard → Users → el user → "User ID", ej: "user_2aBc..."):
const ADMIN_SUBJECTS = ["user_34L7A0Mtysh9b70mD1Yy2JYEXq1"
];

/** Utilidad: decide si debe ser admin por email o por subject */
function shouldBeAdmin(emailLower: string | undefined, clerkId: string) {
  if (emailLower && ADMIN_EMAILS.includes(emailLower)) return true;
  if (ADMIN_SUBJECTS.includes(clerkId)) return true;
  return false;
}

/** Buscar por email (útil para UI/admin). */
export const getByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    const lower = email.toLowerCase();
    return await ctx.db
      .query("users")
      .withIndex("by_email", (q: any) => q.eq("email", lower))
      .unique();
  },
});

/** Upsert por email (para herramientas internas o UI). */
export const upsert = mutation({
  args: {
    email: v.string(),
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    role: v.union(v.literal("client"), v.literal("admin")),
  },
  handler: async (ctx, { email, name, image, role }) => {
    const lower = email.toLowerCase();
    const existing = await ctx.db
      .query("users")
      .withIndex("by_email", (q: any) => q.eq("email", lower))
      .unique();

    if (!existing) {
      const identity = await ctx.auth.getUserIdentity();
      const clerkId = identity?.subject;
      const id = await ctx.db.insert("users", {
        clerkId,
        email: lower,
        name,
        image,
        role,
        createdAt: Date.now(),
      });
      return await ctx.db.get(id);
    }

    await ctx.db.patch(existing._id, {
      ...(existing.name !== name ? { name } : {}),
      ...(existing.image !== image ? { image } : {}),
      ...(existing.role !== role ? { role } : {}),
    });
    return await ctx.db.get(existing._id);
  },
});

/** whoami: solo lectura. */
export const whoami = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    // 1) por clerkId
    const byClerk = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q: any) => q.eq("clerkId", identity.subject))
      .unique();
    if (byClerk) return byClerk;

    // 2) fallback por email (usuarios antiguos sin clerkId)
    const email = identity.email?.toLowerCase();
    if (!email) return null;

    const byEmail = await ctx.db
      .query("users")
      .withIndex("by_email", (q: any) => q.eq("email", email))
      .unique();

    return byEmail ?? null;
  },
});

/**
 * ensureMe:
 *  - Garantiza doc usuario (migra por email si falta clerkId).
 *  - Promueve a admin si está en ADMIN_EMAILS o ADMIN_SUBJECTS.
 */
export const ensureMe = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("UNAUTHORIZED");

    const clerkId = identity.subject;
    const emailLower = identity.email?.toLowerCase();

    // 1) ¿existe ya por clerkId?
    let user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q: any) => q.eq("clerkId", clerkId))
      .unique();

    // 2) si no existe, intentar migrar por email
    if (!user && emailLower) {
      const oldByEmail = await ctx.db
        .query("users")
        .withIndex("by_email", (q: any) => q.eq("email", emailLower))
        .unique();

      if (oldByEmail) {
        await ctx.db.patch(oldByEmail._id, {
          clerkId,
          ...(oldByEmail.name !== identity.name ? { name: identity.name ?? undefined } : {}),
          ...(oldByEmail.image !== identity.pictureUrl ? { image: identity.pictureUrl ?? undefined } : {}),
        });
        user = await ctx.db.get(oldByEmail._id);
      }
    }

    // 3) si no existe, crear nuevo
    if (!user) {
      const id = await ctx.db.insert("users", {
        clerkId,
        email: emailLower, // puede ser undefined
        name: identity.name ?? undefined,
        image: identity.pictureUrl ?? undefined,
        role: "client",
        createdAt: Date.now(),
      });
      user = (await ctx.db.get(id))!;
    }

    // 4) Promoción a admin si corresponde (por email o subject)
    const wantAdmin = shouldBeAdmin(emailLower, clerkId);
    if (wantAdmin && user.role !== "admin") {
      await ctx.db.patch(user._id, { role: "admin" });
      user = (await ctx.db.get(user._id))!;
    }

    return user;
  },
});

/**
 * setRole: operación de mantenimiento.
 * - Solo un admin actual puede cambiar el rol de otro usuario por email.
 * - Útil para corregir estados puntuales.
 */
export const setRole = mutation({
  args: {
    email: v.string(),
    role: v.union(v.literal("client"), v.literal("admin")),
  },
  handler: async (ctx, { email, role }) => {
    const requester = await ctx.auth.getUserIdentity();
    if (!requester) throw new Error("UNAUTHORIZED");

    const me = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q: any) => q.eq("clerkId", requester.subject))
      .unique();

    if (!me || me.role !== "admin") throw new Error("FORBIDDEN");

    const lower = email.toLowerCase();
    const target = await ctx.db
      .query("users")
      .withIndex("by_email", (q: any) => q.eq("email", lower))
      .unique();

    if (!target) throw new Error("USER_NOT_FOUND");
    await ctx.db.patch(target._id, { role });
    return await ctx.db.get(target._id);
  },
});
