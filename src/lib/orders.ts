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

  const lineItems = items
    .filter((item) => item.productDbId)
    .map((item) => ({
      order_id: orderId,
      product_id: item.productDbId!,
      variant_id: item.variantId ?? null,
      theme_id: item.themeId ?? null,
      quantity: item.quantity,
      unit_price: item.price,
    }));

  if (lineItems.length) {
    const { error } = await supabase.from("order_items").insert(lineItems);
    if (error) throw new Error(`Order ${orderId} was created but its items could not be saved: ${error.message}`);
  }

  const photos = items.flatMap((item) => item.photoFiles ?? []);
  const storageKeys: string[] = [];

  for (const [index, file] of photos.entries()) {
    const key = `${orderId}/${index + 1}-${crypto.randomUUID()}.${fileExtension(file)}`;
    const { error } = await supabase.storage
      .from("order-images")
      .upload(key, file, { contentType: file.type || "image/jpeg", upsert: false });
    if (error) {
      throw new Error(
        `Order ${orderId} was created, but photo ${index + 1} of ${photos.length} failed to upload: ${error.message}`
      );
    }
    storageKeys.push(key);
  }

  if (storageKeys.length) {
    const { error } = await supabase.from("order_images").insert(
      storageKeys.map((key) => ({
        order_id: orderId,
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
