🧭 Manual de conexión: Shopify + Clerk + Convex + Next.js + Wompi (Megapesca)
📌 Objetivo general

Conectar Shopify (catálogo y checkout con Wompi) con tu ecosistema actual basado en:

Next.js (Frontend + Dashboard)

Clerk (autenticación y roles)

Convex (base de datos y backend)

Wompi (pasarela de pago oficial de Shopify en Colombia)

De esta forma, Megapesca mantiene:

La tienda y pagos dentro de Shopify.

La experiencia de usuario (dashboards, comunidad, fidelización) dentro de Next.js.

Y la sincronización de datos (usuarios, pedidos, métricas) centralizada en Convex.

⚙️ Estructura general
megapesca/
├── convex/
│   ├── functions/
│   │   ├── users.ts        → Manejo de roles y auth Clerk
│   │   ├── orders.ts       → Sincronización de pedidos Shopify
│   │   ├── products.ts     → Cache y metadatos del catálogo
│   │   └── webhooks.ts     → Recepción de eventos Shopify/Wompi
│   └── schema.ts
│
├── src/
│   ├── app/
│   │   ├── (auth)/         → Login/Register Clerk
│   │   ├── (dashboard)/
│   │   │   ├── admin/      → Panel con métricas Shopify
│   │   │   ├── client/     → Panel con historial y compras
│   │   │   └── layout.tsx
│   │   └── (marketing)/
│   │       ├── home/       → Página principal
│   │       └── shop/       → Catálogo (fetch desde Shopify API)
│   │
│   ├── lib/
│   │   ├── shopifyClient.ts  → Conector a Storefront/Admin API
│   │   └── convexClient.ts   → Cliente de Convex
│   └── components/
│       └── ...
│
├── .env.local
└── README_SHOPIFY.md

🧩 Rol de cada servicio
Servicio	Rol	Descripción
Shopify	E-commerce principal	Maneja catálogo, inventario y checkout con Wompi.
Wompi (plugin oficial)	Pasarela de pago	Procesa pagos directamente desde el checkout de Shopify, sin redirección.
Clerk	Autenticación	Crea y mantiene sesiones seguras para clientes y administradores.
Convex	Base de datos + backend	Guarda usuarios, pedidos, estadísticas, y roles.
Next.js	Interfaz	Aloja el dashboard (admin/client) y el frontend marketing.
🧠 Flujo completo del sistema
1️⃣ Registro y autenticación

El usuario crea cuenta o inicia sesión con Clerk.

Convex ensureMe() sincroniza o crea el documento user con sus datos.

Se asigna el rol:

"admin" si su email o ID está en ADMIN_EMAILS o ADMIN_SUBJECTS.

"client" por defecto.

2️⃣ Catálogo y tienda

Shopify mantiene todo el inventario y precios.

Desde /shop, Next.js obtiene los productos usando la Storefront API:

import { shopifyFetch } from "@/lib/shopifyClient";

export default async function ShopPage() {
  const data = await shopifyFetch(`
    query Products {
      products(first: 12) {
        edges {
          node {
            id title handle
            images(first: 1) { edges { node { src } } }
            priceRange { minVariantPrice { amount currencyCode } }
          }
        }
      }
    }
  `);
  const products = data.products.edges.map(e => e.node);
  ...
}


Convex puede tener un products table opcional para cachear los productos y añadir etiquetas, stock local, o categorías personalizadas.

3️⃣ Checkout y pagos (Shopify + Wompi)
Integración oficial Wompi para Shopify

Instala el plugin oficial de Wompi desde el panel de Shopify:

Configuración → Pagos → Conectar → Wompi.

Ingresa tus credenciales de producción y prueba desde tu cuenta Wompi:

Panel Wompi → Desarrollo → Desarrolladores → Llaves públicas/privadas.

Activa los métodos de pago deseados:

Tarjetas crédito/débito.

PSE, Nequi, Daviplata, QR Bancolombia, efectivo, etc.

Modos disponibles

