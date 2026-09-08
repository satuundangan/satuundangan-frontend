<template>
  <main class="monitor-page">
    <header class="topbar">
      <a class="brand" href="/" aria-label="Kembali ke Satu Undangan">
        <span class="brand-mark">SU</span>
        <span>Satu Undangan</span>
      </a>
      <div class="topbar-meta">
        <span class="live-dot"></span>
        <span>Monitoring aktif</span>
        <span class="updated">{{ lastUpdatedLabel }}</span>
      </div>
    </header>

    <section class="intro">
      <div>
        <p class="eyebrow">Pusat pemantauan vulkanik</p>
        <h1>Pantau Anak Krakatau</h1>
        <p class="intro-copy">Pantau posisi gunung, arah sebaran abu, dan pembaruan aktivitas di sekitar Selat Sunda.</p>
      </div>
      <button class="refresh-button" type="button" @click="refreshData">
        <span :class="{ spinning: refreshing }">↻</span> Perbarui data
      </button>
    </section>

    <section class="status-strip" aria-label="Status gunung api">
      <div class="status-main">
        <span class="status-icon">!</span>
        <div>
          <span class="status-label">Status aktivitas</span>
          <strong>Level III — Siaga</strong>
        </div>
      </div>
      <div class="status-item"><span>Pengamatan terakhir</span><strong>08 Sep 2026 · 14:20 WIB</strong></div>
      <div class="status-item"><span>Koordinat</span><strong>6°06′05″ LS · 105°25′23″ BT</strong></div>
      <div class="status-source"><span class="source-check">✓</span> Sumber: PVMBG</div>
    </section>

    <section class="workspace">
      <div class="map-card">
        <div class="map-toolbar">
          <div><strong>Peta sebaran</strong><span>Selat Sunda · pembaruan terakhir 14:20 WIB</span></div>
          <div class="map-actions"><button type="button" aria-label="Perbesar peta" @click="zoom(1)">+</button><button type="button" aria-label="Perkecil peta" @click="zoom(-1)">−</button><button type="button" aria-label="Reset peta" @click="resetMap">⌂</button></div>
        </div>
        <div ref="mapViewport" class="map-viewport" role="application" aria-label="Peta interaktif Anak Krakatau"></div>
        <div class="map-legend"><span><i class="legend-point volcano"></i> Lokasi gunung</span><span><i class="legend-line"></i> Arah sebaran abu</span><span><i class="legend-area"></i> Area terdampak</span></div>
      </div>

      <aside class="side-panel">
        <article class="info-card alert-card"><div class="card-heading"><span class="card-icon orange">↗</span><div><p>Pergerakan abu</p><strong>Menuju timur laut</strong></div></div><div class="wind"><span>Kecepatan angin</span><strong>12 — 18 km/jam</strong></div><div class="direction"><span>Barat</span><div class="direction-track"><span>→</span></div><span>Timur laut</span></div></article>
        <article class="info-card"><div class="card-heading"><span class="card-icon blue">◉</span><div><p>Radius pengamatan</p><strong>5 km dari kawah</strong></div></div><p class="card-note">Masyarakat dilarang mendekati kawah aktif dalam radius ini.</p><div class="progress"><span style="width: 58%"></span></div><div class="progress-label"><span>Area aman</span><strong>42%</strong></div></article>
        <article class="info-card"><div class="card-heading"><span class="card-icon teal">▣</span><div><p>Aktivitas terkini</p><strong>Erupsi berlangsung</strong></div></div><div class="activity-list"><div><span>14:20</span><p>Letusan abu kelabu, tinggi kolom ± 800 m</p></div><div><span>13:45</span><p>Gempa hembusan terekam 6 kali</p></div><div><span>12:10</span><p>Asap kawah utama berwarna putih tipis</p></div></div></article>
      </aside>
    </section>

    <section class="notice"><span class="notice-icon">i</span><p><strong>Catatan keselamatan</strong><br />Informasi ini adalah ringkasan pemantauan. Ikuti arahan resmi PVMBG, BPBD, dan pemerintah daerah setempat untuk keputusan evakuasi.</p><a href="https://magma.esdm.go.id/" target="_blank" rel="noopener">Buka MAGMA Indonesia ↗</a></section>
    <footer>Data diperbarui berkala · <a href="/">satuundangan.id</a></footer>
  </main>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

const refreshing = ref(false)
const lastUpdated = ref(new Date())
const lastUpdatedLabel = computed(() => `diperbarui ${lastUpdated.value.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`)
const mapViewport = ref(null)
let map

