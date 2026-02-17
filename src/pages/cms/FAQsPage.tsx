import { useState, useMemo } from "react";
import { SEOHead } from "@/components/SEOHead";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { faqItems, faqCategories } from "@/data/cms-content";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

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
    <div className="container py-10">
      <SEOHead title="FAQs | PrintPK" description="Find answers to common questions about PrintPK's custom photo printing services, delivery, payments, and returns." path="/faqs" />
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "FAQs" }]} />

      <h1 className="mb-2 font-heading text-3xl font-bold md:text-4xl">Frequently Asked Questions</h1>
      <p className="mb-8 text-muted-foreground">Find quick answers to common questions about our services.</p>

      <div className="mb-6 relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search FAQs..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {["All", ...faqCategories].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${activeCategory === cat ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent"}`}
          >
            {cat}
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
  );
};

export default FAQsPage;
