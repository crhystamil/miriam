export const publicContact = {
  whatsapplink: "https://wa.me/59161617345",
  whatsappDisplay: "+59161617345",
  whatsappLinkNumber: "59161617345",
  address: "Augusto Guzman Martinez, Ricardo Mujia – Final Atahuallpa Cochabamba, Bolivia",
  facebookUrl: "https://www.facebook.com/repuestoslavadora/",
  mapEmbedSrc:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d248.85271047267537!2d-66.15593620933417!3d-17.35364875213766!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x93e3758e3845a5ab%3A0xb15ddbc7a855c4d9!2stemporal!5e0!3m2!1ses!2sbo!4v1780544963465!5m2!1ses!2sbo"
}

export function createWhatsAppUrl(message?: string) {
  const baseUrl = `https://wa.me/${publicContact.whatsappLinkNumber}`

  if (!message?.trim()) {
    return baseUrl
  }

  return `${baseUrl}?text=${encodeURIComponent(message)}`
}