Checkout redirigido (Wompi estándar)
El usuario es llevado a la pasarela de Wompi y regresa al confirmar el pago.

Tarjetas on-site (integrado)
El pago se realiza directamente dentro del checkout de Shopify sin salir de la tienda.
⚠️ Requiere habilitar “Wompi tarjetas” desde la app oficial.

Webhook de estado

Wompi notificará automáticamente los pagos a Shopify.

Shopify actualizará el pedido (pagado, pendiente, cancelado, etc.).

Puedes crear un webhook adicional en Convex o Next.js para sincronizar estados si lo deseas:

// /api/webhooks/shopify.ts
export async function POST(req: Request) {
  const event = await req.json();
  // Ejemplo: order paid → guardar en Convex
  if (event.topic === "orders/paid") {
    await convex.mutation("orders.syncFromShopify", { orderId: event.data.id });
  }
  return new Response("ok");
}

4️⃣ Dashboard Cliente (Convex + Clerk)

Accesible solo para usuarios autenticados con role: client.

Muestra datos del usuario y sus pedidos, sincronizados desde Shopify → Convex.

Ejemplo de consulta:

const orders = useQuery(api.functions.orders.listMine, {});


Incluye:

Historial de compras.

Estados de pedido.

Productos favoritos.

Datos básicos del perfil.

5️⃣ Dashboard Admin (Shopify + Convex)

Solo para role: admin.

Muestra métricas como:

Ventas totales y del día.

Pedidos pendientes.

Nuevos clientes.

Fuente de datos combinada:

Shopify Admin API para ventas reales.

Convex orders para datos internos y métricas personalizadas.

Ejemplo:

const { admin } = await authenticate.admin(request);
const response = await admin.graphql(`
  query {
    orders(first: 5, sortKey: CREATED_AT, reverse: true) {
      edges { node { name totalPriceSet { shopMoney { amount } } } }
    }
  }
`);

🔐 Variables de entorno
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
CLERK_SECRET_KEY=...

# Convex
CONVEX_DEPLOYMENT=...

# Shopify
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=megapesca.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_API_TOKEN=...
SHOPIFY_ADMIN_API_KEY=...
SHOPIFY_ADMIN_API_SECRET=...
SHOPIFY_API_VERSION=2025-07
SHOPIFY_APP_URL=https://megapesca.co

# Wompi
WOMPI_PUBLIC_KEY=...
WOMPI_PRIVATE_KEY=...
WOMPI_EVENTS_SECRET=...

📖 Instrucciones oficiales de Wompi (Shopify)

🔗 Seguir guía completa:
Documentación oficial de integración Wompi + Shopify

Pasos esenciales resumidos:

En Shopify → Configuración → Pagos → “Wompi”.

Clic en Conectar e instala la app.

Inicia sesión con tus credenciales Wompi y copia las llaves.

Conecta en modo prueba y verifica funcionamiento.

Luego conecta modo producción y activa los métodos de pago.

Configura:

Método de contacto: “Correo electrónico”.

Número de teléfono de envío: “Requerido”.

(Opcional) Activa Wompi tarjetas on-site para pagos dentro del checkout.

Verifica que los pedidos se reflejen correctamente en Shopify.

🧩 Mapa de flujo final
Cliente → Clerk → Convex(users)
   ↓
Tienda Next.js (/shop) → Shopify Storefront API
   ↓
Checkout Shopify → Wompi (plugin oficial)
   ↓
Webhook Wompi → Shopify actualiza estado
   ↓
Convex sincroniza datos → Dashboard Cliente/Admin

✅ Recomendaciones finales

Usa el plugin oficial de Wompi.
No reinventes el checkout: Shopify ya se encarga del pago seguro.

Sincroniza datos clave a Convex:

shopifyOrderId

userId (Clerk)

status (paid, pending, cancelled)

totalPrice

Evita conectar Convex directo a Wompi.
Deja que Shopify reciba y valide los pagos.

Convex actúa como “mirror” o espejo de datos.

Cada vez que Shopify reciba un pedido o lo actualice → Convex lo refleja.

