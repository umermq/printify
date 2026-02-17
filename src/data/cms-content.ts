export interface CMSPage {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  content: string;
  status: "published" | "draft";
  updatedAt: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
}

export interface ContactSubmission {
  id: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  date: string;
  read: boolean;
}

export const cmsPages: CMSPage[] = [
  {
    slug: "about",
    title: "About Us",
    metaTitle: "About Us | PrintPK – Pakistan's Trusted Photo Printing",
    metaDescription: "Learn about PrintPK, Pakistan's leading custom photo printing service. Quality prints, fast delivery, nationwide COD.",
    content: `<h2>Our Story</h2>
<p>PrintPK was founded in 2022 in Lahore with a simple mission: make custom photo printing accessible and affordable for every Pakistani. From photo books capturing wedding memories to personalized mugs for Eid gifts, we turn your cherished moments into tangible keepsakes.</p>

<h2>Our Mission</h2>
<p>We believe every memory deserves to be preserved beautifully. Our state-of-the-art printing technology combined with premium materials ensures your photos look stunning on every product we create.</p>

<h2>Why Choose PrintPK?</h2>
<ul>
<li><strong>Premium Quality:</strong> We use professional-grade printers and materials for vibrant, long-lasting prints.</li>
<li><strong>Fast Delivery:</strong> Most orders are delivered within 3-7 business days across Pakistan.</li>
<li><strong>Cash on Delivery:</strong> Pay when you receive your order – no online payment hassles.</li>
<li><strong>Customer Support:</strong> Our dedicated team is available via WhatsApp for instant assistance.</li>
</ul>

<h2>Our Team</h2>
<p>We're a passionate team of designers, print specialists, and customer service experts based in Lahore. Every order is handled with care to ensure you receive exactly what you envisioned.</p>`,
    status: "published",
    updatedAt: "2026-02-17",
  },
  {
    slug: "privacy-policy",
    title: "Privacy Policy",
    metaTitle: "Privacy Policy | PrintPK",
    metaDescription: "Read PrintPK's privacy policy. We protect your personal information and photos with industry-standard security.",
    content: `<h2>Information We Collect</h2>
<p>We collect information you provide when placing orders: name, phone number, email, delivery address, and photos you upload for printing. We also collect basic usage data to improve our services.</p>

<h2>How We Use Your Information</h2>
<ul>
<li>Processing and fulfilling your orders</li>
<li>Communicating order updates via SMS and WhatsApp</li>
<li>Improving our products and services</li>
<li>Sending promotional offers (with your consent)</li>
</ul>

<h2>Photo Privacy</h2>
<p>Your uploaded photos are stored securely and used exclusively for printing your orders. We never share, sell, or use your photos for any other purpose. Photos are automatically deleted 30 days after order completion.</p>

<h2>Data Security</h2>
<p>We implement industry-standard security measures to protect your personal information and photos from unauthorized access.</p>

<h2>Contact Us</h2>
<p>For privacy-related inquiries, contact us at privacy@printpk.com or WhatsApp +92 300 1234567.</p>`,
    status: "published",
    updatedAt: "2026-02-17",
  },
  {
    slug: "terms",
    title: "Terms & Conditions",
    metaTitle: "Terms & Conditions | PrintPK",
    metaDescription: "Review PrintPK's terms and conditions for using our custom photo printing services in Pakistan.",
    content: `<h2>Acceptance of Terms</h2>
<p>By using PrintPK's website and services, you agree to these terms and conditions. Please read them carefully before placing an order.</p>

<h2>Orders & Pricing</h2>
<p>All prices are listed in Pakistani Rupees (PKR) and include applicable taxes. Prices may change without notice, but confirmed orders will be honored at the quoted price.</p>

<h2>Product Quality</h2>
<p>We strive for the highest print quality. Colors may vary slightly between screen display and printed output due to differences in display calibration and printing processes.</p>

<h2>Intellectual Property</h2>
<p>You must own or have rights to all images you upload. PrintPK is not responsible for copyright infringement by customers. We reserve the right to refuse printing copyrighted or inappropriate content.</p>

<h2>Limitation of Liability</h2>
<p>PrintPK's liability is limited to the order value. We are not liable for indirect damages, loss of data, or delays caused by courier services.</p>`,
    status: "published",
    updatedAt: "2026-02-17",
  },
  {
    slug: "refund-policy",
    title: "Refund Policy",
    metaTitle: "Refund Policy | PrintPK",
    metaDescription: "PrintPK's refund policy for custom photo printed products. Learn about our satisfaction guarantee.",
    content: `<h2>Our Guarantee</h2>
<p>We want you to be 100% satisfied with your order. If there's a quality issue with your printed product, we'll make it right.</p>

<h2>Eligible Refunds</h2>
<ul>
<li>Printing defects or quality issues</li>
<li>Wrong product or size delivered</li>
<li>Damaged items during delivery</li>
</ul>

<h2>Non-Refundable Cases</h2>
<ul>
<li>Low-resolution images provided by customer</li>
<li>Color variations between screen and print</li>
<li>Change of mind after order is printed</li>
<li>Orders older than 7 days after delivery</li>
</ul>

<h2>How to Request a Refund</h2>
<p>Contact us within 7 days of delivery with your order number and photos of the issue. We'll review and process eligible refunds within 3-5 business days via the original payment method or store credit.</p>`,
    status: "published",
    updatedAt: "2026-02-17",
  },
  {
    slug: "shipping-policy",
    title: "Shipping Policy",
    metaTitle: "Shipping Policy | PrintPK – Nationwide Delivery",
    metaDescription: "PrintPK delivers custom printed products across Pakistan. COD available. 3-7 business days delivery.",
    content: `<h2>Delivery Coverage</h2>
<p>We deliver to all major cities and towns across Pakistan through our trusted courier partners.</p>

<h2>Delivery Times</h2>
<ul>
<li><strong>Lahore, Karachi, Islamabad:</strong> 3-5 business days</li>
<li><strong>Other major cities:</strong> 5-7 business days</li>
<li><strong>Remote areas:</strong> 7-10 business days</li>
</ul>

<h2>Shipping Charges</h2>
<p>Standard shipping is Rs. 200 nationwide. Free shipping on orders above Rs. 3,000.</p>

<h2>Cash on Delivery (COD)</h2>
<p>COD is available across Pakistan. Pay the courier when you receive your order. No additional COD charges.</p>

<h2>Order Tracking</h2>
<p>You'll receive a tracking number via SMS and WhatsApp once your order is shipped. Track your delivery in real-time through our courier partner's website.</p>`,
    status: "published",
    updatedAt: "2026-02-17",
  },
  {
    slug: "return-policy",
    title: "Return Policy",
    metaTitle: "Return Policy | PrintPK",
    metaDescription: "PrintPK's return policy for custom photo printed products. Easy returns within 7 days.",
    content: `<h2>Return Eligibility</h2>
<p>Since our products are custom-made with your photos, returns are only accepted for quality defects or incorrect orders.</p>

<h2>Return Process</h2>
<ol>
<li>Contact us within 7 days of delivery via WhatsApp or email</li>
<li>Share photos of the issue and your order number</li>
<li>Our team will review and approve the return within 24 hours</li>
<li>We'll arrange a free pickup from your address</li>
<li>Replacement or refund will be processed within 3-5 business days</li>
</ol>

<h2>Condition for Returns</h2>
<p>Items must be in their original condition. Damaged packaging due to customer mishandling is not eligible for return.</p>`,
    status: "published",
    updatedAt: "2026-02-17",
  },
];

