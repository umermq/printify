/**
 * Orders, read from the database rather than from the browser.
 *
 * The admin used to read a copy of each order kept in localStorage, written by
 * the checkout page alongside the real one. That copy only ever existed in the
 * browser that placed the order, so a shop owner opening the admin on a second
 * device — or looking for a customer's order, which was written in the
 * customer's browser — saw nothing. It also drifted: the copy was written per
 * cart line, so one checkout showed up as several orders.
 *
 * public.orders is the record. Admin RLS ("Admins manage all orders") lets a
 * signed-in admin read every row; anyone else gets an empty list rather than
 * an error, which is what the RoleGuard on these pages already assumes.
 */
import { supabase } from "@/integrations/supabase/client";
import type { Order, OrderLine } from "@/contexts/OrderContext";

/**
 * What the admin shows as "Batch #". The order's own id, shortened to
 * something a person can read down a phone, and still unique enough to find
 * the row it came from.
 */
export function batchNumber(orderId: string): string {
  return `ORD-${orderId.replace(/-/g, "").slice(0, 8).toUpperCase()}`;
}

/** The shape PostgREST returns for the query below. */
interface OrderRow {
  id: string;
  status: string | null;
  total_amount: number | string | null;
  payment_method: string | null;
  city: string | null;
  tracking_number: string | null;
  created_at: string | null;
  customer_name: string | null;
  customer_phone: string | null;
  customer_email: string | null;
  print_shops: { name: string } | null;
  order_items: {
    quantity: number | null;
    unit_price: number | string | null;
    products: { name: string } | null;
    product_variants: { size_label: string } | null;
    product_themes: { name: string } | null;
  }[] | null;
}

const SELECT = `
  id, status, total_amount, payment_method, city,
  tracking_number, created_at, customer_name, customer_phone, customer_email,
  print_shops ( name ),
  order_items (
    quantity, unit_price,
    products ( name ),
    product_variants ( size_label ),
    product_themes ( name )
  )
`;

function toOrder(row: OrderRow): Order {
  const items: OrderLine[] = (row.order_items ?? []).map((item) => ({
    // A product deleted from the catalog leaves the line intact; naming it
    // beats rendering a blank cell on a job the shop still has to print.
    product: item.products?.name ?? "Unknown product",
    size: item.product_variants?.size_label ?? "",
    theme: item.product_themes?.name ?? "",
    quantity: item.quantity ?? 1,
    unitPrice: Number(item.unit_price ?? 0),
    images: [],
  }));

  const amount = Number(row.total_amount ?? 0);
  const linesTotal = items.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0);

  return {
    id: batchNumber(row.id),
    supabaseOrderId: row.id,
    customer: row.customer_name?.trim() || "Guest",
    email: row.customer_email ?? "",
    phone: row.customer_phone ?? "",
    city: row.city ?? "",
    items,
    product: items[0]?.product ?? "",
    size: items[0]?.size ?? "",
    theme: items[0]?.theme ?? "",
    status: row.status ?? "Pending Confirmation",
    amount,
    // Orders store one total; whatever it exceeds the lines by is shipping.
    shipping: Math.max(0, Math.round((amount - linesTotal) * 100) / 100),
    date: (row.created_at ?? "").slice(0, 10),
    paymentMethod: row.payment_method ?? "",
    trackingNumber: row.tracking_number ?? "",
    assignedShop: row.print_shops?.name ?? "",
    // Photos live in the private bucket and are fetched as signed URLs by
    // whoever displays them — they expire, so they are not cached here.
    images: [],
  };
}

export async function fetchOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from("orders")
    .select(SELECT)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return ((data ?? []) as unknown as OrderRow[]).map(toOrder);
}

/**
 * Writes an admin's change back to the order. Only the fields the admin can
 * actually edit are mapped; anything else in the patch is display state and
 * is ignored on purpose.
 */
export async function updateOrderRow(orderId: string, updates: Partial<Order>): Promise<void> {
  const patch: Record<string, unknown> = {};

  if (updates.status !== undefined) patch.status = updates.status;
  if (updates.trackingNumber !== undefined) patch.tracking_number = updates.trackingNumber;

  if (updates.assignedShop !== undefined) {
    if (!updates.assignedShop) {
      patch.print_shop_id = null;
    } else {
      const { data: shop, error } = await supabase
        .from("print_shops")
        .select("id")
        .eq("name", updates.assignedShop)
        .maybeSingle();
      if (error) throw new Error(error.message);
      if (!shop) {
        // Silently dropping this would leave the admin believing a shop had
        // been assigned when the order still has none.
        throw new Error(
          `"${updates.assignedShop}" is not a print shop in the database yet, so the order was not assigned.`
        );
      }
      patch.print_shop_id = shop.id;
    }
  }

  if (!Object.keys(patch).length) return;

  const { error } = await supabase.from("orders").update(patch).eq("id", orderId);
  if (error) throw new Error(error.message);
}