Dashboard futuro:

Cliente: pedidos, estado, soporte.

Admin: métricas de Shopify + datos de usuarios Convex.

Aquí tienes el blueprint sólido para conectar Shopify con tu stack (Next.js + Clerk + Convex) sin romper nada. Puedes copiar/pegar por archivos. Está pensado para ir en una rama nueva: feat/shopify-catalogue.

1) Convex – schema.ts (añade estas tablas/índices)
// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // --- YA EXISTE: users ---
  users: defineTable({
    clerkId: v.string(),
    createdAt: v.float64(),
    email: v.optional(v.string()),
    image: v.optional(v.string()),
    name: v.optional(v.string()),
    role: v.union(v.literal("client"), v.literal("admin")),
  })
    .index("by_clerkId", ["clerkId"])
    .index("by_email", ["email"])
    .searchIndex("search_by_email", {
      searchField: "email",
    }),

  // --- NUEVO: orders (espejo de Shopify) ---
  orders: defineTable({
    userId: v.id("users"),                // dueña del pedido (Clerk→Convex)
    shopifyOrderId: v.string(),           // id de Shopify (gid o numérico)
    name: v.string(),                     // # pedido: ej. #1001
    status: v.string(),                   // paid, pending, cancelled...
    currencyCode: v.optional(v.string()),
    totalPrice: v.optional(v.float64()),
    subtotalPrice: v.optional(v.float64()),
    createdAt: v.float64(),               // timestamp ms
    updatedAt: v.float64(),               // timestamp ms
    raw: v.optional(v.any()),             // snapshot raw (para auditoría)
  })
    .index("by_user", ["userId"])
    .index("by_shopifyId", ["shopifyOrderId"]),

  // --- NUEVO: orderItems (líneas del pedido) ---
  orderItems: defineTable({
    orderId: v.id("orders"),
    shopifyProductId: v.optional(v.string()),
    title: v.string(),
    quantity: v.float64(),
    price: v.float64(),
  }).index("by_order", ["orderId"]),

  // --- OPCIONAL: productCache (catálogo cacheado) ---
  productCache: defineTable({
    shopifyProductId: v.string(),
    title: v.string(),
    handle: v.string(),
    image: v.optional(v.string()),
    price: v.optional(v.float64()),
    currencyCode: v.optional(v.string()),
    updatedAt: v.float64(),
    raw: v.optional(v.any()),
  })
    .index("by_handle", ["handle"])
    .index("by_shopifyProductId", ["shopifyProductId"]),
});

2) Convex – functions/orders.ts
// convex/functions/orders.ts
import { mutation, query } from "../_generated/server";
import { v } from "convex/values";

/**
 * Utilidad: resuelve el user (Convex) a partir del clerkId actual
 */
async function getMeByClerkId(ctx: any) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("UNAUTHORIZED");
  const me =
    await ctx.db.query("users")
      .withIndex("by_clerkId", (q: any) => q.eq("clerkId", identity.subject))
      .unique();
  if (!me) throw new Error("USER_NOT_FOUND");
  return me;
}

/**
 * Query: lista mis pedidos (cliente autenticado)
 */
export const listMine = query({
  args: {},
  handler: async (ctx) => {
    const me = await getMeByClerkId(ctx);
    const orders = await ctx.db
      .query("orders")
      .withIndex("by_user", (q: any) => q.eq("userId", me._id))
      .collect();

    // Opcional: ordenar por fecha desc
    orders.sort((a: any, b: any) => b.createdAt - a.createdAt);
    return orders;
  },
});

/**
 * Query: lista recientes (admin)
 */
export const listRecent = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, { limit }) => {
    const me = await getMeByClerkId(ctx);
    if (me.role !== "admin") throw new Error("FORBIDDEN");

    // Simple: trae todos y corta (puedes usar paginación más adelante)
    const orders = await ctx.db.query("orders").collect();
    orders.sort((a: any, b: any) => b.createdAt - a.createdAt);
    return orders.slice(0, limit ?? 50);
  },
});

