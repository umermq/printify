import { useState } from "react";
import { SEOHead } from "@/components/SEOHead";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Phone, Mail, MapPin, MessageCircle, Clock } from "lucide-react";
import { z } from "zod";
import { PageHero } from "@/components/PageHero";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().regex(/^03\d{2}[-\s]?\d{7}$/, "Enter a valid Pakistani phone number (e.g., 0300-1234567)"),
  email: z.string().email("Enter a valid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

const ContactPage = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = contactSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => { fieldErrors[err.path[0] as string] = err.message; });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setSubmitted(true);
    toast({ title: "Message Sent!", description: "We'll get back to you within 24 hours." });
    setForm({ name: "", phone: "", email: "", message: "" });
  };

  const update = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => { const next = { ...prev }; delete next[field]; return next; });
  };

  return (
    <div>
      <SEOHead title="Contact Us | PixelCraft" description="Get in touch with PixelCraft. Reach us via WhatsApp, phone, email, or our contact form. Based in Lahore, Pakistan." path="/contact" />
      <PageHero
        label="Get in Touch"
        title="Contact Us"
        subtitle="We'd love to hear from you. Reach out and we'll respond within 24 hours."
        breadcrumbs={[{ label: "Home", to: "/" }, { label: "Contact Us" }]}
        backgroundImage="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1920&q=80"
      />

      <div className="container py-12">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-medium tracking-widest uppercase text-muted-foreground">Full Name</label>
                <Input value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Your name" className="border-border focus-visible:ring-gold bg-background" />
                {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium tracking-widest uppercase text-muted-foreground">Phone Number</label>
                <Input value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="0300-1234567" className="border-border focus-visible:ring-gold bg-background" />
                {errors.phone && <p className="mt-1 text-xs text-destructive">{errors.phone}</p>}
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium tracking-widest uppercase text-muted-foreground">Email</label>
                <Input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="your@email.com" className="border-border focus-visible:ring-gold bg-background" />
                {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium tracking-widest uppercase text-muted-foreground">Message</label>
                <Textarea value={form.message} onChange={(e) => update("message", e.target.value)} placeholder="Tell us how we can help..." rows={5} className="border-border focus-visible:ring-gold bg-background" />
                {errors.message && <p className="mt-1 text-xs text-destructive">{errors.message}</p>}
              </div>
              <button type="submit" className="btn-luxury w-full flex items-center justify-center">Send Message</button>
              {submitted && <p className="text-center text-sm text-gold">✓ Your message has been sent successfully!</p>}
            </form>
          </div>

          <div className="space-y-6">
            <div className="rounded-xl border border-border bg-card p-6 shadow-luxury">
              <h3 className="mb-4 font-serif text-lg font-medium">Get in Touch</h3>
              <div className="space-y-4">
                <a href="https://wa.me/923334442957" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm hover:text-gold text-muted-foreground transition-colors duration-300">
                  <MessageCircle className="h-5 w-5 text-gold" /> WhatsApp: +92 333 4442957
                </a>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Phone className="h-5 w-5 text-gold" /> +92 42 3334442957
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Mail className="h-5 w-5 text-gold" /> info@pixelcraft.pk
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <MapPin className="h-5 w-5 text-gold" /> 123 Mall Road, Gulberg III, Lahore
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Clock className="h-5 w-5 text-gold" /> Mon - Sat: 10:00 AM - 8:00 PM
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-border">
              <iframe
                title="PixelCraft Office Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3401.4!2d74.35!3d31.52!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzHCsDMxJzEyLjAiTiA3NMKwMjEnMDAuMCJF!5e0!3m2!1sen!2spk!4v1600000000000"
                width="100%"
                height="250"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
