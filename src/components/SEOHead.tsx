import { Helmet } from "react-helmet-async";

interface SEOHeadProps {
  title: string;
  description: string;
  ogImage?: string;
  path?: string;
  type?: string;
  jsonLd?: object | object[];
  noindex?: boolean;
}

const BASE_URL = "https://printpal-pk.lovable.app";

export const SEOHead = ({
  title,
  description,
  ogImage = "/og-default.png",
  path = "/",
  type = "website",
  jsonLd,
  noindex = false,
}: SEOHeadProps) => {
  const url = `${BASE_URL}${path}`;
  const schemas = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {noindex && <meta name="robots" content="noindex,nofollow" />}

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:image" content={ogImage.startsWith("http") ? ogImage : `${BASE_URL}${ogImage}`} />
      <meta property="og:url" content={url} />
      <meta property="og:locale" content="en_PK" />
      <meta property="og:site_name" content="PixelCraft" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage.startsWith("http") ? ogImage : `${BASE_URL}${ogImage}`} />

      {schemas.map((schema, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
};