/**
 * Mutation: sincroniza un pedido desde payload de Shopify (webhook o admin API)
 * Espera un objeto shape mínimo con campos estándar
 */
export const syncFromShopify = mutation({
  args: {
    shopifyOrderId: v.string(),
    name: v.string(),
    email: v.optional(v.string()),
    currencyCode: v.optional(v.string()),
    totalPrice: v.optional(v.number()),
    subtotalPrice: v.optional(v.number()),
    status: v.string(),
    createdAt: v.number(), // ms
    updatedAt: v.number(), // ms
    items: v.optional(
      v.array(
        v.object({
          title: v.string(),
          quantity: v.number(),
          price: v.number(),
          shopifyProductId: v.optional(v.string()),
        })
      )
    ),
    raw: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    // 1) Buscar user por email (o mantener mapeo externo tienda→usuario)
    let userId = null;

    if (args.email) {
      const lower = args.email.toLowerCase();
      const byEmail = await ctx.db
        .query("users")
        .withIndex("by_email", (q: any) => q.eq("email", lower))
        .unique();
      if (byEmail) userId = byEmail._id;
    }

    // Si no hay userId, puedes crear un "guest holder" o dejarlo null y luego repararlo
    if (!userId) {
      // Opcional: regístralo como guest en el futuro
      // Por ahora, lanzamos para mantener data consistente:
      // throw new Error("ORDER_WITHOUT_USER");
    }

    // 2) Upsert del pedido
    const existing = await ctx.db
      .query("orders")
      .withIndex("by_shopifyId", (q: any) => q.eq("shopifyOrderId", args.shopifyOrderId))
      .unique();

    let orderId;
    if (!existing) {
      orderId = await ctx.db.insert("orders", {
        userId: userId ?? (await getMeByClerkId(ctx))._id, // fallback si llega autenticado
        shopifyOrderId: args.shopifyOrderId,
        name: args.name,
        status: args.status,
        currencyCode: args.currencyCode,
        totalPrice: args.totalPrice ?? undefined,
        subtotalPrice: args.subtotalPrice ?? undefined,
        createdAt: args.createdAt,
        updatedAt: args.updatedAt,
        raw: args.raw ?? undefined,
      });
    } else {
      await ctx.db.patch(existing._id, {
        name: args.name,
        status: args.status,
        currencyCode: args.currencyCode ?? existing.currencyCode,
        totalPrice: args.totalPrice ?? existing.totalPrice,
        subtotalPrice: args.subtotalPrice ?? existing.subtotalPrice,
        updatedAt: args.updatedAt,
        raw: args.raw ?? existing.raw,
      });
      orderId = existing._id;
    }

    // 3) Reemplazar items (simple)
    if (args.items && args.items.length) {
      // borra items existentes
      const oldItems = await ctx.db
        .query("orderItems")
        .withIndex("by_order", (q: any) => q.eq("orderId", orderId))
        .collect();
      await Promise.all(oldItems.map((it: any) => ctx.db.delete(it._id)));

      // inserta nuevos
      for (const it of args.items) {
        await ctx.db.insert("orderItems", {
          orderId,
          shopifyProductId: it.shopifyProductId ?? undefined,
          title: it.title,
          quantity: it.quantity,
          price: it.price,
        });
      }
    }

    return await ctx.db.get(orderId);
  },
});

3) Convex – functions/products.ts (opcional cache de catálogo)
// convex/functions/products.ts
import { mutation, query } from "../_generated/server";
import { v } from "convex/values";

export const listCached = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, { limit }) => {
    const all = await ctx.db.query("productCache").collect();
    all.sort((a: any, b: any) => b.updatedAt - a.updatedAt);
    return all.slice(0, limit ?? 50);
  },
});

