import { MessageCircle } from "lucide-react";

export const WhatsAppButton = () => (
  <a
    href="https://wa.me/923334442957?text=Hi%20PrintPK!%20I%20need%20help."
    target="_blank"
    rel="noopener noreferrer"
    className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp shadow-elevated transition-transform hover:scale-110 active:scale-95"
    aria-label="Chat on WhatsApp"
  >
    <MessageCircle className="h-7 w-7 text-primary-foreground" />
  </a>
);
