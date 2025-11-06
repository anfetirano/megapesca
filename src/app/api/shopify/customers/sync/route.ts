import { shopifyAdminFetch } from "@/lib/shopify";

type CustomerPayload = {
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  tags?: string[];
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as CustomerPayload;

    if (!body?.email) {
      return new Response(JSON.stringify({ ok: false, error: "email required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 1) Intentar encontrar cliente por email
    const search = await shopifyAdminFetch<{ customers: any[] }>(
      `/customers/search.json?query=email:${encodeURIComponent(body.email)}`
    );
    const existing = search.customers?.[0];

    if (existing) {
      // 2) Actualizar
      const updated = await shopifyAdminFetch<{ customer: any }>(
        `/customers/${existing.id}.json`,
        {
          method: "PUT",
          body: JSON.stringify({
            customer: {
              id: existing.id,
              first_name: body.first_name ?? existing.first_name,
              last_name: body.last_name ?? existing.last_name,
              phone: body.phone ?? existing.phone,
              tags: body.tags ?? existing.tags,
            },
          }),
        }
      );
      return Response.json({ ok: true, action: "updated", customer: updated.customer });
    }

    // 3) Crear
    const created = await shopifyAdminFetch<{ customer: any }>(
      `/customers.json`,
      {
        method: "POST",
        body: JSON.stringify({
          customer: {
            email: body.email,
            first_name: body.first_name,
            last_name: body.last_name,
            phone: body.phone,
            tags: body.tags ?? ["megapesca"],
            verified_email: true, // evita email de verificación; puedes poner false si prefieres
          },
        }),
      }
    );

    return Response.json({ ok: true, action: "created", customer: created.customer });
  } catch (err: any) {
    return new Response(JSON.stringify({ ok: false, error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