function zoom(amount) { map?.setZoom(map.getZoom() + amount) }
function resetMap() { map?.setView([-5.919, 106.479], 9) }
function loadLeaflet() {
  if (window.L) return Promise.resolve(window.L)
  return new Promise((resolve, reject) => {
    if (!document.querySelector('link[data-leaflet-css]')) {
      const style = document.createElement('link')
      style.rel = 'stylesheet'
      style.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      style.dataset.leafletCss = 'true'
      document.head.appendChild(style)
    }
    const script = document.createElement('script')
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
    script.onload = () => resolve(window.L)
    script.onerror = reject
    document.head.appendChild(script)
  })
}
async function initMap() {
  const L = await loadLeaflet()
  if (!mapViewport.value) return
  map = L.map(mapViewport.value, { zoomControl: false, attributionControl: true }).setView([-5.919, 106.479], 9)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors' }).addTo(map)
  const volcano = L.latLng(-6.102, 105.423)
  L.circle(volcano, { radius: 5000, color: '#d58b40', weight: 2, fillColor: '#efbd74', fillOpacity: .2 }).addTo(map)
  L.circle(volcano, { radius: 700, color: '#c36e32', weight: 1, fillColor: '#e8a75e', fillOpacity: .32 }).addTo(map)
  L.marker(volcano).addTo(map).bindPopup('<strong>Anak Krakatau</strong><br>6°06′05″ LS · 105°25′23″ BT')
  L.polyline([volcano, [-5.78, 106.2], [-5.55, 106.8]], { color: '#d58b40', weight: 4, dashArray: '10 8' }).addTo(map)
  L.control.zoom({ position: 'topright' }).addTo(map)
}
function refreshData() { refreshing.value = true; window.setTimeout(() => { lastUpdated.value = new Date(); refreshing.value = false }, 700) }
onMounted(initMap)
onBeforeUnmount(() => map?.remove())
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Manrope:wght@400;500;600;700;800&display=swap');
:global(body) { margin: 0; background: #f2f7f6; color: #123b40; font-family: Manrope, sans-serif; }
.monitor-page { min-height: 100vh; background: #f2f7f6; }
.topbar,.intro,.workspace,.status-strip,.notice,footer { max-width: 1240px; margin: auto; }
.topbar { height: 72px; display:flex; align-items:center; justify-content:space-between; padding: 0 28px; }
.brand { display:flex; align-items:center; gap:10px; color:#123b40; text-decoration:none; font-weight:800; letter-spacing:-.03em; }.brand-mark { display:grid; place-items:center; width:30px;height:30px;border-radius:9px;background:#e8b466;color:#173f42;font-size:12px; }.topbar-meta { color:#527478; font:500 12px 'DM Mono',monospace; display:flex; gap:8px; align-items:center; }.live-dot { width:8px;height:8px;border-radius:50%;background:#49b88e;box-shadow:0 0 0 4px #d6f0e7; }.updated { color:#9aafb0; margin-left:8px; }
.intro { padding: 45px 28px 30px; display:flex; align-items:end; justify-content:space-between; }.eyebrow { color:#5e9695; text-transform:uppercase; font:500 11px 'DM Mono',monospace; letter-spacing:.12em; margin:0 0 12px; }.intro h1 { font-size:clamp(32px, 4vw, 52px); letter-spacing:-.06em; margin:0; color:#123b40; }.intro-copy { margin:15px 0 0; max-width:580px; color:#6d8585; font-size:15px; }.refresh-button { background:#123f43;color:white;border:0;border-radius:10px;padding:13px 17px;font:600 13px Manrope;cursor:pointer; }.refresh-button span { font-size:19px;vertical-align:-2px;margin-right:4px;display:inline-block; }.spinning { animation:spin .7s linear infinite; }@keyframes spin{to{transform:rotate(360deg)}}
.status-strip { width:calc(100% - 56px); max-width:1184px; margin:0 auto 24px; background:#fff;border:1px solid #dcebea;border-radius:14px;display:grid;grid-template-columns:minmax(220px,1.05fr) minmax(210px,1.18fr) minmax(260px,1.45fr) auto;align-items:stretch;min-height:72px;overflow:hidden; }.status-main { display:flex;align-items:center;gap:12px;padding:17px 23px;background:#fff8ed;min-width:0; }.status-icon { width:27px;height:27px;border-radius:50%;display:grid;place-items:center;background:#e8b466;color:#fff;font-weight:800;flex:0 0 auto; }.status-label,.status-item span { display:block;color:#789091;font:500 11px 'DM Mono',monospace;margin-bottom:5px; }.status-main strong { color:#bd6b2a;font-size:15px;white-space:nowrap; }.status-item { padding:0 25px;border-left:1px solid #e8f0ef;display:flex;flex-direction:column;justify-content:center;min-width:0; }.status-item strong { font-size:13px;white-space:nowrap; }.status-source { display:flex;align-items:center;justify-content:flex-end;padding:0 24px;color:#819696;font:500 11px 'DM Mono',monospace;white-space:nowrap; }.source-check { color:#43ae88;font-size:16px;margin-right:4px; }
.workspace { display:grid;grid-template-columns:minmax(0, 1.65fr) minmax(310px, .8fr);gap:20px;padding:0 28px; }.map-card,.info-card { background:#fff;border:1px solid #dcebea;border-radius:14px;overflow:hidden; }.map-toolbar { padding:16px 18px;display:flex;justify-content:space-between;align-items:center; }.map-toolbar strong { display:block;font-size:15px; }.map-toolbar span { display:block;color:#8aa0a0;font:500 11px 'DM Mono',monospace;margin-top:5px; }.map-actions { display:flex;gap:5px; }.map-actions button { background:#f1f7f6;border:1px solid #dcebea;color:#3e6e70;border-radius:7px;width:30px;height:30px;font-size:18px;cursor:pointer; }.map-viewport { height:490px;overflow:hidden;position:relative;background:#d9e8e5;touch-action:none;z-index:0; }.map-viewport :deep(.leaflet-control-attribution) { font-size:10px; }.map-viewport :deep(.leaflet-popup-content) { font-family:Manrope,sans-serif;font-size:12px;line-height:1.5; }.map-legend{padding:13px 17px;display:flex;gap:20px;flex-wrap:wrap;color:#6e8585;font:500 11px 'DM Mono',monospace}.map-legend span{display:flex;gap:7px;align-items:center}.legend-point{width:9px;height:9px;border-radius:50%;display:inline-block}.legend-point.volcano{background:#ebb363;box-shadow:0 0 0 3px #f6dfb9}.legend-line{display:inline-block;width:19px;border-top:2px dashed #d58b40}.legend-area{display:inline-block;width:12px;height:12px;border-radius:50%;background:#efbd74;opacity:.65}
.side-panel { display:flex;flex-direction:column;gap:12px; }.info-card{padding:18px 19px}.card-heading{display:flex;gap:11px;align-items:center}.card-heading p{margin:0 0 4px;color:#7d9292;font:500 11px 'DM Mono',monospace}.card-heading strong{font-size:15px}.card-icon{width:30px;height:30px;display:grid;place-items:center;border-radius:8px;font-weight:800;font-size:17px}.orange{background:#fff0d9;color:#d88938}.blue{background:#e1f1f4;color:#4d9aa4}.teal{background:#e0f3ea;color:#48a883}.wind{display:flex;justify-content:space-between;margin:20px 0 13px;color:#718787;font:500 11px 'DM Mono',monospace}.wind strong{color:#315e61;font-weight:500}.direction{display:flex;align-items:center;gap:9px;color:#90a2a2;font:11px 'DM Mono',monospace}.direction-track{height:2px;flex:1;background:#e7eeee;position:relative}.direction-track span{position:absolute;right:8%;top:-12px;color:#d98b3a;font-size:21px}.card-note{color:#789090;font-size:12px;line-height:1.6;margin:17px 0 15px}.progress{height:5px;background:#e5eeee;border-radius:9px;overflow:hidden}.progress span{display:block;height:100%;background:#5aa69a;border-radius:9px}.progress-label{display:flex;justify-content:space-between;color:#8ca0a0;font:11px 'DM Mono',monospace;margin-top:8px}.activity-list{margin-top:16px}.activity-list>div{border-top:1px solid #edf2f1;padding:10px 0 2px;display:flex;gap:12px}.activity-list span{color:#bd7a3b;font:11px 'DM Mono',monospace;padding-top:2px}.activity-list p{margin:0;color:#647d7d;font-size:12px;line-height:1.5}.notice{margin:20px 28px 0;display:flex;align-items:center;gap:12px;border:1px solid #d9e9e6;background:#eaf6f2;border-radius:12px;padding:13px 16px;color:#567a79}.notice-icon{border:1px solid #76b7a2;color:#4e9c84;border-radius:50%;width:19px;height:19px;display:grid;place-items:center;font:600 12px Georgia}.notice p{font-size:12px;line-height:1.55;margin:0;flex:1}.notice strong{color:#285e5e}.notice a{color:#3e8d7b;text-decoration:none;font:600 11px 'DM Mono',monospace;white-space:nowrap}footer{text-align:right;padding:25px 28px 35px;color:#9aacab;font:11px 'DM Mono',monospace}footer a{color:#668b8a;text-decoration:none}
@media (max-width:760px){.topbar{height:62px;padding:0 18px}.topbar-meta{font-size:10px}.updated{display:none}.intro{padding:30px 18px 22px;display:block}.intro h1{font-size:36px}.intro-copy{font-size:14px;line-height:1.6}.refresh-button{margin-top:18px;width:100%}.status-strip{width:auto;margin:0 18px 16px;display:grid;grid-template-columns:1fr 1fr}.status-main{grid-column:span 2;padding:15px 17px}.status-item{padding:13px 17px;border-top:1px solid #e8f0ef}.status-item:nth-child(3){border-left:0}.status-item strong{font-size:11px;line-height:1.4;display:block}.status-source{grid-column:span 2;margin:0;padding:12px 17px;border-top:1px solid #e8f0ef}.workspace{display:block;padding:0 18px}.map-toolbar{padding:14px}.map-viewport{height:390px}.map-legend{gap:11px 14px;padding:12px 14px}.map-legend span{font-size:10px}.side-panel{margin-top:12px}.info-card{padding:16px}.notice{margin:16px 18px 0;align-items:flex-start}.notice a{display:none}footer{padding:22px 18px 28px;text-align:left}}
</style>
