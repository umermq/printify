import { supabase } from "@/integrations/supabase/client";
import type { CartItem } from "@/contexts/CartContext";

export interface CheckoutDetails {
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  paymentMethod: "cod" | "online";
}

/**
 * Every orders policy is scoped to auth.uid(), and storage RLS resolves an
 * object's parent order from the first path segment ({order_id}/{file}), so
 * a checkout cannot write anything without a session. Guests get an anonymous
 * one — a real auth.users row, but no login screen and no password.
 */
async function ensureSession(): Promise<string> {
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.user) return session.user.id;

  const { data, error } = await supabase.auth.signInAnonymously();
  if (error || !data.user) {
    throw new Error(
      `Could not start a guest session (${error?.message ?? "no user returned"}). ` +
        "Anonymous sign-ins must be enabled for this project under Authentication → Sign In / Providers."
    );
  }
  return data.user.id;
}

function fileExtension(file: File): string {
  const fromName = file.name.split(".").pop();
  if (fromName && /^[a-z0-9]{1,5}$/i.test(fromName)) return fromName.toLowerCase();
  return file.type.split("/")[1] || "jpg";
}

/**
 * Writes one order, its line items, and the customer's photos to Supabase.
 * Returns the new order's id.
 *
 * The order row has to exist before any photo can be uploaded, so a failure
 * partway through leaves an order with fewer photos than the customer picked.
 * Customers have no delete policy on orders, so the order cannot be rolled
 * back from the browser — the error names the order id instead, which is what
 * support needs to find it.
 */
export async function placeOrder(
  details: CheckoutDetails,
  items: CartItem[],
  totalAmount: number
): Promise<string> {
  const userId = await ensureSession();

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: userId,
      status: "Pending Confirmation",
      total_amount: totalAmount,
      payment_method: details.paymentMethod === "cod" ? "COD" : "Online",
      city: details.city,
      address: details.address,
      customer_name: details.name,
      customer_phone: details.phone,
      customer_email: details.email || null,
    })
    .select("id")
    .single();

  if (orderError || !order) {
    throw new Error(`Could not create the order: ${orderError?.message ?? "no row returned"}`);
  }
  const orderId = order.id;

  // Insert the items one round-trip, then keep each row id beside the cart
  // item it came from: a photo is only useful to the print shop if the size
  // and finish it belongs to travel with it.
  const withProduct = items.filter((item) => item.productDbId);

  let insertedItems: { id: string }[] = [];
  if (withProduct.length) {
    const { data, error } = await supabase
      .from("order_items")
      .insert(
        withProduct.map((item) => ({
          order_id: orderId,
          product_id: item.productDbId!,
          variant_id: item.variantId ?? null,
          theme_id: item.themeId ?? null,
          quantity: item.quantity,
          unit_price: item.price,
        }))
      )
      .select("id");
    if (error) throw new Error(`Order ${orderId} was created but its items could not be saved: ${error.message}`);
    insertedItems = data ?? [];
  }

  // PostgREST returns inserted rows in the order they were sent, which is what
  // pairs each item id back to its cart item. If that ever does not hold the
  // photos still upload — they just attach to the order rather than the line.
  const photos: { file: File; orderItemId: string | null }[] = [];
  withProduct.forEach((item, index) => {
    for (const file of item.photoFiles ?? []) {
      photos.push({ file, orderItemId: insertedItems[index]?.id ?? null });
    }
  });
  for (const item of items.filter((i) => !i.productDbId)) {
    for (const file of item.photoFiles ?? []) photos.push({ file, orderItemId: null });
  }

  const uploaded: { key: string; orderItemId: string | null }[] = [];

  for (const [index, photo] of photos.entries()) {
    const key = `${orderId}/${index + 1}-${crypto.randomUUID()}.${fileExtension(photo.file)}`;
    const { error } = await supabase.storage
      .from("order-images")
      .upload(key, photo.file, { contentType: photo.file.type || "image/jpeg", upsert: false });
    if (error) {
      throw new Error(
        `Order ${orderId} was created, but photo ${index + 1} of ${photos.length} failed to upload: ${error.message}`
      );
    }
    uploaded.push({ key, orderItemId: photo.orderItemId });
  }

  if (uploaded.length) {
    const { error } = await supabase.from("order_images").insert(
      uploaded.map(({ key, orderItemId }) => ({
        order_id: orderId,
        order_item_id: orderItemId,
        storage_key_preview: key,
        storage_key_print: key,
        source: "device",
      }))
    );
    if (error) {
      throw new Error(`Order ${orderId}: photos uploaded but could not be linked to the order: ${error.message}`);
    }
  }

  return orderId;
}

/**
 * Signed URLs for an order's photos. The bucket is private, so these expire —
 * an hour is long enough for an admin or print shop to open them.
 */
export async function getOrderPhotoUrls(orderId: string): Promise<string[]> {
  const { data: rows, error } = await supabase
    .from("order_images")
    .select("storage_key_preview")
    .eq("order_id", orderId);
  if (error) throw new Error(error.message);

  const keys = (rows ?? []).map((row) => row.storage_key_preview).filter((key): key is string => Boolean(key));
  if (!keys.length) return [];

  const { data, error: signError } = await supabase.storage.from("order-images").createSignedUrls(keys, 60 * 60);
  if (signError) throw new Error(signError.message);

  return (data ?? []).map((entry) => entry.signedUrl).filter(Boolean);
}
