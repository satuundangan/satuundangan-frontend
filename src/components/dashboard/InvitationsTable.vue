<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
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
