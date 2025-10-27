// OJO: importar los tipos desde _generated/server (NO desde "convex/server")
import type { QueryCtx, MutationCtx } from "../_generated/server";

/**
 * Devuelve identidad (Clerk) y el usuario en Convex según el email de la sesión.
 * Si no hay sesión o no existe el usuario, devuelve nulls.
 */
export async function getCurrentUser(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) return { identity: null, user: null };

  const email = identity.email?.toLowerCase();
  if (!email) return { identity, user: null };

  // Tipamos el builder como any para evitar el "implicit any"
  const user = await ctx.db
    .query("users")
    .withIndex("by_email", (q: any) => q.eq("email", email))
    .unique();

  return { identity, user };
}

/** Exige que haya sesión y usuario en Convex; devuelve el user. */
export async function assertAuthed(ctx: QueryCtx | MutationCtx) {
  const { identity, user } = await getCurrentUser(ctx);
  if (!identity || !user) {
    throw new Error("UNAUTHORIZED");
  }
  return user;
}

/** Exige que el recurso pertenezca al usuario autenticado. */
export async function assertOwner<T extends { ownerId?: string; userId?: string }>(
  ctx: QueryCtx | MutationCtx,
  record: T
) {
  const user = await assertAuthed(ctx);
  const owner = (record as any).ownerId ?? (record as any).userId;
  if (!owner || owner !== user._id) {
    throw new Error("FORBIDDEN_NOT_OWNER");
  }
  return user;
}
