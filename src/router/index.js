import HomeView from '@/views/HomeView.vue'
import Invitation from '@/views/InvitationView.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/invitation',
      name: 'invitation',
      component: Invitation,
    },
  ],
})

export default router
