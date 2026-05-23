<template>
  <div>
    <!-- Desktop Table -->
    <div class="hidden md:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <table class="w-full text-left border-collapse">
        <thead class="bg-gray-50 text-gray-500 uppercase text-xs font-bold tracking-wider">
          <tr>
            <th class="px-6 py-4">Invitation</th>
            <th class="px-6 py-4">Slug</th>
            <th class="px-6 py-4">Status</th>
            <th class="px-6 py-4">Event Date</th>
            <th class="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-50">
          <tr v-for="invite in invitations" :key="invite.id" class="hover:bg-gray-50/50 transition-colors">
            <td class="px-6 py-4">
              <div class="font-bold text-dark">{{ invite.title }}</div>
              <div class="text-[10px] text-gray-400 uppercase tracking-tight">{{ invite.templateDesign?.name || 'Default Template' }}</div>
            </td>
            <td class="px-6 py-4 text-xs text-mocha font-medium">/{{ invite.slug }}</td>
            <td class="px-6 py-4">
              <span :class="getStatusClass(invite)" class="px-2 py-1 rounded-md text-[10px] font-bold border uppercase">
                {{ invite.isPublished ? 'Published' : 'Draft' }}
              </span>
            </td>
            <td class="px-6 py-4 text-xs text-gray-600">
              {{ formatDate(invite.akadLocation?.dateTime || invite.dateTime) }}
            </td>
            <td class="px-6 py-4 text-right flex justify-end gap-2">
              <!-- Action: Publish -->
              <router-link v-if="!invite.isPublished" :to="`/checkout?slug=${invite.slug}`" class="flex items-center gap-1.5 px-3 py-1.5 bg-mocha text-white rounded-lg text-[10px] font-bold shadow-lg shadow-mocha/20 hover:bg-dark transition-all" title="Publish Undangan">
                <i class="fa-solid fa-rocket text-[9px]"></i> Publish
              </router-link>

              <button @click="$emit('preview', invite.slug)" class="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition" title="Preview">
                <i class="fa-solid fa-eye"></i>
              </button>
              <button @click="$emit('edit', invite.id)" class="p-2 text-amber-500 hover:bg-amber-50 rounded-lg transition" title="Edit">
                <i class="fa-solid fa-pen-to-square"></i>
              </button>
              <button @click="$emit('delete', invite.id)" class="p-2 text-red-400 hover:bg-red-50 rounded-lg transition" title="Delete">
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </td>
          </tr>
          <tr v-if="invitations.length === 0">
            <td colspan="5" class="px-6 py-10 text-center text-gray-400 italic">No invitations found.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Mobile Card Layout -->
    <div class="md:hidden space-y-4">
      <div v-for="invite in invitations" :key="invite.id" class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 space-y-4">
        <div class="flex justify-between items-start">
           <div class="min-w-0 flex-1">
              <div class="font-bold text-dark truncate">{{ invite.title }}</div>
              <div class="text-[10px] text-gray-400 uppercase tracking-tight">{{ invite.templateDesign?.name || 'Default Template' }}</div>
           </div>
           <span :class="getStatusClass(invite)" class="px-2 py-0.5 rounded-md text-[9px] font-bold border uppercase whitespace-nowrap">
              {{ invite.isPublished ? 'Published' : 'Draft' }}
           </span>
        </div>

        <div class="grid grid-cols-2 gap-4 py-3 border-y border-gray-50">
           <div>
              <div class="text-[10px] text-gray-400 uppercase font-bold mb-1">Slug</div>
              <div class="text-xs text-mocha font-medium truncate">/{{ invite.slug }}</div>
           </div>
           <div>
              <div class="text-[10px] text-gray-400 uppercase font-bold mb-1">Event Date</div>
              <div class="text-xs text-gray-600">
                {{ formatDate(invite.akadLocation?.dateTime || invite.dateTime) }}
              </div>
           </div>
        </div>

        <div class="flex items-center justify-between pt-1">
           <div class="flex gap-2 items-center">
              <router-link v-if="!invite.isPublished" :to="`/checkout?slug=${invite.slug}`" class="flex items-center gap-1.5 px-3 py-1.5 bg-mocha text-white rounded-lg text-[9px] font-bold shadow-lg shadow-mocha/20 active:scale-95 transition-all">
                <i class="fa-solid fa-rocket text-[8px]"></i> Publish
              </router-link>
              <button @click="$emit('preview', invite.slug)" class="w-9 h-9 flex items-center justify-center text-blue-500 bg-blue-50 rounded-lg transition" title="Preview">
                <i class="fa-solid fa-eye text-sm"></i>
              </button>
              <button @click="$emit('edit', invite.id)" class="w-9 h-9 flex items-center justify-center text-amber-500 bg-amber-50 rounded-lg transition" title="Edit">
                <i class="fa-solid fa-pen-to-square text-sm"></i>
              </button>
           </div>
           <button @click="$emit('delete', invite.id)" class="w-9 h-9 flex items-center justify-center text-red-400 bg-red-50 active:bg-red-100 rounded-lg transition" title="Delete">
              <i class="fa-solid fa-trash-can text-sm"></i>
           </button>
        </div>
      </div>
      
      <div v-if="invitations.length === 0" class="bg-white p-10 rounded-xl border border-dashed border-gray-200 text-center text-gray-400 italic">
         No invitations found.
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  invitations: { type: Array, required: true },
});

defineEmits(['edit', 'delete', 'preview']);

function getStatusClass(invite) {
  if (invite.isPublished) return 'bg-green-50 text-green-600 border-green-100';
  return 'bg-gray-100 text-gray-500 border-gray-200';
}

function formatDate(date) {
  if (!date) return '-';
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return '-';
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch (e) {
    return '-';
  }
}
</script>
