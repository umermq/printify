import { useEffect } from "react";

interface SEOHeadProps {
  title: string;
  description: string;
  ogImage?: string;
  path?: string;
  type?: string;
}

const BASE_URL = "https://pixelcraft.pk";

const setMeta = (attr: string, key: string, content: string) => {
  let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
};

export const SEOHead = ({ title, description, ogImage = "/og-default.png", path = "/", type = "website" }: SEOHeadProps) => {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title;

    setMeta("name", "description", description);
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:type", type);
    setMeta("property", "og:image", ogImage);
    setMeta("property", "og:url", `${BASE_URL}${path}`);
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", description);
    setMeta("name", "twitter:image", ogImage);

    return () => {
      document.title = prevTitle;
    };
  }, [title, description, ogImage, path, type]);

  return null;
};
