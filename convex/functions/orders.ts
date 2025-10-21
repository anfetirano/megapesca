import { query, mutation } from "../_generated/server";
import { v } from "convex/values";

export const listByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query("orders")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

export const upsertFromShopify = mutation({
  args: {
    userId: v.id("users"),
    shopifyOrderId: v.string(),
    total: v.number(),
    currency: v.string(),
    status: v.string(),
    createdAt: v.number(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("orders")
      .withIndex("by_shopifyOrderId", (q) =>
        q.eq("shopifyOrderId", args.shopifyOrderId)
      )
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        total: args.total,
        currency: args.currency,
        status: args.status,
      });
      return existing._id;
    }

    return await ctx.db.insert("orders", args);
  },
});
