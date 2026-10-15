import { describe, it, expect } from 'vitest'
import { TEMPLATE_DEMO_PRESETS, getDemoPreset } from '@/api/templateDemoPresets'
import fs from 'fs'
import path from 'path'

describe('Template Demo Presets & Audio Integrity', () => {
  const audioDir = path.resolve(__dirname, '../../public/audio')

  it('provides presets for key templates', () => {
    const keyTemplates = [
      'jawa-truntum',
      'sunda-sabilulungan',
      'minang-suntiang-emas',
      'bali-payas-agung',
      'batak-ragi-hotang',
      'bugis-saoraja',
      'palembang-aesan-gede',
      'betawi-palang-pintu',
      'old-money-monogram',
      'elysian-parallax',
      'moroccan-marrakech-gold',
      'pixel-quest',
      'demon-slayer',
      'purrfect-match',
    ]

    keyTemplates.forEach((slug) => {
      const preset = getDemoPreset(slug)
      expect(preset).toBeDefined()
      expect(preset.groomName).toBeTruthy()
      expect(preset.brideName).toBeTruthy()
      expect(preset.quoteText).toBeTruthy()
      expect(preset.musicChoice).toBeTruthy()
    })
  })

  it('ensures all preset audio files exist in public/audio directory', () => {
    const presets = Object.entries(TEMPLATE_DEMO_PRESETS)
    expect(presets.length).toBeGreaterThan(15)

    presets.forEach(([slug, data]) => {
      const music = data.musicChoice
      expect(music, `Template ${slug} must specify musicChoice`).toBeTruthy()

      // Remove leading /audio/ if present
      const filename = music.replace(/^\/audio\//, '')
      const fullPath = path.join(audioDir, filename)
      const exists = fs.existsSync(fullPath)
      expect(exists, `Audio file '${filename}' for template '${slug}' must exist in public/audio/`).toBe(true)
    })
  })

  it('safely falls back for non-existent template slugs', () => {
    expect(getDemoPreset(null)).toEqual({})
    expect(getDemoPreset('')).toEqual({})
    expect(getDemoPreset('non-existent-template-slug')).toEqual({})
  })
})
