import { query, mutation } from "../_generated/server";
import { v } from "convex/values";

export const getByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .unique();
    return user ?? null;
  },
});

export const upsert = mutation({
  args: {
    email: v.string(),
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    role: v.union(v.literal("client"), v.literal("admin")),
  },
  handler: async (ctx, { email, name, image, role }) => {
    const now = Date.now();

    const existing = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, { name, image, role });
      return existing._id;
    }

    const _id = await ctx.db.insert("users", {
      email,
      name,
      image,
      role,
      createdAt: now,
    });
    return _id;
  },
});
