import { useState, useMemo } from "react";
import { SEOHead } from "@/components/SEOHead";
import { faqItems, faqCategories } from "@/data/cms-content";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { PageHero } from "@/components/PageHero";

const FAQsPage = () => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const filtered = useMemo(() => {
    return faqItems.filter((faq) => {
      const matchesCategory = activeCategory === "All" || faq.category === activeCategory;
      const matchesSearch = !search || faq.question.toLowerCase().includes(search.toLowerCase()) || faq.answer.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [search, activeCategory]);

  return (
    <div>
      <SEOHead title="FAQs | PixelCraft" description="Find answers to common questions about PixelCraft's custom photo printing services, delivery, payments, and returns." path="/faqs" />
      <PageHero
        label="Help Center"
        title="Frequently Asked Questions"
        subtitle="Find quick answers to common questions about our services."
        breadcrumbs={[{ label: "Home", to: "/" }, { label: "FAQs" }]}
      />

      <div className="container py-12">
        <div className="mb-6 relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search FAQs..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 border-border focus-visible:ring-gold bg-background" />
        </div>

        <div className="mb-8 flex flex-wrap items-center gap-0 border-b border-border">
          {["All", ...faqCategories].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`relative pb-3 pr-6 text-xs font-medium tracking-widest uppercase transition-colors duration-300 ${
                activeCategory === cat ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat}
              {activeCategory === cat && (
                <span className="absolute bottom-0 left-0 h-px w-full bg-gold" />
              )}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <p className="py-8 text-center text-muted-foreground">No FAQs match your search.</p>
        ) : (
          <Accordion type="multiple" className="w-full">
            {filtered.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id}>
                <AccordionTrigger className="text-left font-medium">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
    </div>
  );
};

export default FAQsPage;
