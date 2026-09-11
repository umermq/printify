/**
 * Reading an order's contents, whatever era the row was written in.
 *
 * The local order store used to keep one row per cart line, so a customer who
 * bought three products showed up in the admin as three separate orders, each
 * priced as if it were the whole sale. Orders now carry their lines, but rows
 * written before that — and the seeded demo data — do not, so everything reads
 * them through here rather than touching `items` directly.
 */
import type { Order, OrderLine } from "@/contexts/OrderContext";

/** An order's lines. A row from before orders carried lines is one line. */
export function orderLines(order: Order): OrderLine[] {
  if (order.items?.length) return order.items;
  return [{
    product: order.product,
    size: order.size,
    theme: order.theme,
    quantity: 1,
    unitPrice: order.amount,
    images: order.images ?? [],
  }];
}

/** "Photo Prints" or "Photo Prints + 2 more" — for list columns. */
export function orderSummary(order: Order): string {
  const names = [...new Set(orderLines(order).map((l) => l.product))];
  if (names.length <= 1) return names[0] ?? "";
  return `${names[0]} + ${names.length - 1} more`;
}

/** Total physical pieces, which is what a print shop counts. */
export function orderItemCount(order: Order): number {
  return orderLines(order).reduce((sum, l) => sum + l.quantity, 0);
}
