import { Breadcrumbs } from "@/components/Breadcrumbs";

interface BreadcrumbItem {
  label: string;
  to?: string;
}

interface PageHeroProps {
  label: string;
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  backgroundImage?: string;
}

export const PageHero = ({ label, title, subtitle, breadcrumbs, backgroundImage }: PageHeroProps) => {
  return (
    <section className="relative overflow-hidden bg-gradient-hero border-b border-border">
      <div className="blob bg-primary/20" style={{ width: 280, height: 280, top: -80, left: -80 }} />
      <div className="blob bg-coral/40" style={{ width: 220, height: 220, bottom: -60, right: -40 }} />

      {backgroundImage && (
        <img
          src={backgroundImage}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-25"
          loading="eager"
        />
      )}

      <div className="container relative py-20 z-10">
        {breadcrumbs && (
          <div className="mb-6">
            <Breadcrumbs items={breadcrumbs} />
          </div>
        )}

        <span className="section-label mb-4 block">{label}</span>

        <h1 className="text-4xl font-bold md:text-5xl lg:text-6xl text-foreground tracking-tight">
          {title}
        </h1>

        {subtitle && (
          <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
};
