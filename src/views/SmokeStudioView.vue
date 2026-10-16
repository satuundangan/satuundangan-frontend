<template>
  <main class="smoke-studio">
    <header class="studio-header">
      <router-link class="brand" to="/" aria-label="Kembali ke Satu Undangan">
        <img src="/logo_satuundangan.png" alt="Satu Undangan" />
        <span>Studio Kabut</span>
      </router-link>
      <p class="privacy-note"><span aria-hidden="true">●</span> Foto diproses di perangkatmu</p>
    </header>

    <section class="studio-intro" aria-labelledby="studio-title">
      <div>
        <p class="intro-kicker">Satu potret, satu lapis kabut</p>
        <h1 id="studio-title">Buat foto profilmu terasa seperti <em>adegan.</em></h1>
      </div>
      <p class="intro-copy">
        Gabungkan fotomu dengan tekstur asap. Atur perpaduannya, lalu simpan hasilnya sebagai PNG.
      </p>
    </section>

    <section class="editor" aria-label="Editor foto asap">
      <div class="controls">
        <div class="control-heading">
          <span class="step-mark" aria-hidden="true">01</span>
          <div>
            <h2>Foto kamu</h2>
            <p>Pilih potret dengan wajah yang terlihat jelas.</p>
          </div>
        </div>

        <label
          class="upload-zone"
          :class="{ 'upload-zone--active': isDragging, 'upload-zone--loaded': hasSource }"
          @dragover.prevent="isDragging = true"
          @dragleave.prevent="isDragging = false"
          @drop.prevent="handleDrop"
        >
          <input
            ref="fileInput"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            @change="handleFileChange"
          />
          <span class="upload-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M12 16V4m0 0L7.5 8.5M12 4l4.5 4.5M5 14v5h14v-5" />
            </svg>
          </span>
          <strong>{{ hasSource ? 'Ganti foto' : 'Pilih foto' }}</strong>
          <span>atau jatuhkan file di sini</span>
          <small>JPG, PNG, atau WebP · maks. 12 MB</small>
        </label>

        <div class="blend-control" :class="{ 'blend-control--disabled': !hasSource }">
          <div class="blend-label">
            <label for="blend-strength">Kekuatan perpaduan</label>
            <output for="blend-strength">{{ blendStrength }}%</output>
          </div>
          <input
            id="blend-strength"
            v-model.number="blendStrength"
            type="range"
            min="25"
            max="100"
            step="1"
            :disabled="!hasSource"
            @input="drawComposite"
          />
          <div class="range-ends"><span>Lebih samar</span><span>Lebih nyata</span></div>
        </div>

        <div class="editor-actions">
          <button
            class="download-button"
            type="button"
            :disabled="!hasResult"
            @click="downloadImage"
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M12 4v12m0 0 4.5-4.5M12 16l-4.5-4.5M5 18v2h14v-2" />
            </svg>
            Unduh hasil PNG
          </button>
          <button
            class="clear-button"
            type="button"
            :disabled="!hasSource && !hasResult"
            @click="clearStudio"
          >
            Bersihkan foto
          </button>
        </div>

        <p class="privacy-detail">
          Foto tidak dikirim ke server. Setelah hasil diunduh atau kamu menekan bersihkan, sumber
          foto dilepas dari memori halaman.
        </p>
        <p v-if="hasResult && !hasSource" class="source-cleared" role="status">
          Foto sumber sudah dibersihkan. Hasilnya tetap siap diunduh.
        </p>
      </div>

      <div class="artboard-column">
        <div class="artboard-toolbar">
          <span>{{ hasResult ? 'Pratinjau hasil' : 'Ruang pratinjau' }}</span>
          <span class="artboard-size">1200 × 1200 px</span>
        </div>
        <div class="artboard" :class="{ 'artboard--ready': hasResult }">
          <canvas
            ref="canvas"
            width="1200"
            height="1200"
            aria-label="Pratinjau foto yang sudah dipadukan dengan asap"
          />
          <div v-if="!hasResult" class="empty-artboard">
            <div class="empty-mark" aria-hidden="true"><span></span><span></span><span></span></div>
            <p>Potretmu akan muncul di sini</p>
            <span>Hasil akan tampil langsung setelah foto dipilih.</span>
          </div>
        </div>
        <p class="artboard-caption">
          <span class="caption-dot" aria-hidden="true"></span>
          Kanvas persegi untuk foto profil dan sampul
        </p>
      </div>
    </section>
  </main>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useToast } from 'vue-toastification'
