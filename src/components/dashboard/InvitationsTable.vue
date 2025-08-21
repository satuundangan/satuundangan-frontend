<template>
  <div class="bg-white rounded-xl shadow overflow-hidden">
    <table class="w-full text-left">
      <thead class="bg-gray-50">
        <tr>
          <th class="px-6 py-3">Invitation</th>
          <th class="px-6 py-3">Status</th>
          <th class="px-6 py-3">Event Date</th>
          <th class="px-6 py-3">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="invite in invitations" :key="invite.id" class="border-t">
          <td class="px-6 py-4">{{ invite.title }}</td>
          <td class="px-6 py-4">
            <span :class="invite.status === 'Active'
              ? 'text-green-600'
              : invite.status === 'Draft'
                ? 'text-gray-600'
                : 'text-red-600'">
              {{ invite.status }}
            </span>
          </td>
          <td class="px-6 py-4">{{ invite.date }}</td>
          <td class="px-6 py-4 space-x-2">
            <button class="text-blue-600">Edit</button>
            <button class="text-gray-600">Preview</button>
            <button class="text-red-600">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
defineProps({
  invitations: { type: Array, required: true },
});
</script>
