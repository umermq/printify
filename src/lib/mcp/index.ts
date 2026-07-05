import { defineMcp } from "@lovable.dev/mcp-js";
import listProductsTool from "./tools/list-products";
import getProductTool from "./tools/get-product";
import siteInfoTool from "./tools/site-info";

export default defineMcp({
  name: "pixelcraft-mcp",
  title: "PixelCraft MCP",
  version: "0.1.0",
  instructions:
    "Tools for PixelCraft, a custom printing store in Pakistan. Use `site_info` for brand/support details, `list_products` to browse the catalog (optionally filter by category), and `get_product` to fetch one product with its SEO metadata. All prices are in PKR.",
  tools: [siteInfoTool, listProductsTool, getProductTool],
});