import { apiFetch } from '@/api/client.js'

const toast = useToast()
const canvas = ref(null)
const fileInput = ref(null)
const smokeOverlay = ref(null)
const sourceBitmap = ref(null)
const blendStrength = ref(78)
const isDragging = ref(false)
const hasResult = ref(false)
const hasSource = computed(() => Boolean(sourceBitmap.value))

onMounted(() => {
  const image = new Image()
  image.onload = () => {
    smokeOverlay.value = image
    drawComposite()
  }
  image.onerror = () =>
    toast.error('Tekstur asap tidak dapat dimuat. Muat ulang halaman untuk mencoba lagi.')
  image.src = '/assets/images/smoke-overlay.webp'
})

onUnmounted(() => {
  releaseSource()
})

watch(blendStrength, drawComposite)

async function handleFileChange(event) {
  const [file] = event.target.files || []
  event.target.value = ''
  if (file) await loadPhoto(file)
}

async function handleDrop(event) {
  isDragging.value = false
  const [file] = event.dataTransfer?.files || []
  if (file) await loadPhoto(file)
}

async function loadPhoto(file) {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
    toast.warning('Pilih foto berformat JPG, PNG, atau WebP.')
    return
  }
  if (file.size > 12 * 1024 * 1024) {
    toast.warning('Ukuran foto maksimal 12 MB. Pilih file yang lebih kecil.')
    return
  }

  try {
    await apiFetch('/smoke-studio/attempt', { method: 'POST', body: '{}' })
  } catch (error) {
    if (error.status === 429) {
      toast.warning(
        error.message || 'Terlalu banyak percobaan. Tunggu sebentar sebelum mencoba lagi.',
      )
    } else {
      toast.error('Layanan sedang sulit dijangkau. Foto belum diproses, coba lagi sebentar.')
    }
    return
  }

  try {
    const bitmap = await createImageBitmap(file)
    releaseSource()
    sourceBitmap.value = bitmap
    drawComposite()
  } catch {
    toast.error('Foto tidak dapat dibuka. Coba gunakan file gambar lain.')
  }
}

function drawComposite() {
  const target = canvas.value
  const context = target?.getContext('2d')
  if (!context || !smokeOverlay.value) return

  const { width, height } = target
  context.clearRect(0, 0, width, height)
  context.fillStyle = '#a8a9a5'
  context.fillRect(0, 0, width, height)
  context.drawImage(smokeOverlay.value, 0, 0, width, height)

  if (!sourceBitmap.value) return

  const photo = sourceBitmap.value
  const scale = Math.max(width / photo.width, height / photo.height)
  const cropWidth = width / scale
  const cropHeight = height / scale
  const cropX = (photo.width - cropWidth) / 2
  const cropY = Math.max(0, (photo.height - cropHeight) * 0.34)

  const portraitLayer = document.createElement('canvas')
  portraitLayer.width = width
  portraitLayer.height = height
  const portraitContext = portraitLayer.getContext('2d')
  portraitContext.drawImage(photo, cropX, cropY, cropWidth, cropHeight, 0, 0, width, height)

  const edgeMask = portraitContext.createRadialGradient(
    width / 2,
    height / 2,
    width * 0.2,
    width / 2,
    height / 2,
    width * 0.76,
  )
  edgeMask.addColorStop(0, 'rgba(0, 0, 0, 1)')
  edgeMask.addColorStop(0.72, 'rgba(0, 0, 0, 0.98)')
  edgeMask.addColorStop(1, 'rgba(0, 0, 0, 0)')
  portraitContext.globalCompositeOperation = 'destination-in'
  portraitContext.fillStyle = edgeMask
  portraitContext.fillRect(0, 0, width, height)

  context.save()
  context.globalAlpha = blendStrength.value / 100
  context.globalCompositeOperation = 'soft-light'
  context.drawImage(portraitLayer, 0, 0)
  context.restore()

  // Reapply the smoke texture above the softened portrait so its transparent grain remains visible.
  context.save()
  context.globalAlpha = 0.6
  context.globalCompositeOperation = 'screen'
  context.drawImage(smokeOverlay.value, 0, 0, width, height)
  context.restore()
  hasResult.value = true
}

