import { describe, it, expect, beforeEach, vi } from "vitest";
import { placeOrder, type CheckoutDetails } from "@/lib/orders";
import type { CartItem } from "@/contexts/CartContext";

const ORDER_ID = "11111111-2222-3333-4444-555555555555";

type Captured = {
  orders: Record<string, unknown>[];
  order_items: Record<string, unknown>[];
  order_images: Record<string, unknown>[];
  uploads: { key: string; file: File }[];
};

let captured: Captured;
let session: { user: { id: string } } | null;
let anonymousSignIn: () => { data: { user: { id: string } | null }; error: { message: string } | null };
let uploadResult: () => { error: { message: string } | null };

vi.mock("@/integrations/supabase/client", () => {
  /**
   * Chainable enough for `.insert(...)`, `.insert(...).select(...).single()`,
   * `.insert(...).select(...)` awaited for the inserted rows, and a bare await.
   *
   * Inserted rows come back with generated ids in the order they were sent,
   * which is what lets a caller pair each row id to what it inserted.
   */
  const insertable = (table: keyof Captured, rows: unknown) => {
    const list = Array.isArray(rows) ? rows : [rows];
    const firstIndex = captured[table].length;
    captured[table].push(...(list as Record<string, unknown>[]));
    const inserted = list.map((_, i) => ({ id: `${table}-row-${firstIndex + i}` }));
    const settled = Promise.resolve({ data: null, error: null });
    return {
      select: () => ({
        single: async () => ({ data: { id: ORDER_ID }, error: null }),
        then: (onFulfilled: unknown, onRejected: unknown) =>
          Promise.resolve({ data: inserted, error: null }).then(onFulfilled as never, onRejected as never),
      }),
      then: (onFulfilled: unknown, onRejected: unknown) =>
        settled.then(onFulfilled as never, onRejected as never),
    };
  };

  return {
    supabase: {
      auth: {
        getSession: async () => ({ data: { session } }),
        signInAnonymously: async () => anonymousSignIn(),
      },
      from: (table: keyof Captured) => ({
        insert: (rows: unknown) => insertable(table, rows),
      }),
      storage: {
        from: () => ({
          upload: async (key: string, file: File) => {
            const result = uploadResult();
            if (!result.error) captured.uploads.push({ key, file });
            return result;
          },
        }),
      },
    },
  };
});

const details: CheckoutDetails = {
  name: "Ahmed Khan",
  phone: "0300-1234567",
  email: "ahmed@example.com",
  address: "House 12, Gulberg III",
  city: "Lahore",
  paymentMethod: "cod",
};

const photo = (name: string) => new File(["binary"], name, { type: "image/jpeg" });

const cartItem = (overrides: Partial<CartItem> = {}): CartItem => ({
  id: "photo-mug-classic-1",
  name: "Photo Mug - Classic",
  category: "Custom Mugs",
  size: "11oz Standard",
  theme: "Full Wrap",
  quantity: 2,
  price: 800,
  image: "https://example.com/mug.jpg",
  uploadedImages: ["data:image/jpeg;base64,AAA"],
  photoFiles: [photo("mug.jpg")],
  productDbId: "aaaaaaaa-0000-0000-0000-000000000001",
  variantId: "bbbbbbbb-0000-0000-0000-000000000002",
  themeId: "cccccccc-0000-0000-0000-000000000003",
  ...overrides,
});

beforeEach(() => {
  captured = { orders: [], order_items: [], order_images: [], uploads: [] };
  session = null;
  anonymousSignIn = () => ({ data: { user: { id: "guest-user-id" } }, error: null });
  uploadResult = () => ({ error: null });

  if (!globalThis.crypto?.randomUUID) {
    Object.defineProperty(globalThis, "crypto", {
      value: { ...globalThis.crypto, randomUUID: () => "abcd-1234" },
      configurable: true,
    });
  }
});

