import { SEOHead } from "@/components/SEOHead";
import { cmsPages } from "@/data/cms-content";
import { PageHero } from "@/components/PageHero";

const policyMeta: Record<string, { label: string; breadcrumbLabel: string }> = {
  "privacy-policy": { label: "Legal", breadcrumbLabel: "Privacy Policy" },
  "terms": { label: "Legal", breadcrumbLabel: "Terms & Conditions" },
  "refund-policy": { label: "Policies", breadcrumbLabel: "Refund Policy" },
  "shipping-policy": { label: "Policies", breadcrumbLabel: "Shipping Policy" },
  "return-policy": { label: "Policies", breadcrumbLabel: "Return Policy" },
};

const PolicyPage = ({ slug }: { slug: string }) => {
  const page = cmsPages.find((p) => p.slug === slug)!;
  const meta = policyMeta[slug];

  return (
    <div>
      <SEOHead title={page.metaTitle} description={page.metaDescription} path={`/${slug}`} />
      <PageHero
        label={meta.label}
        title={page.title}
        breadcrumbs={[{ label: "Home", to: "/" }, { label: meta.breadcrumbLabel }]}
      />

      <div className="container py-12">
        <p className="mb-8 text-sm text-muted-foreground">Last updated: {page.updatedAt}</p>
        <div
          className="prose prose-sm max-w-none text-muted-foreground [&_h2]:mb-3 [&_h2]:mt-8 [&_h2]:font-serif [&_h2]:text-xl [&_h2]:font-medium [&_h2]:text-foreground [&_li]:ml-4 [&_ol]:mb-4 [&_ol]:list-decimal [&_p]:mb-4 [&_ul]:mb-4 [&_ul]:list-disc"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      </div>
    </div>
  );
};

export const PrivacyPolicyPage = () => <PolicyPage slug="privacy-policy" />;
export const TermsPage = () => <PolicyPage slug="terms" />;
export const RefundPolicyPage = () => <PolicyPage slug="refund-policy" />;
export const ShippingPolicyPage = () => <PolicyPage slug="shipping-policy" />;
export const ReturnPolicyPage = () => <PolicyPage slug="return-policy" />;