export const upsertCache = mutation({
  args: {
    shopifyProductId: v.string(),
    title: v.string(),
    handle: v.string(),
    image: v.optional(v.string()),
    price: v.optional(v.number()),
    currencyCode: v.optional(v.string()),
    raw: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("productCache")
      .withIndex("by_shopifyProductId", (q: any) => q.eq("shopifyProductId", args.shopifyProductId))
      .unique();

    if (!existing) {
      const id = await ctx.db.insert("productCache", {
        ...args,
        updatedAt: Date.now(),
      });
      return await ctx.db.get(id);
    } else {
      await ctx.db.patch(existing._id, {
        ...args,
        updatedAt: Date.now(),
      });
      return await ctx.db.get(existing._id);
    }
  },
});

4) Next.js – src/lib/shopifyClient.ts
// src/lib/shopifyClient.ts
const STORE_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN!;
const SF_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_API_TOKEN!;
const ADMIN_KEY = process.env.SHOPIFY_ADMIN_API_KEY!;
const ADMIN_SECRET = process.env.SHOPIFY_ADMIN_API_SECRET!;
const API_VERSION = process.env.SHOPIFY_API_VERSION || "2025-07";

// Storefront GraphQL (catálogo público)
export async function shopifyStorefrontFetch<T = any>(query: string, variables?: Record<string, any>) {
  const res = await fetch(`https://${STORE_DOMAIN}/api/${API_VERSION}/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": SF_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Storefront API error: ${res.status}`);
  const json = await res.json();
  if (json.errors) throw new Error(JSON.stringify(json.errors));
  return json.data as T;
}

// Admin GraphQL (privado – pedidos, etc.)
export async function shopifyAdminFetch<T = any>(query: string, variables?: Record<string, any>) {
  const res = await fetch(`https://${STORE_DOMAIN}/admin/api/${API_VERSION}/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": ADMIN_SECRET || ADMIN_KEY, // según configuración
    },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Admin API error: ${res.status}`);
  const json = await res.json();
  if (json.errors) throw new Error(JSON.stringify(json.errors));
  return json.data as T;
}

5) Next.js – /app/(marketing)/shop/page.tsx (catálogo real desde Storefront)
// src/app/(marketing)/shop/page.tsx
import { shopifyStorefrontFetch } from "@/lib/shopifyClient";

export default async function ShopPage() {
  const data = await shopifyStorefrontFetch<{
    products: {
      edges: {
        node: {
          id: string;
          title: string;
          handle: string;
          images: { edges: { node: { src?: string; url?: string } }[] };
          priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
        };
      }[];
    };
  }>(`
    query Products {
      products(first: 12) {
        edges {
          node {
            id
            title
            handle
            images(first: 1) { edges { node { url } } }
            priceRange { minVariantPrice { amount currencyCode } }
          }
        }
      }
    }
  `);

  const products = data.products.edges.map((e) => e.node);

  return (
    <main className="min-h-screen bg-black text-white p-6">
      <h1 className="text-2xl font-bold mb-6">Tienda</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
        {products.map((p) => {
          const img = p.images.edges[0]?.node?.url;
          const price = p.priceRange.minVariantPrice;
          return (
            <a
              key={p.id}
              href={`https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/products/${p.handle}`}
              className="rounded-xl border border-white/10 bg-white/5 overflow-hidden"
            >
              <div className="aspect-square bg-white/5 grid place-items-center text-zinc-500">
                {img ? <img src={img} alt={p.title} className="h-full w-full object-cover" /> : "Sin imagen"}
              </div>
              <div className="p-3">
                <h3 className="font-semibold">{p.title}</h3>
                <p className="text-sm text-zinc-400">
                  {price.amount} {price.currencyCode}
                </p>
              </div>
            </a>
          );
        })}
      </div>
    </main>
  );
}


Nota: de momento linkeo cada producto al PDP de tu tienda Shopify (rápido y robusto). Más adelante puedes hacer PDPs propios en Next y crear el checkout vía cart API si lo deseas.

6) Next.js – Webhook de Shopify (opcional espejo → Convex)

Shopify requiere verificar HMAC. Este handler es el esqueleto:

