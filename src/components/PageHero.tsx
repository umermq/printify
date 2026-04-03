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
    <section className="relative overflow-hidden bg-card border-b border-border">
      {/* Optional background image */}
      {backgroundImage && (
        <>
          <img
            src={backgroundImage}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-foreground/60" />
        </>
      )}

      <div className={`container relative py-20 ${backgroundImage ? 'text-primary-foreground' : ''}`}>
        {breadcrumbs && (
          <div className={`mb-6 ${backgroundImage ? '[&_a]:text-primary-foreground/60 [&_a:hover]:text-primary-foreground [&_span]:text-primary-foreground/40 [&_li:last-child_span]:text-primary-foreground/80' : ''}`}>
            <Breadcrumbs items={breadcrumbs} />
          </div>
        )}

        <span className={`section-label mb-4 block ${backgroundImage ? '!text-gold' : ''}`}>
          {label}
        </span>

        <h1 className={`font-serif text-4xl font-medium md:text-5xl ${backgroundImage ? 'text-primary-foreground' : 'text-foreground'}`}>
          {title}
        </h1>

        {subtitle && (
          <p className={`mt-3 max-w-md text-sm leading-relaxed ${backgroundImage ? 'text-primary-foreground/60' : 'text-muted-foreground'}`}>
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
};
