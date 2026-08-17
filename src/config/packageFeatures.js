// Package-tier feature map — mirrors backend PACKAGE_FEATURES
// (undangan-online-api-nestjs/src/invitation/invitation.entity.ts).
// Backend is authoritative for enforcement; this drives editor gating UX,
// the homepage pricing matrix, and checkout copy. Keep the two in sync.
// GET /payment/packages also returns `features` per tier if you prefer live data.
export const PACKAGE_FEATURES = {
  basic: {
    gallery: false,
    galleryLimit: 0,
    customMusic: false,
    watermark: true,
    whatsapp: false,
    subdomain: false,
  },
  premium: {
    gallery: true,
    galleryLimit: 8,
    customMusic: true,
    watermark: false,
    whatsapp: true,
    subdomain: false,
  },
  eksklusif: {
    gallery: true,
    galleryLimit: 20,
    customMusic: true,
    watermark: false,
    whatsapp: true,
    subdomain: true,
  },
}

export function featuresFor(pkg) {
  return PACKAGE_FEATURES[pkg] || PACKAGE_FEATURES.basic
}
