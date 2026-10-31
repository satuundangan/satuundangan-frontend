import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import FaqSection from '@/components/landing/FaqSection.vue'
import TentangKamiView from '@/views/TentangKamiView.vue'
import { featuresFor } from '@/config/packageFeatures'

describe('PKG-14: Transparansi Harga, Katalog & Kepercayaan Publik', () => {
  describe('Package Features & Matrix Derivation (ADM-088)', () => {
    it('verifies Basic tier features match backend single source of truth', () => {
      const basic = featuresFor('basic')
      expect(basic.gallery).toBe(true)
      expect(basic.galleryLimit).toBe(8)
      expect(basic.customMusic).toBe(false)
      expect(basic.subdomain).toBe(false)
      expect(basic.whatsapp).toBe(true)
    })

    it('verifies Premium tier features include custom music and subdomain', () => {
      const premium = featuresFor('premium')
      expect(premium.gallery).toBe(true)
      expect(premium.galleryLimit).toBe(20)
      expect(premium.customMusic).toBe(true)
      expect(premium.subdomain).toBe(true)
      expect(premium.whatsapp).toBe(true)
    })

    it('verifies Eksklusif tier features have 35 photos maximum and full capabilities', () => {
      const eksklusif = featuresFor('eksklusif')
      expect(eksklusif.gallery).toBe(true)
      expect(eksklusif.galleryLimit).toBe(35)
      expect(eksklusif.customMusic).toBe(true)
      expect(eksklusif.subdomain).toBe(true)
      expect(eksklusif.whatsapp).toBe(true)
    })
  })

  describe('FAQ Transparency & Trust Questions (ADM-087, ADM-091, ADM-092)', () => {
    it('renders essential payment timing & free trial FAQ', () => {
      const wrapper = mount(FaqSection)
      const text = wrapper.text()

      expect(text).toContain('Kapan saya harus membayar? Apakah bisa coba edit gratis?')
      expect(text).toContain('Apa perbedaan paket Basic, Premium, dan Eksklusif?')
      expect(text).toContain('Bagaimana jika ada kendala saat pembayaran atau aktivasi?')
      expect(text).toContain('fitur berbagi undangan lewat WhatsApp per tamu')
      expect(text).toContain('menekan Kirim sendiri')
      expect(text).not.toContain('WhatsApp otomatis')
    })

    it('contains operational SLAs, Bank Indonesia licensing, and CS contact info in FAQ', () => {
      const wrapper = mount(FaqSection)
      const html = wrapper.html()

      expect(html).toContain('Bank Indonesia')
      expect(html).toContain('08.00 – 21.00 WIB')
      expect(html).toContain('SLA &lt; 15 menit')
      expect(html).toContain('365 + 1 hari (1 tahun penuh)')
    })
  })

  describe('Tentang Kami Operational Standards (ADM-091 & ADM-092)', () => {
    it('renders customer support hours, response SLA, and official contacts', () => {
      const wrapper = mount(TentangKamiView, {
        global: {
          stubs: ['router-link'],
        },
      })
      const text = wrapper.text()

      expect(text).toContain('08.00 – 21.00 WIB')
      expect(text).toContain('SLA respon rata-rata di bawah 15 menit')
      expect(text).toContain('+62 851-2126-6550')
      expect(text).toContain('support@satuundangan.id')
    })

    it('renders Bank Indonesia payment gateway guarantee and 365+1 days active period', () => {
      const wrapper = mount(TentangKamiView, {
        global: {
          stubs: ['router-link'],
        },
      })
      const text = wrapper.text()

      expect(text).toContain('Bank Indonesia')
      expect(text).toContain('Midtrans')
      expect(text).toContain('365 + 1 hari (1 tahun penuh)')
      expect(text).toContain('Transparansi Biaya & Coba Gratis')
    })
  })
})
