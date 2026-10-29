<template>
  <AdminShell
    :title="isEditing ? 'Edit Artikel' : 'Tulis Artikel Baru'"
    :description="
      isEditing ? 'Perbarui konten dan pengaturan SEO' : 'Buat artikel baru dengan optimasi SEO'
    "
  >
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main Content Area -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Local draft recovery -->
        <div
          v-if="localDraft"
          role="status"
          class="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"
        >
          <p class="font-semibold">
            Ada draft di perangkat ini ({{ formatDateTime(localDraft.savedAt) }})
          </p>
          <p v-if="draftServerChanged" class="mt-1 text-xs">
            Versi server sudah berubah sejak draft ini dibuat. Periksa isinya sebelum memulihkan;
            konten server tidak ditimpa sampai Anda memilih.
          </p>
          <div class="mt-3 flex gap-2">
            <button
              type="button"
              class="rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-amber-700"
              @click="restoreLocalDraft"
            >
              Pulihkan draft perangkat
            </button>
            <button
              type="button"
              class="rounded-lg border border-amber-300 px-3 py-1.5 text-xs font-medium text-amber-800 hover:bg-amber-100"
              @click="discardLocalDraft"
            >
              Buang draft
            </button>
          </div>
        </div>
        <p v-if="draftError" role="alert" class="rounded-lg bg-rose-50 px-4 py-2 text-xs text-rose-700">
          {{ draftError }}
        </p>

        <!-- Title -->
        <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <input
            v-model="form.title"
            type="text"
            placeholder="Judul Artikel..."
            class="w-full text-2xl font-bold text-slate-900 placeholder-slate-300 border-none outline-none bg-transparent"
            @input="onTitleChange"
          />
          <div class="mt-2 flex items-center gap-2 text-xs text-slate-400">
            <i class="pi pi-link text-xs"></i>
            <span>/blog/</span>
            <input
              v-model="form.slug"
              type="text"
              placeholder="url-slug-otomatis"
              class="flex-1 border-none outline-none bg-transparent text-slate-600 font-mono"
            />
          </div>
        </div>

        <!-- Rich Text Editor -->
        <div class="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <!-- Toolbar -->
          <div
            v-if="editor"
            class="flex flex-wrap items-center gap-1 border-b border-slate-200 bg-slate-50/50 px-4 py-2"
          >
            <button
              v-for="btn in toolbarButtons"
              :key="btn.action"
              @click="btn.handler()"
              :class="[
                'rounded-lg p-2 text-sm transition-colors',
                btn.isActive?.()
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-500 hover:bg-slate-200 hover:text-slate-900',
              ]"
              :title="btn.title"
            >
              <i :class="['pi', btn.icon]"></i>
            </button>
            <div class="mx-2 h-6 w-px bg-slate-200"></div>
            <button
              v-for="heading in headingButtons"
              :key="heading.level"
              @click="editor.chain().focus().toggleHeading({ level: heading.level }).run()"
              :class="[
                'rounded-lg px-2.5 py-1.5 text-xs font-bold transition-colors',
                editor.isActive('heading', { level: heading.level })
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-500 hover:bg-slate-200',
              ]"
              :title="`Heading ${heading.level}`"
            >
              H{{ heading.level }}
            </button>
            <div class="mx-2 h-6 w-px bg-slate-200"></div>
            <button
              @click="addImage"
              class="rounded-lg p-2 text-sm text-slate-500 hover:bg-slate-200 hover:text-slate-900 transition-colors"
              title="Sisipkan Gambar"
            >
              <i class="pi pi-image"></i>
            </button>
            <button
              @click="setLink"
              :class="[
                'rounded-lg p-2 text-sm transition-colors',
                editor?.isActive('link')
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-500 hover:bg-slate-200 hover:text-slate-900',
              ]"
              title="Sisipkan Link"
            >
              <i class="pi pi-link"></i>
            </button>
          </div>

          <!-- Editor Content -->
          <div class="prose prose-slate max-w-none">
            <editor-content
              :editor="editor"
              class="min-h-[400px] px-6 py-4 focus-within:outline-none"
            />
          </div>

          <!-- Character Count -->
          <div
            v-if="editor"
            class="flex items-center justify-between border-t border-slate-100 px-6 py-2 text-xs text-slate-400"
          >
            <span
              >{{ editor.storage.characterCount.characters() }} karakter ·
              {{ editor.storage.characterCount.words() }} kata</span
            >
            <span v-if="form.focusKeyword" :class="keywordDensityClass">
              Kepadatan keyword: {{ keywordDensity }}%
            </span>
          </div>
        </div>

        <!-- Excerpt -->
        <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <label class="block text-sm font-semibold text-slate-700 mb-2">Ringkasan / Excerpt</label>
          <textarea
            v-model="form.excerpt"
            rows="3"
            maxlength="300"
            placeholder="Ringkasan singkat artikel untuk ditampilkan di halaman daftar artikel..."
            class="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100 resize-none"
          ></textarea>
          <p class="mt-1 text-xs text-slate-400 text-right">
            {{ (form.excerpt || '').length }}/300
          </p>
        </div>
      </div>

      <!-- Right Sidebar -->
      <div class="space-y-6">
        <!-- Publish Settings -->
        <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 class="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
            <i class="pi pi-send text-blue-500"></i>
            Publikasi
          </h3>
          <div class="space-y-4">
            <div>
              <label class="block text-xs font-medium text-slate-500 mb-1.5">Status</label>
              <select
                v-model="form.status"
                class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="scheduled">Terjadwal</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-500 mb-1.5">
                Jadwal terbit (WIB)
              </label>
              <input
                v-model="scheduleInput"
                type="datetime-local"
                class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
              />
              <button
                type="button"
                :disabled="saving"
                class="mt-2 w-full rounded-lg border border-blue-200 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-50 transition-colors disabled:opacity-50"
                @click="saveArticle('scheduled')"
              >
                Jadwalkan terbit
              </button>
            </div>
            <div v-if="form.generatedByAi" class="space-y-2 rounded-lg bg-slate-50 p-3">
              <p class="text-xs font-medium text-slate-600">
                Artikel AI: wajib ada sumber dan tinjauan editorial sebelum terbit
              </p>
              <textarea
                v-model="sourceUrlsText"
                rows="3"
                placeholder="Satu URL sumber per baris (https://...)"
                class="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs outline-none focus:border-slate-400"
              ></textarea>
              <label class="flex items-center gap-2 text-xs text-slate-600">
                <input v-model="editorialReviewed" type="checkbox" />
                Saya sudah meninjau isi dan sumbernya
              </label>
            </div>
            <p class="text-xs" :class="draftStatusClass" role="status">{{ draftStatusText }}</p>
            <div class="flex flex-wrap gap-2 border-t border-slate-100 pt-3">
              <button
                ref="previewTrigger"
                type="button"
                class="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                @click="openPreview"
              >
                Pratinjau
              </button>
              <button
                type="button"
                class="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                :disabled="!isEditing || linkCheck.loading"
                :title="isEditing ? '' : 'Simpan draft lebih dulu agar tautan dapat dicek'"
                @click="runLinkCheck"
              >
                {{ linkCheck.loading ? 'Memeriksa…' : 'Cek tautan & gambar' }}
              </button>
            </div>
            <div v-if="linkCheck.error" role="alert" class="text-xs text-rose-700">{{ linkCheck.error }}</div>
            <div v-else-if="linkCheck.result" class="text-xs" data-testid="link-check">
              <p class="font-semibold">
                {{ linkCheck.result.checked }} tautan dicek: {{ linkCheck.result.broken }} rusak,
                {{ linkCheck.result.notChecked }} tidak dapat dicek.
              </p>
              <p class="text-slate-500">Memeriksa versi yang tersimpan di server.</p>
              <ul class="mt-1 space-y-1">
                <li v-for="item in linkCheck.result.results.filter((r) => r.status !== 'ok')" :key="item.url" class="break-all">
                  <span :class="item.status === 'rusak' ? 'text-rose-700' : 'text-amber-700'">{{ item.status === 'rusak' ? 'Rusak' : 'Tidak dicek' }}</span>
                  · {{ item.kind }} · {{ item.url }} <span class="text-slate-500">({{ item.note }})</span>
                </li>
              </ul>
              <p class="mt-1 text-slate-500">{{ linkCheck.result.note }}</p>
            </div>
            <div class="flex gap-2">
              <button
                @click="saveArticle('draft')"
                :disabled="saving"
                class="flex-1 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                Simpan Draft
              </button>
              <button
                @click="saveArticle('published')"
                :disabled="saving"
                class="flex-1 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 transition-colors disabled:opacity-50"
              >
                {{ saving ? 'Menyimpan...' : 'Publikasikan' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Cover Image -->
        <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 class="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
            <i class="pi pi-image text-pink-500"></i>
            Cover Image
          </h3>
          <div v-if="form.coverImage" class="relative rounded-xl overflow-hidden mb-3">
            <img :src="form.coverImage" alt="Cover" class="w-full h-40 object-cover" />
            <button
              @click="form.coverImage = ''"
              class="absolute top-2 right-2 rounded-full bg-black/60 p-1.5 text-white hover:bg-black/80"
            >
              <i class="pi pi-times text-xs"></i>
            </button>
          </div>
          <input
            v-model="form.coverImage"
            type="text"
            placeholder="URL gambar cover..."
            class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
          />
        </div>

        <!-- SEO Panel -->
        <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-sm font-bold text-slate-800 flex items-center gap-2">
              <i class="pi pi-search text-emerald-500"></i>
              Kelengkapan SEO
            </h3>
            <span
              class="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold"
              :class="seoScoreBadgeClass"
            >
              {{ seoScoreValue }}%
            </span>
          </div>

          <p class="mb-4 text-xs text-slate-500">
            Checklist kelengkapan konten dan metadata; skor ini bukan prediksi peringkat Google.
          </p>

          <!-- SEO Score Bar -->
          <div class="mb-4">
            <div class="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
              <div
                class="h-full rounded-full transition-all duration-500"
                :class="seoScoreBarClass"
                :style="{ width: seoScoreValue + '%' }"
              ></div>
            </div>
          </div>

          <!-- SEO Checklist -->
          <div class="mb-4 space-y-2">
            <div
              v-for="check in seoChecklist"
              :key="check.label"
              class="flex items-center gap-2 text-xs"
            >
              <i
                :class="[
                  'pi text-xs',
                  check.passed ? 'pi-check-circle text-emerald-500' : 'pi-circle text-slate-300',
                ]"
              ></i>
              <span :class="check.passed ? 'text-slate-600' : 'text-slate-400'">
                {{ check.label }}
              </span>
            </div>
          </div>

          <hr class="border-slate-100 mb-4" />

          <div class="space-y-4">
            <!-- Focus Keyword -->
            <div>
              <label class="block text-xs font-medium text-slate-500 mb-1.5">Focus Keyword</label>
              <input
                v-model="form.focusKeyword"
                type="text"
                placeholder="Kata kunci utama..."
                class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
              />
            </div>

            <!-- Meta Title -->
            <div>
              <label class="block text-xs font-medium text-slate-500 mb-1.5">
                Meta Title
                <span class="ml-1" :class="metaTitleLengthClass">
                  ({{ (form.metaTitle || '').length }}/70)
                </span>
              </label>
              <input
                v-model="form.metaTitle"
                type="text"
                maxlength="70"
                placeholder="Judul untuk mesin pencari..."
                class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
              />
              <!-- Google Preview -->
              <div class="mt-2 rounded-lg border border-slate-100 bg-slate-50 p-3">
                <p class="text-xs text-slate-400 mb-1">Preview Google</p>
                <p class="text-sm font-medium text-blue-700 truncate">
                  {{ form.metaTitle || form.title || 'Judul Artikel' }}
                </p>
                <p class="text-xs text-emerald-700 truncate">
                  satuundangan.id/blog/{{ form.slug || 'url-slug' }}
                </p>
                <p class="text-xs text-slate-500 line-clamp-2 mt-0.5">
                  {{
                    form.metaDescription ||
                    form.excerpt ||
                    'Deskripsi artikel akan muncul di sini...'
                  }}
                </p>
              </div>
            </div>

            <!-- Meta Description -->
            <div>
              <label class="block text-xs font-medium text-slate-500 mb-1.5">
                Meta Description
                <span class="ml-1" :class="metaDescLengthClass">
                  ({{ (form.metaDescription || '').length }}/160)
                </span>
              </label>
              <textarea
                v-model="form.metaDescription"
                rows="3"
                maxlength="160"
                placeholder="Deskripsi untuk mesin pencari..."
                class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400 resize-none"
              ></textarea>
            </div>

            <!-- OG Image -->
            <div>
              <label class="block text-xs font-medium text-slate-500 mb-1.5">OG Image URL</label>
              <input
                v-model="form.ogImage"
                type="text"
                placeholder="URL gambar untuk social media sharing..."
                class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
              />
              <p class="mt-1 text-xs text-slate-400">Ukuran rekomendasi: 1200x630px</p>
            </div>

            <!-- Canonical URL -->
            <div>
              <label class="block text-xs font-medium text-slate-500 mb-1.5">Canonical URL</label>
              <input
                v-model="form.canonicalUrl"
                type="text"
                placeholder="https://satuundangan.id/blog/..."
                class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
              />
            </div>
          </div>
        </div>

        <!-- Revision history -->
        <div v-if="isEditing" class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 class="text-sm font-bold text-slate-800 mb-1 flex items-center gap-2">
            <i class="pi pi-history text-slate-500"></i>
            Riwayat versi
          </h3>
          <p class="mb-3 text-xs text-slate-400">
            Menyimpan {{ retainedLimit }} versi terakhir; versi lebih lama otomatis terhapus.
          </p>
          <p v-if="revisionsError" class="text-xs text-rose-600">{{ revisionsError }}</p>
          <p v-else-if="!revisions.length" class="text-xs text-slate-400">Belum ada versi tersimpan.</p>
          <ul v-else class="space-y-2">
            <li
              v-for="revision in revisions"
              :key="revision.id"
              class="flex items-center justify-between gap-2 rounded-lg border border-slate-100 p-2 text-xs"
            >
              <span class="min-w-0">
                <span class="block truncate font-medium text-slate-700">{{ revision.title }}</span>
                <span class="text-slate-400">
                  {{ formatDateTime(revision.savedAt) }}<template v-if="revision.reason"> · {{ revision.reason }}</template>
                </span>
              </span>
              <button
                type="button"
                class="shrink-0 rounded-lg border border-slate-200 px-2 py-1 text-slate-600 hover:bg-slate-50"
                @click="restoreRevision(revision)"
              >
                Pulihkan
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div
      v-if="previewOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      @keydown.esc="closePreview"
    >
      <div role="dialog" aria-modal="true" aria-labelledby="preview-title" class="flex h-[85vh] w-full max-w-3xl flex-col rounded-2xl bg-white shadow-xl">
        <div class="flex items-center justify-between border-b border-slate-200 px-5 py-3">
          <h2 id="preview-title" class="text-sm font-bold">Pratinjau artikel</h2>
          <button ref="previewClose" type="button" class="rounded-lg border border-slate-200 px-3 py-1 text-xs" @click="closePreview">Tutup</button>
        </div>
        <iframe title="Pratinjau artikel" sandbox="" :srcdoc="previewDoc" class="h-full w-full flex-1 rounded-b-2xl"></iframe>
      </div>
    </div>
  </AdminShell>
</template>

<script setup>
import { ref, computed, watch, nextTick, reactive, onBeforeUnmount, onMounted } from 'vue'
import { useRoute, useRouter, onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router'
import AdminShell from '@/components/admin/AdminShell.vue'
import { fetchAdminArticle, createAdminArticle, updateAdminArticle } from '@/api/admin.js'
import {
  fetchArticleRevisions,
  restoreArticleRevision,
  checkArticleLinks,
} from '@/api/articleEditorial.js'
import { useAuthStore } from '@/stores/auth.js'
import {
  saveArticleDraft,
  readArticleDraft,
  clearArticleDraft,
  toWibDateTimeInput,
  fromWibDateTimeInput,
} from '@/utils/articleDrafts.js'
import Swal from 'sweetalert2'
import slugify from 'slugify'
import { getArticleSeoChecklist, getArticleSeoScore } from '@/utils/articleSeo.js'

// Tiptap
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import CharacterCount from '@tiptap/extension-character-count'
import Underline from '@tiptap/extension-underline'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const isEditing = computed(() => !!route.params.id)
const saving = ref(false)
const slugManuallyEdited = ref(false)

const form = ref({
  title: '',
  slug: '',
  content: '',
  excerpt: '',
  coverImage: '',
  status: 'draft',
  metaTitle: '',
  metaDescription: '',
  focusKeyword: '',
  ogImage: '',
  canonicalUrl: '',
  reviewNotes: '',
  generatedByAi: false,
})

// Editorial + local draft state
const editVersion = ref(null)
const scheduleInput = ref('')
const sourceUrlsText = ref('')
const editorialReviewed = ref(false)
const localDraft = ref(null)
const draftError = ref('')
const draftSavedAt = ref('')
const isDirty = ref(false)
const revisions = ref([])
const retainedLimit = ref(10)
const revisionsError = ref('')
const AUTOSAVE_DELAY_MS = 800
let baseline = ''
let autosaveTimer = null

const parseSourceUrls = () =>
  sourceUrlsText.value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)

const safeScheduleIso = () => {
  try {
    return fromWibDateTimeInput(scheduleInput.value)
  } catch {
    return null
  }
}

const currentData = () => ({
  ...form.value,
  sourceUrls: parseSourceUrls(),
  scheduledPublishAt: safeScheduleIso(),
})

const snapshot = () => JSON.stringify([currentData(), editorialReviewed.value])

const formatDateTime = (value) => {
  const millis = Date.parse(value)
  if (!Number.isFinite(millis)) return '-'
  return new Date(millis).toLocaleString('id-ID', {
    timeZone: 'Asia/Jakarta',
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

const draftServerChanged = computed(
  () =>
    !!localDraft.value &&
    localDraft.value.serverVersion != null &&
    localDraft.value.serverVersion !== editVersion.value,
)

const draftStatusText = computed(() => {
  if (draftSavedAt.value) return `Tersimpan di perangkat pukul ${draftSavedAt.value}`
  if (isDirty.value) return 'Perubahan belum tersimpan ke server.'
  return 'Semua perubahan sudah tersimpan.'
})
const draftStatusClass = computed(() =>
  isDirty.value && !draftSavedAt.value ? 'text-amber-600' : 'text-slate-400',
)

const persistLocalDraft = () => {
  clearTimeout(autosaveTimer)
  autosaveTimer = null
  if (!isDirty.value || localDraft.value) return
  const result = saveArticleDraft(localStorage, {
    userId: auth.user?.id,
    articleId: route.params.id,
    serverVersion: editVersion.value,
    data: { ...currentData(), content: editor.value?.getHTML() ?? form.value.content },
  })
  draftError.value = result.ok ? '' : result.error
  draftSavedAt.value = result.ok
    ? new Date().toLocaleTimeString('id-ID', { timeZone: 'Asia/Jakarta', hour: '2-digit', minute: '2-digit' })
    : ''
}

const markBaseline = () => {
  baseline = snapshot()
  isDirty.value = false
  draftSavedAt.value = ''
}

watch(
  [form, sourceUrlsText, scheduleInput, editorialReviewed],
  () => {
    isDirty.value = snapshot() !== baseline
    if (!isDirty.value) return
    draftSavedAt.value = ''
    clearTimeout(autosaveTimer)
    autosaveTimer = setTimeout(persistLocalDraft, AUTOSAVE_DELAY_MS)
  },
  { deep: true },
)

// Tiptap Editor
const editor = useEditor({
  extensions: [
    StarterKit.configure({
      heading: { levels: [2, 3, 4] },
    }),
    Link.configure({
      openOnClick: false,
      HTMLAttributes: { class: 'text-blue-600 underline' },
    }),
    Image.configure({
      HTMLAttributes: { class: 'rounded-lg max-w-full' },
    }),
    Placeholder.configure({
      placeholder: 'Mulai menulis artikel Anda di sini...',
    }),
    CharacterCount,
    Underline,
  ],
  content: '',
  editorProps: {
    attributes: {
      class: 'outline-none min-h-[400px]',
    },
  },
  onUpdate: ({ editor: ed }) => {
    form.value.content = ed.getHTML()
  },
})

// Toolbar configuration
const toolbarButtons = computed(() => {
  if (!editor.value) return []
  return [
    {
      action: 'bold',
      icon: 'pi-bold',
      title: 'Bold',
      handler: () => editor.value.chain().focus().toggleBold().run(),
      isActive: () => editor.value.isActive('bold'),
    },
    {
      action: 'italic',
      icon: 'pi-italic',
      title: 'Italic',
      handler: () => editor.value.chain().focus().toggleItalic().run(),
      isActive: () => editor.value.isActive('italic'),
    },
    {
      action: 'underline',
      icon: 'pi-underline',
      title: 'Underline',
      handler: () => editor.value.chain().focus().toggleUnderline().run(),
      isActive: () => editor.value.isActive('underline'),
    },
    {
      action: 'strike',
      icon: 'pi-minus',
      title: 'Strikethrough',
      handler: () => editor.value.chain().focus().toggleStrike().run(),
      isActive: () => editor.value.isActive('strike'),
    },
    {
      action: 'bulletList',
      icon: 'pi-list',
      title: 'Bullet List',
      handler: () => editor.value.chain().focus().toggleBulletList().run(),
      isActive: () => editor.value.isActive('bulletList'),
    },
    {
      action: 'orderedList',
      icon: 'pi-sort-numeric-up',
      title: 'Ordered List',
      handler: () => editor.value.chain().focus().toggleOrderedList().run(),
      isActive: () => editor.value.isActive('orderedList'),
    },
    {
      action: 'blockquote',
      icon: 'pi-comment',
      title: 'Blockquote',
      handler: () => editor.value.chain().focus().toggleBlockquote().run(),
      isActive: () => editor.value.isActive('blockquote'),
    },
    {
      action: 'codeBlock',
      icon: 'pi-code',
      title: 'Code Block',
      handler: () => editor.value.chain().focus().toggleCodeBlock().run(),
      isActive: () => editor.value.isActive('codeBlock'),
    },
    {
      action: 'horizontalRule',
      icon: 'pi-minus',
      title: 'Horizontal Rule',
      handler: () => editor.value.chain().focus().setHorizontalRule().run(),
      isActive: () => false,
    },
    {
      action: 'undo',
      icon: 'pi-undo',
      title: 'Undo',
      handler: () => editor.value.chain().focus().undo().run(),
      isActive: () => false,
    },
    {
      action: 'redo',
      icon: 'pi-refresh',
      title: 'Redo',
      handler: () => editor.value.chain().focus().redo().run(),
      isActive: () => false,
    },
  ]
})

const headingButtons = [{ level: 2 }, { level: 3 }, { level: 4 }]

// Auto-slug from title
const onTitleChange = () => {
  if (!slugManuallyEdited.value) {
    form.value.slug = slugify(form.value.title, { lower: true, strict: true })
  }
}

// Image insertion
const addImage = async () => {
  const { value: url } = await Swal.fire({
    title: 'Sisipkan Gambar',
    input: 'url',
    inputPlaceholder: 'Masukkan URL gambar...',
    showCancelButton: true,
    confirmButtonText: 'Sisipkan',
    cancelButtonText: 'Batal',
    confirmButtonColor: '#0f172a',
  })
  if (url) {
    editor.value.chain().focus().setImage({ src: url }).run()
  }
}

// Link insertion
const setLink = async () => {
  if (editor.value.isActive('link')) {
    editor.value.chain().focus().unsetLink().run()
    return
  }
  const { value: url } = await Swal.fire({
    title: 'Sisipkan Link',
    input: 'url',
    inputPlaceholder: 'https://...',
    showCancelButton: true,
    confirmButtonText: 'Sisipkan',
    cancelButtonText: 'Batal',
    confirmButtonColor: '#0f172a',
  })
  if (url) {
    editor.value.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }
}

// SEO Scoring
const seoChecklist = computed(() => getArticleSeoChecklist(form.value))
const seoScoreValue = computed(() => getArticleSeoScore(form.value))

const seoScoreBadgeClass = computed(() => {
  if (seoScoreValue.value >= 80) return 'bg-emerald-50 text-emerald-700'
  if (seoScoreValue.value >= 40) return 'bg-amber-50 text-amber-700'
  return 'bg-rose-50 text-rose-700'
})

const seoScoreBarClass = computed(() => {
  if (seoScoreValue.value >= 80) return 'bg-emerald-500'
  if (seoScoreValue.value >= 40) return 'bg-amber-500'
  return 'bg-rose-500'
})

const metaTitleLengthClass = computed(() => {
  const len = (form.value.metaTitle || '').length
  if (len === 0) return 'text-slate-400'
  if (len >= 30 && len <= 70) return 'text-emerald-500'
  return 'text-amber-500'
})

const metaDescLengthClass = computed(() => {
  const len = (form.value.metaDescription || '').length
  if (len === 0) return 'text-slate-400'
  if (len >= 80 && len <= 160) return 'text-emerald-500'
  return 'text-amber-500'
})

// Keyword density
const keywordDensity = computed(() => {
  if (!form.value.focusKeyword || !editor.value) return 0
  const text = (form.value.content || '').toLowerCase()
  const keyword = form.value.focusKeyword.toLowerCase()
  const totalWords = editor.value.storage.characterCount.words()
  if (totalWords === 0) return 0
  const matches = text.split(keyword).length - 1
  return ((matches / totalWords) * 100).toFixed(1)
})

const keywordDensityClass = computed(() => {
  const d = parseFloat(keywordDensity.value)
  if (d >= 1 && d <= 3) return 'text-emerald-500'
  if (d > 0) return 'text-amber-500'
  return 'text-slate-400'
})

// Save article
const saveArticle = async (status) => {
  if (!form.value.title.trim()) {
    Swal.fire('Judul Diperlukan', 'Silakan masukkan judul artikel.', 'warning')
    return
  }

  let scheduledPublishAt = null
  if (status === 'scheduled') {
    try {
      scheduledPublishAt = fromWibDateTimeInput(scheduleInput.value)
    } catch (e) {
      Swal.fire('Jadwal Tidak Valid', e.message, 'warning')
      return
    }
    if (!scheduledPublishAt || Date.parse(scheduledPublishAt) <= Date.now()) {
      Swal.fire('Jadwal Tidak Valid', 'Pilih tanggal dan jam di masa depan (WIB).', 'warning')
      return
    }
  }

  saving.value = true
  try {
    const payload = {
      ...form.value,
      status,
      content: editor.value?.getHTML() || '',
      sourceUrls: parseSourceUrls(),
      editorialReviewed: editorialReviewed.value,
      scheduledPublishAt,
    }
    if (isEditing.value) payload.expectedVersion = editVersion.value

    if (isEditing.value) {
      await updateAdminArticle(route.params.id, payload)
    } else {
      await createAdminArticle(payload)
    }

    clearArticleDraft(localStorage, auth.user?.id, route.params.id)
    clearTimeout(autosaveTimer)
    isDirty.value = false

    await Swal.fire({
      title:
        status === 'published'
          ? 'Artikel Dipublikasikan!'
          : status === 'scheduled'
            ? 'Artikel Dijadwalkan!'
            : 'Draft Tersimpan!',
      icon: 'success',
      timer: 1500,
      showConfirmButton: false,
    })

    router.push({ name: 'admin-articles' })
  } catch (e) {
    // Server rejected the save (e.g. version conflict): keep the work on this device.
    persistLocalDraft()
    Swal.fire('Gagal Menyimpan', e.message, 'error')
  } finally {
    saving.value = false
  }
}

const applyArticle = (article) => {
  form.value = {
    title: article.title || '',
    slug: article.slug || '',
    content: article.content || '',
    excerpt: article.excerpt || '',
    coverImage: article.coverImage || '',
    status: article.status || 'draft',
    metaTitle: article.metaTitle || '',
    metaDescription: article.metaDescription || '',
    focusKeyword: article.focusKeyword || '',
    ogImage: article.ogImage || '',
    canonicalUrl: article.canonicalUrl || '',
    reviewNotes: article.reviewNotes || '',
    generatedByAi: Boolean(article.generatedByAi),
  }
  editVersion.value = article.editVersion ?? null
  scheduleInput.value = toWibDateTimeInput(article.scheduledPublishAt)
  sourceUrlsText.value = Array.isArray(article.sourceUrls) ? article.sourceUrls.join('\n') : ''
  editorialReviewed.value = Boolean(article.reviewedAt)
  slugManuallyEdited.value = true
  editor.value?.commands.setContent(article.content || '')
}

const loadRevisions = async () => {
  if (!isEditing.value) return
  try {
    const result = await fetchArticleRevisions(route.params.id)
    revisions.value = result?.items || []
    retainedLimit.value = result?.retainedLimit || 10
    revisionsError.value = ''
  } catch (e) {
    revisionsError.value = 'Riwayat versi belum dapat dimuat: ' + e.message
  }
}

const restoreRevision = async (revision) => {
  const { isConfirmed } = await Swal.fire({
    title: 'Pulihkan versi ini?',
    text: 'Isi artikel diganti dengan versi tersebut sebagai draft baru. Versi saat ini tetap tersimpan di riwayat.',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Pulihkan',
    cancelButtonText: 'Batal',
  })
  if (!isConfirmed) return
  try {
    const restored = await restoreArticleRevision(route.params.id, revision.id, {
      expectedVersion: editVersion.value,
    })
    applyArticle(restored)
    clearArticleDraft(localStorage, auth.user?.id, route.params.id)
    markBaseline()
    await loadRevisions()
  } catch (e) {
    Swal.fire('Gagal Memulihkan', e.message, 'error')
  }
}

const restoreLocalDraft = () => {
  const data = localDraft.value?.data
  if (!data) return
  const { sourceUrls, scheduledPublishAt, ...fields } = data
  form.value = { ...form.value, ...fields }
  if (sourceUrls) sourceUrlsText.value = sourceUrls.join('\n')
  if (scheduledPublishAt !== undefined) scheduleInput.value = toWibDateTimeInput(scheduledPublishAt)
  if (fields.content !== undefined) editor.value?.commands.setContent(fields.content || '')
  localDraft.value = null
}

const discardLocalDraft = () => {
  clearArticleDraft(localStorage, auth.user?.id, route.params.id)
  localDraft.value = null
}

const confirmLeave = async () => {
  if (!isDirty.value) return true
  persistLocalDraft()
  const { isConfirmed } = await Swal.fire({
    title: 'Keluar dari editor?',
    text: 'Perubahan belum disimpan ke server. Draft perangkat tetap tersimpan di browser ini.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Keluar',
    cancelButtonText: 'Tetap di editor',
  })
  return Boolean(isConfirmed)
}
onBeforeRouteLeave(confirmLeave)
onBeforeRouteUpdate(confirmLeave)

const warnBeforeUnload = (event) => {
  if (!isDirty.value) return
  event.preventDefault()
  event.returnValue = ''
}

// Preview: rendered in a script-less sandboxed frame so article HTML can never run code in the admin
const previewOpen = ref(false)
const previewTrigger = ref(null)
const previewClose = ref(null)
const escapeHtml = (value) =>
  String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char])
const previewDoc = computed(() => {
  const body = editor.value?.getHTML() ?? form.value.content ?? ''
  const cover = form.value.coverImage && /^https?:\/\//.test(form.value.coverImage) ? `<img src="${escapeHtml(form.value.coverImage)}" alt="" style="width:100%;border-radius:12px;margin-bottom:16px" />` : ''
  return `<!doctype html><html lang="id"><head><meta charset="utf-8"><style>body{font-family:system-ui,sans-serif;max-width:680px;margin:24px auto;padding:0 16px;line-height:1.7;color:#1e293b}img{max-width:100%;height:auto}h1{line-height:1.25}blockquote{border-left:4px solid #e2e8f0;margin:0;padding-left:12px;color:#64748b}pre{background:#0f172a;color:#e2e8f0;padding:12px;border-radius:8px;overflow:auto}a{color:#2563eb}</style></head><body>${cover}<h1>${escapeHtml(form.value.title || 'Judul artikel')}</h1><p style="color:#64748b">${escapeHtml(form.value.excerpt)}</p>${body}</body></html>`
})
async function openPreview() {
  previewOpen.value = true
  await nextTick()
  previewClose.value?.focus()
}
async function closePreview() {
  previewOpen.value = false
  await nextTick()
  previewTrigger.value?.focus()
}

// Link and image check on the saved server version
const linkCheck = reactive({ loading: false, error: '', result: null })
async function runLinkCheck() {
  linkCheck.loading = true
  linkCheck.error = ''
  try {
    linkCheck.result = await checkArticleLinks(route.params.id)
  } catch (e) {
    linkCheck.result = null
    linkCheck.error = e.message || 'Pengecekan tautan gagal dijalankan.'
  } finally {
    linkCheck.loading = false
  }
}

// Load existing article for editing
onMounted(async () => {
  window.addEventListener('beforeunload', warnBeforeUnload)
  if (route.params.id) {
    try {
      applyArticle(await fetchAdminArticle(route.params.id))
    } catch (e) {
      Swal.fire('Error', 'Gagal memuat artikel: ' + e.message, 'error')
      router.push({ name: 'admin-articles' })
      return
    }
    loadRevisions()
  }
  markBaseline()
  const { draft, error } = readArticleDraft(localStorage, auth.user?.id, route.params.id)
  localDraft.value = draft
  draftError.value = error
})

onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', warnBeforeUnload)
  clearTimeout(autosaveTimer)
  editor.value?.destroy()
})
</script>

