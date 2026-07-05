import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

export default defineTool({
  name: "site_info",
  title: "PixelCraft site info",
  description: "Return brand, contact, categories, and support info for PixelCraft — a custom printing store in Pakistan.",
  inputSchema: {} as Record<string, z.ZodTypeAny>,
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({
    content: [
      {
        type: "text",
        text: JSON.stringify(
          {
            brand: "PixelCraft",
            country: "Pakistan",
            currency: "PKR",
            categories: ["mugs", "t-shirts", "photo-books", "photo-prints", "gifts"],
            support: { whatsapp: "+92 42 3334442957" },
            paymentMethods: ["COD", "Bank transfer", "Local gateways"],
          },
          null,
          2,
        ),
      },
    ],
  }),
});
