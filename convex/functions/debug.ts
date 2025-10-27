import { query } from "../_generated/server";

export const whoami = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    return {
      hasIdentity: !!identity,
      email: identity?.email ?? null,
      issuer: identity?.issuer ?? null,
      subject: identity?.subject ?? null,
    };
  },
});