describe("placeOrder", () => {
  it("signs a guest in anonymously and saves the order against that user", async () => {
    const orderId = await placeOrder(details, [cartItem()], 1600);

    expect(orderId).toBe(ORDER_ID);
    expect(captured.orders).toHaveLength(1);
    expect(captured.orders[0]).toMatchObject({
      user_id: "guest-user-id",
      status: "Pending Confirmation",
      total_amount: 1600,
      payment_method: "COD",
      city: "Lahore",
      customer_name: "Ahmed Khan",
      customer_phone: "0300-1234567",
      customer_email: "ahmed@example.com",
    });
  });

  it("reuses an existing session instead of creating a second guest", async () => {
    session = { user: { id: "returning-user-id" } };
    const signIn = vi.fn(() => ({ data: { user: { id: "guest-user-id" } }, error: null }));
    anonymousSignIn = signIn;

    await placeOrder(details, [cartItem()], 800);

    expect(signIn).not.toHaveBeenCalled();
    expect(captured.orders[0]).toMatchObject({ user_id: "returning-user-id" });
  });

  it("records each cart line against the catalog rows it came from", async () => {
    await placeOrder(details, [cartItem()], 1600);

    expect(captured.order_items).toEqual([
      {
        order_id: ORDER_ID,
        product_id: "aaaaaaaa-0000-0000-0000-000000000001",
        variant_id: "bbbbbbbb-0000-0000-0000-000000000002",
        theme_id: "cccccccc-0000-0000-0000-000000000003",
        quantity: 2,
        unit_price: 800,
      },
    ]);
  });

  it("uploads every photo under the order's own folder, which is what storage RLS checks", async () => {
    const item = cartItem({ photoFiles: [photo("first.jpg"), photo("second.PNG")] });

    await placeOrder(details, [item], 1600);

    expect(captured.uploads).toHaveLength(2);
    for (const upload of captured.uploads) {
      expect(upload.key.startsWith(`${ORDER_ID}/`)).toBe(true);
    }
    expect(captured.uploads[0].key.endsWith(".jpg")).toBe(true);
    expect(captured.uploads[1].key.endsWith(".png")).toBe(true);
    expect(captured.order_images).toHaveLength(2);
    expect(captured.order_images[0]).toMatchObject({ order_id: ORDER_ID, source: "device" });
  });

  it("explains how to switch anonymous sign-ins on when the project has them disabled", async () => {
    anonymousSignIn = () => ({ data: { user: null }, error: { message: "Anonymous sign-ins are disabled" } });

    await expect(placeOrder(details, [cartItem()], 800)).rejects.toThrow(/Anonymous sign-ins are disabled/);
    await expect(placeOrder(details, [cartItem()], 800)).rejects.toThrow(/Authentication → Sign In \/ Providers/);
    expect(captured.orders).toHaveLength(0);
  });

  it("names the order id when a photo fails to upload, since the order cannot be rolled back", async () => {
    uploadResult = () => ({ error: { message: "Payload too large" } });

    await expect(placeOrder(details, [cartItem()], 800)).rejects.toThrow(ORDER_ID);
    expect(captured.order_images).toHaveLength(0);
  });

  it("places an order with no line items rather than failing when the catalog ids are missing", async () => {
    const item = cartItem({ productDbId: undefined, photoFiles: [] });

    await expect(placeOrder(details, [item], 800)).resolves.toBe(ORDER_ID);
    expect(captured.order_items).toHaveLength(0);
    expect(captured.uploads).toHaveLength(0);
  });
});

describe("photo to line item linking", () => {
  it("links each photo to the line item whose size and finish it was ordered at", async () => {
    await placeOrder(
      details,
      [
        cartItem({ id: "print-4x6", size: '4"x6"', variantId: "v-4x6", photoFiles: [photo("beach.jpg")] }),
        cartItem({ id: "print-5x7", size: '5"x7"', variantId: "v-5x7", photoFiles: [photo("wedding.jpg")] }),
      ],
      1000
    );

    expect(captured.order_items).toHaveLength(2);
    expect(captured.order_items[0].variant_id).toBe("v-4x6");
    expect(captured.order_items[1].variant_id).toBe("v-5x7");

    // Without this the print shop knows five photos and two sizes were bought,
    // but not which photo goes on which size.
    expect(captured.order_images.map((row) => row.order_item_id)).toEqual([
      "order_items-row-0",
      "order_items-row-1",
    ]);
  });

  it("links every photo of a multi-photo item to that same line item", async () => {
    await placeOrder(
      details,
      [cartItem({ photoFiles: [photo("a.jpg"), photo("b.jpg"), photo("c.jpg")] })],
      2400
    );

    expect(captured.order_images).toHaveLength(3);
    expect(new Set(captured.order_images.map((row) => row.order_item_id))).toEqual(
      new Set(["order_items-row-0"])
    );
  });

  it("still uploads photos that belong to no catalog item, attached to the order alone", async () => {
    await placeOrder(
      details,
      [cartItem({ productDbId: undefined, photoFiles: [photo("orphan.jpg")] })],
      800
    );

    expect(captured.order_items).toHaveLength(0);
    expect(captured.uploads).toHaveLength(1);
    expect(captured.order_images[0].order_item_id).toBeNull();
  });
});
