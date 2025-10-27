import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    // 🔁 MIGRACIÓN SUAVE: lo dejamos opcional temporalmente
    clerkId: v.optional(v.string()),
    email: v.optional(v.string()),
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    role: v.union(v.literal("client"), v.literal("admin")),
    createdAt: v.number(),
  })
    // Usuarios con clerkId aparecerán en este índice;
    // los antiguos sin clerkId simplemente no estarán indexados aquí.
    .index("by_clerkId", ["clerkId"])
    .index("by_email", ["email"]),

  orders: defineTable({
    userId: v.id("users"),
    shopifyOrderId: v.string(),
    total: v.number(),
    currency: v.string(),
    status: v.string(),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_shopifyOrderId", ["shopifyOrderId"]),

  captures: defineTable({
    userId: v.id("users"),
    date: v.number(),
    location: v.string(),
    species: v.string(),
    weightKg: v.optional(v.number()),
    lengthCm: v.optional(v.number()),
    notes: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  })
    .index("by_user", ["userId"])
    .index("by_date", ["date"]),

  gear: defineTable({
    userId: v.id("users"),
    title: v.string(),
    items: v.array(v.object({
      kind: v.string(),
      brand: v.optional(v.string()),
      model: v.optional(v.string()),
      notes: v.optional(v.string()),
    })),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_user", ["userId"]),

  tickets: defineTable({
    userId: v.id("users"),
    subject: v.string(),
    message: v.string(),
    status: v.union(v.literal("open"), v.literal("closed")),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_status", ["status"]),
});
