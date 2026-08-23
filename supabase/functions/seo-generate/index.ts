import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

interface ProductInput {
  name: string;
  category?: string;
  description?: string;
  basePrice?: number;
  geoTarget?: string;
  focusKeyword?: string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { product } = (await req.json()) as { product: ProductInput };
    if (!product?.name) {
      return new Response(JSON.stringify({ error: "product.name required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
    if (!ANTHROPIC_API_KEY) throw new Error("ANTHROPIC_API_KEY not configured");

    const geo = product.geoTarget || "Pakistan";
    const price = product.basePrice ? `starting at PKR ${product.basePrice}` : "";

    const systemPrompt = `You are an SEO/AEO/GEO expert for PixelCraft, a custom printing brand in Pakistan (mugs, t-shirts, photo books, photo prints, gifts). Produce meta copy optimized for:
- SEO: Google search, keyword-rich, natural
- AEO: ChatGPT / Perplexity / Google AI Overviews — short direct answer
- GEO: localized to ${geo}, mention PKR pricing context when relevant
Always factual, persuasive, no fluff.`;

    const userPrompt = `Generate SEO metadata for this product:
Name: ${product.name}
Category: ${product.category || "n/a"}
Description: ${product.description || "n/a"}
Price: ${price}
Focus keyword (optional): ${product.focusKeyword || "(auto pick best)"}
Geo target: ${geo}

Use the set_seo tool to return the metadata.`;

    const resp = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1024,
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }],
        tools: [
          {
            name: "set_seo",
            description: "Set SEO/AEO/GEO metadata for the product.",
            input_schema: {
              type: "object",
              properties: {
                metaTitle: { type: "string", description: "Max 60 chars, keyword-rich, includes brand or location when natural" },
                metaDescription: { type: "string", description: "Max 160 chars, persuasive, includes call-to-action" },
                focusKeyword: { type: "string", description: "Primary keyword targeted" },
                geoTarget: { type: "string", description: "City/country, e.g. 'Lahore, Pakistan'" },
                aeoSnippet: { type: "string", description: "1-2 sentence direct answer for AI search engines" },
              },
              required: ["metaTitle", "metaDescription", "focusKeyword", "geoTarget", "aeoSnippet"],
            },
          },
        ],
        tool_choice: { type: "tool", name: "set_seo" },
      }),
    });

    if (!resp.ok) {
      const t = await resp.text();
      console.error("Anthropic API error:", resp.status, t);
      if (resp.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit. Try again shortly." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (resp.status === 400 && t.includes("credit balance")) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify({ error: "AI provider error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await resp.json();
    const toolUse = data.content?.find((b: { type: string }) => b.type === "tool_use");
    if (!toolUse?.input) {
      return new Response(JSON.stringify({ error: "No tool call in response" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const seo = { ...toolUse.input, updatedAt: new Date().toISOString() };

    return new Response(JSON.stringify({ seo }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("seo-generate error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
