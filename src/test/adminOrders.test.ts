import { describe, it, expect, beforeEach, vi } from "vitest";
import { fetchOrders, updateOrderRow, batchNumber } from "@/lib/adminOrders";

/**
 * These cover the translation between a database row and what the admin
 * renders — the join shape, the derived shipping, and the cases where a
 * related row is missing.
 */

let orderRows: unknown[];
let orderError: { message: string } | null;
let printShopRow: { id: string } | null;
let updates: { patch: Record<string, unknown>; id: string }[];

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    from: (table: string) => {
      if (table === "print_shops") {
        return {
          select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: printShopRow, error: null }) }) }),
        };
      }
      return {
        select: () => ({ order: async () => ({ data: orderRows, error: orderError }) }),
        update: (patch: Record<string, unknown>) => ({
          eq: async (_col: string, id: string) => {
            updates.push({ patch, id });
            return { error: null };
          },
        }),
      };
    },
  },
}));

const ORDER_UUID = "4a056453-79e5-4ca5-bb2f-8677084caffb";

const row = (overrides: Record<string, unknown> = {}) => ({
  id: ORDER_UUID,
  status: "Pending Confirmation",
  total_amount: "1150.00",
  payment_method: "COD",
  city: "Karachi",
  tracking_number: null,
  created_at: "2026-09-11T19:25:03.109233+00:00",
  customer_name: "M Omer Qureshi",
  customer_phone: "0300-1234567",
  customer_email: null,
  print_shops: null,
  order_items: [
    { quantity: 2, unit_price: "150.00", products: { name: "Photo Prints" }, product_variants: { size_label: "4x6 inches" }, product_themes: { name: "Glossy" } },
    { quantity: 2, unit_price: "150.00", products: { name: "Photo Prints" }, product_variants: { size_label: "4x6 inches" }, product_themes: { name: "Glossy" } },
    { quantity: 2, unit_price: "150.00", products: { name: "Photo Prints" }, product_variants: { size_label: "4x6 inches" }, product_themes: { name: "Glossy" } },
  ],
  ...overrides,
});

beforeEach(() => {
  orderRows = [row()];
  orderError = null;
  printShopRow = null;
  updates = [];
});

describe("batchNumber", () => {
  it("is short enough to read out and derived from the row id", () => {
    expect(batchNumber(ORDER_UUID)).toBe("ORD-4A056453");
  });
});

describe("fetchOrders", () => {
  it("returns one order for one checkout, whatever the line count", async () => {
    const orders = await fetchOrders();
    expect(orders).toHaveLength(1);
    expect(orders[0].items).toHaveLength(3);
    expect(orders[0].amount).toBe(1150);
  });

  it("derives shipping from whatever the total exceeds the lines by", async () => {
    // 3 lines x 2 x Rs 150 = Rs 900, against a Rs 1150 total.
    expect((await fetchOrders())[0].shipping).toBe(250);
  });

  it("never reports negative shipping when a total was discounted below its lines", async () => {
    orderRows = [row({ total_amount: "500.00" })];
    expect((await fetchOrders())[0].shipping).toBe(0);
  });

  it("carries the row id so photos and updates can find the order", async () => {
    expect((await fetchOrders())[0].supabaseOrderId).toBe(ORDER_UUID);
  });

  it("names a guest checkout rather than showing a blank customer", async () => {
    orderRows = [row({ customer_name: "   " })];
    expect((await fetchOrders())[0].customer).toBe("Guest");
  });

  it("keeps a line whose product was deleted from the catalog", async () => {
    orderRows = [row({ order_items: [{ quantity: 1, unit_price: "150.00", products: null, product_variants: null, product_themes: null }] })];
    const order = (await fetchOrders())[0];
    expect(order.items?.[0].product).toBe("Unknown product");
    expect(order.items?.[0].size).toBe("");
  });

  it("handles an order with no lines at all", async () => {
    orderRows = [row({ order_items: [] })];
    const order = (await fetchOrders())[0];
    expect(order.items).toEqual([]);
    expect(order.shipping).toBe(1150);
  });

  it("surfaces a query failure instead of reporting an empty order list", async () => {
    orderError = { message: "permission denied for table orders" };
    await expect(fetchOrders()).rejects.toThrow(/permission denied/);
  });
});

describe("updateOrderRow", () => {
  it("maps the admin's fields onto the order's columns", async () => {
    await updateOrderRow(ORDER_UUID, { status: "Confirmed", trackingNumber: "TRK-1" });
    expect(updates).toEqual([{ id: ORDER_UUID, patch: { status: "Confirmed", tracking_number: "TRK-1" } }]);
  });

  it("ignores display-only fields rather than writing columns that do not exist", async () => {
    await updateOrderRow(ORDER_UUID, { customer: "Someone Else", amount: 99 });
    expect(updates).toEqual([]);
  });

  it("refuses to assign a print shop that is not in the database", async () => {
    printShopRow = null;
    await expect(updateOrderRow(ORDER_UUID, { assignedShop: "Lahore Print House" }))
      .rejects.toThrow(/not a print shop in the database/);
    expect(updates).toEqual([]);
  });

  it("resolves a known print shop to its row id", async () => {
    printShopRow = { id: "shop-1" };
    await updateOrderRow(ORDER_UUID, { assignedShop: "Lahore Print House" });
    expect(updates[0].patch).toEqual({ print_shop_id: "shop-1" });
  });

  it("clears the shop when the assignment is removed", async () => {
    await updateOrderRow(ORDER_UUID, { assignedShop: "" });
    expect(updates[0].patch).toEqual({ print_shop_id: null });
  });
});
