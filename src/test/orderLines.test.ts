import { describe, it, expect } from "vitest";
import { orderLines, orderSummary, orderItemCount } from "@/lib/orderLines";
import type { Order } from "@/contexts/OrderContext";

/**
 * The rule these protect: one checkout is one order row. The store used to add
 * a row per cart line, so a customer who bought three products appeared as
 * three orders, each priced as if it were the whole sale.
 *
 * Rows written before that — and the seeded demo data — carry no `items`, and
 * have to keep rendering, so every reader goes through these helpers.
 */

const base: Order = {
  id: "ORD-1",
  customer: "M Omer Qureshi",
  email: "",
  phone: "0300-1234567",
  city: "Karachi",
  product: "Photo Prints",
  size: "4x6 inches",
  theme: "Glossy",
  status: "Pending Confirmation",
  amount: 1150,
  date: "2026-09-11",
  paymentMethod: "COD",
  trackingNumber: "",
  assignedShop: "",
  images: [],
};

const line = (product: string, quantity: number, unitPrice: number) => ({
  product, size: "4x6 inches", theme: "Glossy", quantity, unitPrice, images: [],
});

describe("orderLines", () => {
  it("returns every line of a multi-line order", () => {
    const order: Order = {
      ...base,
      items: [line("Photo Prints", 2, 150), line("Photo Mug", 1, 800), line("Photo Keychain", 2, 500)],
    };
    expect(orderLines(order)).toHaveLength(3);
  });

  it("treats a row written before orders carried lines as a single line", () => {
    const lines = orderLines(base);
    expect(lines).toHaveLength(1);
    expect(lines[0]).toMatchObject({ product: "Photo Prints", quantity: 1, unitPrice: 1150 });
  });

  it("treats an empty items array as legacy rather than as an empty order", () => {
    expect(orderLines({ ...base, items: [] })).toHaveLength(1);
  });
});

describe("orderSummary", () => {
  it("names a single product plainly", () => {
    expect(orderSummary({ ...base, items: [line("Photo Prints", 2, 150)] })).toBe("Photo Prints");
  });

  it("counts distinct products, not lines — three prints in three sizes is one product", () => {
    const order: Order = {
      ...base,
      items: [line("Photo Prints", 2, 150), line("Photo Prints", 2, 250), line("Photo Prints", 2, 150)],
    };
    expect(orderSummary(order)).toBe("Photo Prints");
  });

  it("summarises a mixed order", () => {
    const order: Order = { ...base, items: [line("Photo Prints", 2, 150), line("Photo Mug", 1, 800)] };
    expect(orderSummary(order)).toBe("Photo Prints + 1 more");
  });
});

describe("orderItemCount", () => {
  it("counts physical pieces across lines, which is what the print shop makes", () => {
    const order: Order = {
      ...base,
      items: [line("Photo Prints", 2, 150), line("Photo Prints", 2, 250), line("Photo Prints", 2, 150)],
    };
    expect(orderItemCount(order)).toBe(6);
  });

  it("counts a legacy row as one piece", () => {
    expect(orderItemCount(base)).toBe(1);
  });
});
