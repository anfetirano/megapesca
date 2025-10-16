// src/app/(marketing)/shop/page.tsx
import { redirect } from "next/navigation";

export default function ShopRedirect() {
  redirect("https://store.megapesca.co"); // cambia al dominio real de tu tienda
}