// src/app/api/webhooks/shopify/route.ts
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { shopifyAdminFetch } from "@/lib/shopifyClient";
import { createClient } from "@convex-dev/convex-labs"; // o usa fetch a /api/convex si prefieres
// ↑ reemplaza por tu forma habitual de invocar Convex desde server (RSC).

const SHOPIFY_WEBHOOK_SECRET = process.env.SHOPIFY_WEBHOOK_SECRET!;

function verifyHmac(rawBody: string, hmacHeader?: string | null) {
  if (!hmacHeader) return false;
  const digest = crypto
    .createHmac("sha256", SHOPIFY_WEBHOOK_SECRET)
    .update(rawBody, "utf8")
    .digest("base64");
  return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(hmacHeader));
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const hmacHeader = req.headers.get("x-shopify-hmac-sha256");
  const topic = req.headers.get("x-shopify-topic");

  if (!verifyHmac(rawBody, hmacHeader)) {
    return NextResponse.json({ ok: false, error: "INVALID_HMAC" }, { status: 401 });
  }

  const payload = JSON.parse(rawBody);

  // Ejemplo: orders/paid → llama a Admin API para ampliar detalles si lo deseas
  if (topic?.startsWith("orders/")) {
    // Mapea a tu payload para Convex
    const order = payload; // ya trae casi todo en webhooks
    const items =
      order?.line_items?.map((li: any) => ({
        title: li.title,
        quantity: Number(li.quantity),
        price: Number(li.price),
        shopifyProductId: li.product_id ? String(li.product_id) : undefined,
      })) ?? [];

    // Convierte a milisegundos
    const createdAt = Number(new Date(order.created_at).getTime());
    const updatedAt = Number(new Date(order.updated_at).getTime());

    // Llama a Convex (usa tu cliente/endpoint de server)
    // Pseudocódigo (ajústalo a tu método real):
    // await convex.mutation("orders.syncFromShopify", {...})
    // Si usas fetch a una API interna que a su vez llama a Convex, hazlo ahí.

    // Respuesta
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ ok: true });
}


Importante: en producción configura el webhook en Shopify a esta ruta (/api/webhooks/shopify) y define SHOPIFY_WEBHOOK_SECRET.

7) Variables de entorno (añade/ajusta)
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
CLERK_SECRET_KEY=...

# Convex
CONVEX_DEPLOYMENT=...
NEXT_PUBLIC_CONVEX_URL=...

# Shopify
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=megapesca.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_API_TOKEN=...
SHOPIFY_ADMIN_API_KEY=...
SHOPIFY_ADMIN_API_SECRET=...
SHOPIFY_API_VERSION=2025-07
SHOPIFY_WEBHOOK_SECRET=...

# Wompi (SOLO para referencia; en Shopify se configuran en la app oficial)
WOMPI_PUBLIC_KEY=...
WOMPI_PRIVATE_KEY=...
WOMPI_EVENTS_SECRET=...

8) UI mínima en dashboards

Cliente (/dashboard/client/page.tsx) – ya tienes captures; añade pedidos:

// snippet: añade debajo de "captures"
const orders = useQuery(api.functions.orders.listMine, {});
/* Renderiza:
orders?.map(o => (
  <li key={o._id}>#{o.name} — {o.totalPrice ?? "—"} {o.currencyCode ?? ""} — {o.status}</li>
))
*/


Admin (/dashboard/admin/page.tsx) – métrica simple:

const recent = useQuery(api.functions.orders.listRecent, { limit: 10 });
/* Render: total últimos N, listado, etc. */

¿Qué queda listo con este blueprint?

✅ Catálogo /shop desde Shopify Storefront.

✅ Esquema Convex para orders e items (mirror).

✅ Mutación syncFromShopify para registrar/actualizar pedidos.

✅ Hooks de cliente/admin para listar pedidos.

✅ Webhook de Shopify (esqueleto con HMAC).

Con esto ya puedes:

Mostrar productos reales en /shop.

Recibir pedidos en Shopify con Wompi (plugin oficial).

Sincronizar pedidos a Convex (cuando actives el webhook).

Ver pedidos por usuario en el dashboard cliente y métricas en admin.