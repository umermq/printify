import { SEOHead } from "@/components/SEOHead";
import { cmsPages } from "@/data/cms-content";
import { Users, Award, Truck, HeadphonesIcon } from "lucide-react";
import { PageHero } from "@/components/PageHero";

const highlights = [
  { icon: Award, title: "Premium Quality", desc: "Professional-grade printers & materials" },
  { icon: Truck, title: "Nationwide Delivery", desc: "3-7 days across Pakistan with COD" },
  { icon: Users, title: "10,000+ Customers", desc: "Trusted by families across Pakistan" },
  { icon: HeadphonesIcon, title: "WhatsApp Support", desc: "Instant help when you need it" },
];

const AboutPage = () => {
  const page = cmsPages.find((p) => p.slug === "about")!;

  return (
    <div>
      <SEOHead title={page.metaTitle} description={page.metaDescription} path="/about" />
      <PageHero
        label="Our Story"
        title="About PixelCraft"
        subtitle="Pakistan's trusted premium photo printing service."
        breadcrumbs={[{ label: "Home", to: "/" }, { label: "About Us" }]}
        backgroundImage="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80"
      />

      <div className="container py-12">
        <div className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {highlights.map((h) => (
            <div key={h.title} className="rounded-xl border border-border bg-card p-6 text-center shadow-luxury">
              <h.icon className="mx-auto mb-3 h-8 w-8 text-gold" />
              <h3 className="font-serif text-lg font-medium">{h.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{h.desc}</p>
            </div>
          ))}
        </div>

        <div
          className="prose prose-sm max-w-none text-muted-foreground [&_h2]:mb-3 [&_h2]:mt-8 [&_h2]:font-serif [&_h2]:text-xl [&_h2]:font-medium [&_h2]:text-foreground [&_li]:ml-4 [&_p]:mb-4 [&_ul]:mb-4 [&_ul]:list-disc"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      </div>
    </div>
  );
};

export default AboutPage;