export const faqCategories = ["Orders", "Payments", "Delivery", "Products"] as const;

export const faqItems: FAQItem[] = [
  { id: "faq-1", question: "How do I place an order?", answer: "Browse our products, select your preferred size and theme, upload your photos, and proceed to checkout. You can pay via COD, JazzCash, or Easypaisa.", category: "Orders", order: 1 },
  { id: "faq-2", question: "Can I cancel my order?", answer: "Orders can be cancelled within 2 hours of placement. Once printing begins, cancellation is not possible as products are custom-made.", category: "Orders", order: 2 },
  { id: "faq-3", question: "How can I track my order?", answer: "You'll receive a tracking number via SMS and WhatsApp once shipped. You can also check order status by contacting our support team.", category: "Orders", order: 3 },
  { id: "faq-4", question: "Can I modify my order after placing it?", answer: "Modifications are possible within 1 hour of order placement. Contact us immediately via WhatsApp to request changes.", category: "Orders", order: 4 },
  { id: "faq-5", question: "What payment methods do you accept?", answer: "We accept Cash on Delivery (COD) nationwide, JazzCash, and Easypaisa. Online bank transfers are also accepted for orders above Rs. 5,000.", category: "Payments", order: 1 },
  { id: "faq-6", question: "Is Cash on Delivery available?", answer: "Yes! COD is available across Pakistan with no additional charges. Pay the courier when you receive your order.", category: "Payments", order: 2 },
  { id: "faq-7", question: "When will I be charged?", answer: "For COD orders, payment is collected upon delivery. For digital payments (JazzCash/Easypaisa), payment is processed at checkout.", category: "Payments", order: 3 },
  { id: "faq-8", question: "How long does delivery take?", answer: "Delivery takes 3-5 business days for major cities (Lahore, Karachi, Islamabad) and 5-7 days for other areas.", category: "Delivery", order: 1 },
  { id: "faq-9", question: "Do you deliver nationwide?", answer: "Yes, we deliver to all cities and towns across Pakistan through trusted courier partners.", category: "Delivery", order: 2 },
  { id: "faq-10", question: "What are the shipping charges?", answer: "Standard shipping is Rs. 200 nationwide. Orders above Rs. 3,000 qualify for free shipping.", category: "Delivery", order: 3 },
  { id: "faq-11", question: "What image quality do you need?", answer: "For best results, upload images of at least 300 DPI or 2MB+. Higher resolution means better print quality. We'll notify you if an image is too low resolution.", category: "Products", order: 1 },
  { id: "faq-12", question: "What products do you offer?", answer: "We offer photo books, custom mugs, t-shirts, cushions, keychains, and various gift items. All products are customizable with your photos.", category: "Products", order: 2 },
  { id: "faq-13", question: "Can colors differ between screen and print?", answer: "Yes, slight color variations can occur due to differences between screen displays and printing processes. We calibrate our printers for the best possible match.", category: "Products", order: 3 },
  { id: "faq-14", question: "Are your products durable?", answer: "Yes! We use premium materials and professional-grade printing. Our mugs are dishwasher safe, t-shirts withstand regular washing, and photo books are built to last years.", category: "Products", order: 4 },
];

export const contactSubmissions: ContactSubmission[] = [
  { id: "cs-1", name: "Ahmed Khan", phone: "0300-1234567", email: "ahmed@example.com", message: "I'd like to order 50 custom mugs for my company. Can you offer a bulk discount?", date: "2026-02-15", read: true },
  { id: "cs-2", name: "Fatima Ali", phone: "0321-9876543", email: "fatima@example.com", message: "My photo book pages are slightly misaligned. Order #PK-1234.", date: "2026-02-16", read: false },
  { id: "cs-3", name: "Hassan Raza", phone: "0333-5551234", email: "hassan@example.com", message: "Do you offer wedding packages with multiple products?", date: "2026-02-17", read: false },
];