async function downloadImage() {
  if (!canvas.value || !hasResult.value) return
  canvas.value.toBlob((blob) => {
    if (!blob) {
      toast.error('Hasil belum bisa disimpan. Coba unduh sekali lagi.')
      return
    }
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'foto-profil-asap-satu-undangan.png'
    link.click()
    window.setTimeout(() => URL.revokeObjectURL(url), 1000)
    releaseSource()
    toast.success('PNG tersimpan. Foto sumber sudah dilepas dari memori halaman.')
  }, 'image/png')
}

function clearStudio() {
  releaseSource()
  hasResult.value = false
  if (canvas.value) {
    canvas.value.getContext('2d')?.clearRect(0, 0, canvas.value.width, canvas.value.height)
  }
  toast.info('Foto dan pratinjau sudah dibersihkan dari halaman.')
}

function releaseSource() {
  sourceBitmap.value?.close?.()
  sourceBitmap.value = null
}
</script>

<style scoped>
.smoke-studio {
  --fog: #a8a9a5;
  --charcoal: #252623;
  --paper: #f4f3ef;
  --ember: #d76538;
  --denim: #667fa5;
  min-height: 100vh;
  padding: 0 clamp(20px, 6vw, 92px) 68px;
  color: var(--charcoal);
  background: var(--paper);
  font-family: Inter, sans-serif;
}

.studio-header {
  min-height: 78px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(37, 38, 35, 0.15);
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 11px;
  color: var(--charcoal);
  font-size: 13px;
  font-weight: 650;
  text-decoration: none;
}

.brand img {
  width: 30px;
  height: 30px;
  object-fit: contain;
}

.privacy-note {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  color: #60615c;
  font-size: 12px;
}

.privacy-note span {
  color: #668875;
  font-size: 9px;
}

.studio-intro {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 32px;
  padding: clamp(38px, 6vw, 72px) 0 38px;
}

.intro-kicker {
  margin: 0 0 14px;
  color: #73736d;
  font-size: 12px;
}

.studio-intro h1 {
  max-width: 720px;
  margin: 0;
  font-family: 'Playfair Display', Georgia, serif;
  font-size: clamp(36px, 5vw, 64px);
  font-weight: 500;
  letter-spacing: -0.045em;
  line-height: 1.06;
}

.studio-intro h1 em {
  color: var(--denim);
  font-weight: 500;
}

.intro-copy {
  max-width: 285px;
  margin: 0 0 4px;
  color: #686963;
  font-size: 13px;
  line-height: 1.75;
}

.editor {
  display: grid;
  grid-template-columns: minmax(245px, 310px) minmax(0, 1fr);
  gap: clamp(30px, 6vw, 86px);
  align-items: start;
}

.controls {
  padding-top: 15px;
}

.control-heading {
  display: flex;
  gap: 14px;
  align-items: flex-start;
  margin-bottom: 22px;
}

.step-mark {
  display: grid;
  width: 29px;
  height: 29px;
  flex: 0 0 auto;
  place-items: center;
  border-radius: 50%;
  background: var(--charcoal);
  color: white;
  font-size: 10px;
  font-weight: 600;
}

.control-heading h2 {
  margin: 1px 0 5px;
  font-size: 15px;
  font-weight: 650;
}

.control-heading p {
  margin: 0;
  color: #73736d;
  font-size: 12px;
  line-height: 1.55;
}

.upload-zone {
  min-height: 190px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 22px;
  border: 1px dashed #9d9e98;
  background: rgba(255, 255, 255, 0.44);
  color: var(--charcoal);
  cursor: pointer;
  text-align: center;
  transition:
    border-color 160ms ease,
    background-color 160ms ease;
}

.upload-zone:hover,
.upload-zone--active {
  border-color: var(--denim);
  background: #fff;
}

.upload-zone--loaded {
  border-style: solid;
  border-color: rgba(102, 127, 165, 0.5);
}

.upload-zone input {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
}

.upload-zone:focus-within {
  outline: 3px solid rgba(102, 127, 165, 0.4);
  outline-offset: 3px;
}

.upload-icon {
  display: grid;
  width: 36px;
  height: 36px;
  margin-bottom: 12px;
  place-items: center;
  border: 1px solid rgba(37, 38, 35, 0.2);
  border-radius: 50%;
}

.upload-icon svg,
.download-button svg {
  width: 17px;
  height: 17px;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.5;
}

.upload-zone strong {
  margin-bottom: 5px;
  font-size: 13px;
  font-weight: 650;
}

.upload-zone > span:not(.upload-icon) {
  color: #73736d;
  font-size: 11px;
}

