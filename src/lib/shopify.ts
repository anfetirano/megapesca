const ADMIN_BASE_URL = `https://${process.env.SHOPIFY_STORE_DOMAIN}/admin/api/2024-10`; // usa la API actual

function requiredEnv(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

const SHOPIFY_ADMIN_TOKEN = requiredEnv("SHOPIFY_ADMIN_TOKEN");

export async function shopifyAdminFetch<T>(
  path: string,
  init?: RequestInit & { asJson?: boolean }
): Promise<T> {
  const url = `${ADMIN_BASE_URL}${path}`;
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "X-Shopify-Access-Token": SHOPIFY_ADMIN_TOKEN,
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    ...init,
    body: init?.body,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Shopify ${res.status} ${res.statusText}: ${text}`);
  }
  return (await res.json()) as T;
}
