import { test, expect } from '@playwright/test'

const apiBaseURL = process.env.PROD_API_BASE_URL || 'https://api.satuundangan.id'
const frontendBaseURL = process.env.E2E_BASE_URL || 'https://www.satuundangan.id'

async function testAudioPlayback(page, audio) {
  return page.evaluate(async ({ title, url }) => {
    const waitFor = (target, events, timeoutMs, label) =>
      Promise.race([
        new Promise((resolve, reject) => {
          const cleanup = () => {
            for (const event of events) target.removeEventListener(event, onEvent)
            target.removeEventListener('error', onError)
          }
          const onEvent = () => {
            cleanup()
            resolve()
          }
          const onError = () => {
            cleanup()
            reject(new Error(target.error?.message || 'audio error'))
          }

          for (const event of events) target.addEventListener(event, onEvent, { once: true })
          target.addEventListener('error', onError, { once: true })
        }),
        new Promise((_, reject) => setTimeout(() => reject(new Error(label)), timeoutMs)),
      ])

    const audioEl = new Audio()
    audioEl.preload = 'auto'
    audioEl.muted = true
    audioEl.src = url
    audioEl.load()

    await waitFor(audioEl, ['loadedmetadata', 'canplay'], 20000, `metadata timeout: ${title}`)

    const duration = audioEl.duration
    if (!Number.isFinite(duration) || duration <= 0) {
      throw new Error(`invalid duration for ${title}: ${duration}`)
    }

    const seekTo = Math.min(Math.max(1, duration * 0.25), Math.max(0, duration - 1))
    audioEl.currentTime = seekTo
    await waitFor(audioEl, ['seeked', 'canplay'], 10000, `seek timeout: ${title}`)

    const before = audioEl.currentTime
    await audioEl.play()
    await new Promise((resolve) => setTimeout(resolve, 700))
    audioEl.pause()

    if (audioEl.currentTime <= before) {
      throw new Error(`playback did not advance for ${title}`)
    }

    return {
      duration,
      before,
      after: audioEl.currentTime,
    }
  }, audio)
}

test.describe('Production admin audio catalog playback', () => {
  test('all catalog audio records can load, seek, and play', async ({ page, request }) => {
    const response = await request.get(`${apiBaseURL}/audio`)
    expect(response.ok()).toBe(true)

    const audioList = await response.json()
    expect(audioList.length).toBeGreaterThan(0)

    await page.goto(frontendBaseURL, { waitUntil: 'domcontentloaded' })

    const failures = []
    for (const audio of audioList) {
      try {
        await testAudioPlayback(page, audio)
      } catch (error) {
        failures.push({
          title: audio.title,
          category: audio.category,
          url: audio.url,
          reason: error.message,
        })
      }
    }

    expect(failures, JSON.stringify(failures, null, 2)).toEqual([])
  })
})