.upload-zone small {
  margin-top: 14px;
  color: #8b8c86;
  font-size: 10px;
}

.blend-control {
  margin-top: 29px;
}

.blend-control--disabled {
  opacity: 0.48;
}

.blend-label,
.range-ends {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.blend-label label {
  font-size: 12px;
  font-weight: 600;
}

.blend-label output {
  color: var(--denim);
  font-size: 12px;
  font-weight: 650;
}

.blend-control input {
  width: 100%;
  margin: 15px 0 7px;
  accent-color: var(--denim);
  cursor: pointer;
}

.blend-control input:focus-visible,
.editor-actions button:focus-visible {
  outline: 3px solid rgba(102, 127, 165, 0.55);
  outline-offset: 3px;
}

.range-ends {
  color: #85867f;
  font-size: 10px;
}

.editor-actions {
  display: grid;
  gap: 8px;
  margin-top: 29px;
}

.editor-actions button {
  min-height: 46px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border: 1px solid var(--charcoal);
  border-radius: 4px;
  font: inherit;
  font-size: 12px;
  font-weight: 650;
  cursor: pointer;
  transition:
    background-color 160ms ease,
    color 160ms ease,
    opacity 160ms ease;
}

.download-button {
  background: var(--charcoal);
  color: white;
}

.download-button:not(:disabled):hover {
  background: var(--denim);
  border-color: var(--denim);
}

.download-button:disabled,
.clear-button:disabled {
  cursor: not-allowed;
  opacity: 0.42;
}

.clear-button {
  background: transparent;
  color: var(--charcoal);
}

.clear-button:not(:disabled):hover {
  background: #e8e7e2;
}

.privacy-detail {
  margin: 17px 0 0;
  color: #74756f;
  font-size: 10px;
  line-height: 1.65;
}

.source-cleared {
  margin: 12px 0 0;
  color: #557562;
  font-size: 11px;
  line-height: 1.5;
}

.artboard-toolbar {
  display: flex;
  justify-content: space-between;
  padding: 0 0 12px;
  color: #555650;
  font-size: 11px;
}

.artboard-size {
  color: #888982;
  font-variant-numeric: tabular-nums;
}

.artboard {
  position: relative;
  width: 100%;
  max-width: 680px;
  aspect-ratio: 1;
  overflow: hidden;
  background: #afb0ac;
  box-shadow: 0 18px 54px rgba(37, 38, 35, 0.11);
}

.artboard canvas {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.artboard--ready canvas {
  animation: reveal 480ms ease-out both;
}

.empty-artboard {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 20px;
  color: #f4f3ef;
  text-align: center;
  text-shadow: 0 1px 14px rgba(37, 38, 35, 0.2);
}

.empty-artboard p {
  margin: 17px 0 6px;
  font-family: 'Playfair Display', Georgia, serif;
  font-size: clamp(19px, 2.2vw, 26px);
}

.empty-artboard > span {
  color: rgba(255, 255, 255, 0.82);
  font-size: 11px;
}

.empty-mark {
  position: relative;
  width: 50px;
  height: 50px;
}

.empty-mark span {
  position: absolute;
  display: block;
  width: 44px;
  height: 18px;
  border: 1px solid rgba(255, 255, 255, 0.64);
  border-radius: 50%;
  transform: rotate(-28deg);
}

.empty-mark span:nth-child(1) {
  top: 3px;
  left: 2px;
}
.empty-mark span:nth-child(2) {
  top: 15px;
  left: 4px;
  opacity: 0.7;
}
.empty-mark span:nth-child(3) {
  top: 27px;
  left: 0;
  opacity: 0.42;
}

.artboard-caption {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 12px 0 0;
  color: #777871;
  font-size: 10px;
}

.caption-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--ember);
}

@keyframes reveal {
  from {
    opacity: 0.62;
  }
  to {
    opacity: 1;
  }
}

@media (max-width: 760px) {
  .smoke-studio {
    padding: 0 20px 44px;
  }
  .studio-header {
    min-height: 66px;
  }
  .privacy-note {
    max-width: 132px;
    font-size: 10px;
  }
  .studio-intro {
    display: block;
    padding: 38px 0 27px;
  }
  .intro-copy {
    max-width: 400px;
    margin-top: 17px;
  }
  .editor {
    grid-template-columns: 1fr;
    gap: 34px;
  }
  .controls {
    padding-top: 0;
  }
  .upload-zone {
    min-height: 166px;
  }
  .artboard {
    max-width: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
