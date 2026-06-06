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

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

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

Return STRICT JSON only via the tool.`;

    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "set_seo",
              description: "Set SEO/AEO/GEO metadata for the product.",
              parameters: {
                type: "object",
                properties: {
                  metaTitle: { type: "string", description: "Max 60 chars, keyword-rich, includes brand or location when natural" },
                  metaDescription: { type: "string", description: "Max 160 chars, persuasive, includes call-to-action" },
                  focusKeyword: { type: "string", description: "Primary keyword targeted" },
                  geoTarget: { type: "string", description: "City/country, e.g. 'Lahore, Pakistan'" },
                  aeoSnippet: { type: "string", description: "1-2 sentence direct answer for AI search engines" },
                },
                required: ["metaTitle", "metaDescription", "focusKeyword", "geoTarget", "aeoSnippet"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "set_seo" } },
      }),
    });

    if (!resp.ok) {
      const t = await resp.text();
      console.error("AI gateway error:", resp.status, t);
      if (resp.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit. Try again shortly." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (resp.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await resp.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall?.function?.arguments) {
      return new Response(JSON.stringify({ error: "No tool call in response" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const seo = JSON.parse(toolCall.function.arguments);
    seo.updatedAt = new Date().toISOString();

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
