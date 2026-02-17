import { SEOHead } from "@/components/SEOHead";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { cmsPages } from "@/data/cms-content";

const PolicyPage = ({ slug, breadcrumbLabel }: { slug: string; breadcrumbLabel: string }) => {
  const page = cmsPages.find((p) => p.slug === slug)!;

  return (
    <div className="container py-10">
      <SEOHead title={page.metaTitle} description={page.metaDescription} path={`/${slug}`} />
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: breadcrumbLabel }]} />
      <h1 className="mb-2 font-heading text-3xl font-bold md:text-4xl">{page.title}</h1>
      <p className="mb-8 text-sm text-muted-foreground">Last updated: {page.updatedAt}</p>
      <div
        className="prose prose-sm max-w-none text-muted-foreground [&_h2]:mb-3 [&_h2]:mt-8 [&_h2]:font-heading [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-foreground [&_li]:ml-4 [&_ol]:mb-4 [&_ol]:list-decimal [&_p]:mb-4 [&_ul]:mb-4 [&_ul]:list-disc"
        dangerouslySetInnerHTML={{ __html: page.content }}
      />
    </div>
  );
};

export const PrivacyPolicyPage = () => <PolicyPage slug="privacy-policy" breadcrumbLabel="Privacy Policy" />;
export const TermsPage = () => <PolicyPage slug="terms" breadcrumbLabel="Terms & Conditions" />;
export const RefundPolicyPage = () => <PolicyPage slug="refund-policy" breadcrumbLabel="Refund Policy" />;
export const ShippingPolicyPage = () => <PolicyPage slug="shipping-policy" breadcrumbLabel="Shipping Policy" />;
export const ReturnPolicyPage = () => <PolicyPage slug="return-policy" breadcrumbLabel="Return Policy" />;
