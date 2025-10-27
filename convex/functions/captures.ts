import { query } from "../_generated/server";

export const listMine = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    // 1) por clerkId
    let me =
      await ctx.db
        .query("users")
        .withIndex("by_clerkId", (q: any) => q.eq("clerkId", identity.subject))
        .unique();

    // 2) fallback por email (si existe)
    if (!me) {
      const emailLower = identity.email?.toLowerCase();
      if (emailLower) {
        me = await ctx.db
          .query("users")
          .withIndex("by_email", (q: any) => q.eq("email", emailLower))
          .unique();
      }
    }

    if (!me) return [];
    return await ctx.db
      .query("captures")
      .withIndex("by_user", (q) => q.eq("userId", me._id))
      .order("desc")
      .collect();
  },
});
