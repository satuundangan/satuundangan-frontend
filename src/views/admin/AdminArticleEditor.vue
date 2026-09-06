<template>
  <AdminShell
    :title="isEditing ? 'Edit Artikel' : 'Tulis Artikel Baru'"
    :description="isEditing ? 'Perbarui konten dan pengaturan SEO' : 'Buat artikel baru dengan optimasi SEO'"
  >
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main Content Area -->
      <div class="lg:col-span-2 space-y-6">
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
          <div v-if="editor" class="flex flex-wrap items-center gap-1 border-b border-slate-200 bg-slate-50/50 px-4 py-2">
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
            <editor-content :editor="editor" class="min-h-[400px] px-6 py-4 focus-within:outline-none" />
          </div>

          <!-- Character Count -->
          <div v-if="editor" class="flex items-center justify-between border-t border-slate-100 px-6 py-2 text-xs text-slate-400">
            <span>{{ editor.storage.characterCount.characters() }} karakter · {{ editor.storage.characterCount.words() }} kata</span>
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
          <p class="mt-1 text-xs text-slate-400 text-right">{{ (form.excerpt || '').length }}/300</p>
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
              </select>
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
          <div
            v-if="form.coverImage"
            class="relative rounded-xl overflow-hidden mb-3"
          >
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
              SEO Settings
            </h3>
            <span
              class="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold"
              :class="seoScoreBadgeClass"
            >
              {{ seoScoreValue }}%
            </span>
          </div>

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
                  {{ form.metaDescription || form.excerpt || 'Deskripsi artikel akan muncul di sini...' }}
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
      </div>
    </div>
  </AdminShell>
</template>

<script setup>
import { ref, computed, onBeforeUnmount, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AdminShell from '@/components/admin/AdminShell.vue'
import {
  fetchAdminArticle,
  createAdminArticle,
  updateAdminArticle,
} from '@/api/admin.js'
import Swal from 'sweetalert2'
import slugify from 'slugify'

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
})

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
const seoChecklist = computed(() => [
  { label: 'Focus keyword diisi', passed: !!form.value.focusKeyword },
  { label: 'Meta title diisi (50-70 karakter)', passed: (form.value.metaTitle || '').length >= 30 && (form.value.metaTitle || '').length <= 70 },
  { label: 'Meta description diisi (120-160 karakter)', passed: (form.value.metaDescription || '').length >= 80 && (form.value.metaDescription || '').length <= 160 },
  { label: 'Excerpt / ringkasan diisi', passed: (form.value.excerpt || '').length > 0 },
  { label: 'Cover image atau OG image diisi', passed: !!(form.value.coverImage || form.value.ogImage) },
  { label: 'Keyword ada di meta title', passed: !!form.value.focusKeyword && (form.value.metaTitle || '').toLowerCase().includes(form.value.focusKeyword.toLowerCase()) },
  { label: 'Keyword ada di meta description', passed: !!form.value.focusKeyword && (form.value.metaDescription || '').toLowerCase().includes(form.value.focusKeyword.toLowerCase()) },
  { label: 'Slug mengandung keyword', passed: !!form.value.focusKeyword && (form.value.slug || '').toLowerCase().includes(slugify(form.value.focusKeyword, { lower: true, strict: true })) },
  { label: 'Konten minimal 300 kata', passed: editor.value && editor.value.storage.characterCount.words() >= 300 },
  { label: 'Keyword ada di konten', passed: !!form.value.focusKeyword && (form.value.content || '').toLowerCase().includes(form.value.focusKeyword.toLowerCase()) },
])

const seoScoreValue = computed(() => {
  const passed = seoChecklist.value.filter((c) => c.passed).length
  return Math.round((passed / seoChecklist.value.length) * 100)
})

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

  saving.value = true
  try {
    const payload = {
      ...form.value,
      status,
      content: editor.value?.getHTML() || '',
    }

    if (isEditing.value) {
      await updateAdminArticle(route.params.id, payload)
    } else {
      await createAdminArticle(payload)
    }

    await Swal.fire({
      title: status === 'published' ? 'Artikel Dipublikasikan!' : 'Draft Tersimpan!',
      icon: 'success',
      timer: 1500,
      showConfirmButton: false,
    })

    router.push({ name: 'admin-articles' })
  } catch (e) {
    Swal.fire('Gagal Menyimpan', e.message, 'error')
  } finally {
    saving.value = false
  }
}

// Load existing article for editing
onMounted(async () => {
  if (route.params.id) {
    try {
      const article = await fetchAdminArticle(route.params.id)
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
      }
      slugManuallyEdited.value = true
      if (editor.value) {
        editor.value.commands.setContent(article.content || '')
      }
    } catch (e) {
      Swal.fire('Error', 'Gagal memuat artikel: ' + e.message, 'error')
      router.push({ name: 'admin-articles' })
    }
  }
})

onBeforeUnmount(() => {
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
