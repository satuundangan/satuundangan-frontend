import { ref } from 'vue'

const currentAudio = ref(null)
const currentTrackUrl = ref('')
const isPlaying = ref(false)
const isLoading = ref(false)

const DEFAULT_ROMANTIC_TRACK = '/audio/romantic_music1.mp3'

export function useAudioPlayer() {
  function getResolvedUrl(url) {
    if (!url) return DEFAULT_ROMANTIC_TRACK
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
      return url
    }
    if (url.startsWith('/audio/')) {
      return url
    }
    if (url.endsWith('.mp3')) {
      return `/audio/${url}`
    }
    return url
  }

  function pause() {
    if (currentAudio.value) {
      currentAudio.value.pause()
      isPlaying.value = false
    }
  }

  function play(rawUrl) {
    const targetUrl = getResolvedUrl(rawUrl)

    if (currentAudio.value && currentTrackUrl.value === targetUrl) {
      if (isPlaying.value) {
        pause()
        return
      } else {
        currentAudio.value.play().then(() => {
          isPlaying.value = true
        }).catch((err) => {
          console.warn('Audio play error:', err)
          isPlaying.value = false
        })
        return
      }
    }

    // Stop current audio if playing a different track
    if (currentAudio.value) {
      currentAudio.value.pause()
      currentAudio.value.currentTime = 0
    }

    try {
      isLoading.value = true
      const audio = new Audio(targetUrl)
      audio.preload = 'metadata'
      
      audio.onplaying = () => {
        isLoading.value = false
        isPlaying.value = true
      }
      
      audio.onpause = () => {
        isPlaying.value = false
      }
      
      audio.onended = () => {
        isPlaying.value = false
        currentTrackUrl.value = ''
      }
      
      audio.onerror = (err) => {
        console.warn('Gagal memutar audio:', targetUrl, err)
        isLoading.value = false
        isPlaying.value = false
      }

      currentAudio.value = audio
      currentTrackUrl.value = targetUrl

      audio.play().then(() => {
        isPlaying.value = true
        isLoading.value = false
      }).catch((e) => {
        console.warn('Autoplay prevented or audio load error:', e)
        isPlaying.value = false
        isLoading.value = false
      })
    } catch (err) {
      console.error('Audio instance error:', err)
      isLoading.value = false
      isPlaying.value = false
    }
  }

  function isCurrentTrackPlaying(rawUrl) {
    const resolved = getResolvedUrl(rawUrl)
    return isPlaying.value && currentTrackUrl.value === resolved
  }

  return {
    currentTrackUrl,
    isPlaying,
    isLoading,
    play,
    pause,
    isCurrentTrackPlaying,
    getResolvedUrl,
  }
}
