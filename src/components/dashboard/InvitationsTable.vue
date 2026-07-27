<template>
  <div>
    <!-- Desktop Table -->
    <div class="hidden md:block bg-white rounded-2xl shadow-xs border border-slate-100 overflow-hidden">
      <table class="w-full text-left border-collapse">
        <thead class="bg-slate-50/80 text-slate-400 uppercase text-[10px] font-black tracking-wider border-b border-slate-100">
          <tr>
            <th class="px-6 py-4">Judul Undangan</th>
            <th class="px-6 py-4">Link Unique Slug</th>
            <th class="px-6 py-4">Status</th>
            <th class="px-6 py-4">Tanggal Acara</th>
            <th class="px-6 py-4 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 text-xs">
          <tr v-for="invite in invitations" :key="invite.id" class="hover:bg-slate-50/60 transition-colors">
            <td class="px-6 py-4">
              <div class="font-extrabold text-slate-900">{{ invite.title || 'Undangan Tanpa Judul' }}</div>
              <div class="text-[10px] text-slate-400 font-semibold uppercase tracking-tight mt-0.5">
                {{ invite.templateDesign?.name || 'Default Template' }}
              </div>
            </td>
            <td class="px-6 py-4">
              <div class="flex items-center gap-1.5 text-blue-600 font-bold">
                <span>satuundangan.com/{{ invite.slug }}</span>
                <button @click="copyLink(invite.slug)" class="p-1 text-slate-400 hover:text-blue-600 transition-colors" title="Salin Link">
                  <i class="fa-solid fa-copy text-xs"></i>
                </button>
              </div>
            </td>
            <td class="px-6 py-4">
              <span :class="getStatusClass(invite)" class="px-2.5 py-1 rounded-md text-[9px] font-black border uppercase">
                {{ invite.isPublished ? 'Published' : 'Draft' }}
              </span>
            </td>
            <td class="px-6 py-4 text-slate-600 font-medium">
              {{ formatDate(invite.akadLocation?.dateTime || invite.dateTime) }}
            </td>
            <td class="px-6 py-4 text-right flex justify-end items-center gap-2">
              <!-- Publish Button -->
              <router-link 
                v-if="!invite.isPublished" 
                :to="`/checkout?slug=${invite.slug}`" 
                class="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white rounded-xl text-[10px] font-extrabold shadow-sm hover:bg-slate-800 transition-all" 
                title="Publish Undangan Sekarang"
              >
                <i class="fa-solid fa-rocket text-[9px]"></i> Publish
              </router-link>

              <button @click="$emit('preview', invite.slug)" class="w-8 h-8 flex items-center justify-center text-blue-600 hover:bg-blue-50 rounded-xl transition-colors" title="Preview Live">
                <i class="fa-solid fa-eye"></i>
              </button>
              <button @click="$emit('edit', invite.id)" class="w-8 h-8 flex items-center justify-center text-amber-600 hover:bg-amber-50 rounded-xl transition-colors" title="Edit Studio">
                <i class="fa-solid fa-pen-to-square"></i>
              </button>
              <button @click="$emit('delete', invite.id)" class="w-8 h-8 flex items-center justify-center text-rose-500 hover:bg-rose-50 rounded-xl transition-colors" title="Hapus">
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </td>
          </tr>
          <tr v-if="invitations.length === 0">
            <td colspan="5" class="px-6 py-10 text-center text-slate-400 italic">Belum ada undangan.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Mobile Card Layout -->
    <div class="md:hidden space-y-3">
      <div v-for="invite in invitations" :key="invite.id" class="bg-white p-4 rounded-2xl shadow-xs border border-slate-100 space-y-3">
        <div class="flex justify-between items-start gap-2">
           <div class="min-w-0 flex-1">
              <div class="font-extrabold text-slate-900 text-sm truncate">{{ invite.title || 'Undangan Tanpa Judul' }}</div>
              <div class="text-[10px] text-slate-400 font-semibold uppercase tracking-tight">{{ invite.templateDesign?.name || 'Default Template' }}</div>
           </div>
           <span :class="getStatusClass(invite)" class="px-2 py-0.5 rounded-md text-[9px] font-black border uppercase shrink-0">
              {{ invite.isPublished ? 'Published' : 'Draft' }}
           </span>
        </div>

        <div class="grid grid-cols-2 gap-3 py-2.5 border-y border-slate-100 text-xs">
           <div>
              <div class="text-[9px] text-slate-400 uppercase font-black mb-0.5">Slug</div>
              <div class="text-blue-600 font-bold truncate">/{{ invite.slug }}</div>
           </div>
           <div>
              <div class="text-[9px] text-slate-400 uppercase font-black mb-0.5">Tanggal Acara</div>
              <div class="text-slate-700 font-medium">
                {{ formatDate(invite.akadLocation?.dateTime || invite.dateTime) }}
              </div>
           </div>
        </div>

        <div class="flex items-center justify-between pt-1">
           <div class="flex gap-2 items-center">
              <router-link v-if="!invite.isPublished" :to="`/checkout?slug=${invite.slug}`" class="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white rounded-xl text-[10px] font-extrabold shadow-sm active:scale-95 transition-all">
                <i class="fa-solid fa-rocket text-[9px]"></i> Publish
              </router-link>
              <button @click="$emit('preview', invite.slug)" class="w-9 h-9 flex items-center justify-center text-blue-600 bg-blue-50 rounded-xl transition-all" title="Preview">
                <i class="fa-solid fa-eye text-xs"></i>
              </button>
              <button @click="$emit('edit', invite.id)" class="w-9 h-9 flex items-center justify-center text-amber-600 bg-amber-50 rounded-xl transition-all" title="Edit">
                <i class="fa-solid fa-pen-to-square text-xs"></i>
              </button>
           </div>
           <button @click="$emit('delete', invite.id)" class="w-9 h-9 flex items-center justify-center text-rose-500 bg-rose-50 active:bg-rose-100 rounded-xl transition-all" title="Delete">
              <i class="fa-solid fa-trash-can text-xs"></i>
           </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useToast } from 'vue-toastification'

const toast = useToast()

defineProps({
  invitations: { type: Array, required: true },
})

defineEmits(['edit', 'delete', 'preview'])

function copyLink(slug) {
  const fullUrl = `${window.location.origin}/${slug}`
  navigator.clipboard.writeText(fullUrl)
  toast.success('Link undangan berhasil disalin!')
}

function getStatusClass(invite) {
  if (invite.isPublished) return 'bg-emerald-50 text-emerald-600 border-emerald-200'
  return 'bg-slate-100 text-slate-500 border-slate-200'
}

function formatDate(date) {
  if (!date) return '-'
  try {
    const d = new Date(date)
    if (isNaN(d.getTime())) return '-'
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
  } catch {
    return '-'
  }
}
</script>
