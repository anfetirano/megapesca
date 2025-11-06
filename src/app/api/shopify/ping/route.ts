import { shopifyAdminFetch } from "@/lib/shopify";

export async function GET() {
  try {
    const data = await shopifyAdminFetch<{ customers: any[] }>(
      "/customers.json?limit=1"
    );
    return Response.json({ ok: true, sample: data.customers?.[0] ?? null });
  } catch (err: any) {
    return new Response(JSON.stringify({ ok: false, error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
