const WHATSAPP_NUMBER = "60145203749";

/** wa.me deep link with a pre-filled message — user still has to tap send. */
export function buildWhatsAppUrl(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
