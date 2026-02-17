import { SEOHead } from "@/components/SEOHead";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { cmsPages } from "@/data/cms-content";
import { Users, Award, Truck, HeadphonesIcon } from "lucide-react";

const highlights = [
  { icon: Award, title: "Premium Quality", desc: "Professional-grade printers & materials" },
  { icon: Truck, title: "Nationwide Delivery", desc: "3-7 days across Pakistan with COD" },
  { icon: Users, title: "10,000+ Customers", desc: "Trusted by families across Pakistan" },
  { icon: HeadphonesIcon, title: "WhatsApp Support", desc: "Instant help when you need it" },
];

const AboutPage = () => {
  const page = cmsPages.find((p) => p.slug === "about")!;

  return (
    <div className="container py-10">
      <SEOHead title={page.metaTitle} description={page.metaDescription} path="/about" />
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "About Us" }]} />

      <h1 className="mb-8 font-heading text-3xl font-bold md:text-4xl">{page.title}</h1>

      <div className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {highlights.map((h) => (
          <div key={h.title} className="rounded-xl border border-border bg-card p-6 text-center shadow-card">
            <h.icon className="mx-auto mb-3 h-8 w-8 text-primary" />
            <h3 className="font-heading text-lg font-semibold">{h.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{h.desc}</p>
          </div>
        ))}
      </div>

      <div
        className="prose prose-sm max-w-none text-muted-foreground [&_h2]:mb-3 [&_h2]:mt-8 [&_h2]:font-heading [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-foreground [&_li]:ml-4 [&_p]:mb-4 [&_ul]:mb-4 [&_ul]:list-disc"
        dangerouslySetInnerHTML={{ __html: page.content }}
      />
    </div>
  );
};

export default AboutPage;
