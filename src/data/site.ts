/** Business contact details used across the site. */
export const phone = {
  display: "+91 89216 11825",
  tel: "+918921611825",
  whatsapp: "918921611825",
};

/** WhatsApp chat link, optionally with a prepared message. */
export function whatsappLink(message?: string): string {
  const base = `https://wa.me/${phone.whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