<style>
/* Tiptap editor styles */
.tiptap {
  outline: none;
}
.tiptap p {
  margin-bottom: 0.75rem;
}
.tiptap h2 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
  color: #1e293b;
}
.tiptap h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-top: 1.25rem;
  margin-bottom: 0.5rem;
  color: #1e293b;
}
.tiptap h4 {
  font-size: 1.1rem;
  font-weight: 600;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
  color: #334155;
}
.tiptap ul,
.tiptap ol {
  padding-left: 1.5rem;
  margin-bottom: 0.75rem;
}
.tiptap ul {
  list-style-type: disc;
}
.tiptap ol {
  list-style-type: decimal;
}
.tiptap li {
  margin-bottom: 0.25rem;
}
.tiptap blockquote {
  border-left: 4px solid #e2e8f0;
  padding-left: 1rem;
  color: #64748b;
  font-style: italic;
  margin: 1rem 0;
}
.tiptap pre {
  background: #1e293b;
  color: #e2e8f0;
  border-radius: 0.5rem;
  padding: 1rem;
  margin: 1rem 0;
  overflow-x: auto;
  font-family: monospace;
  font-size: 0.875rem;
}
.tiptap code {
  background: #f1f5f9;
  border-radius: 0.25rem;
  padding: 0.1rem 0.3rem;
  font-family: monospace;
  font-size: 0.875em;
}
.tiptap pre code {
  background: none;
  padding: 0;
}
.tiptap hr {
  border: none;
  border-top: 2px solid #e2e8f0;
  margin: 1.5rem 0;
}
.tiptap img {
  max-width: 100%;
  height: auto;
  border-radius: 0.5rem;
  margin: 1rem 0;
}
.tiptap a {
  color: #2563eb;
  text-decoration: underline;
}
.tiptap p.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  float: left;
  color: #94a3b8;
  pointer-events: none;
  height: 0;
}
</style>
