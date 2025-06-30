import CreateDesign from '@/views/CreateDesign.vue'
import CreateForm from '@/views/CreateForm.vue'
import HomeView from '@/views/HomeView.vue'
import Invitation from '@/views/InvitationView.vue'
import PreviewInvitation from '@/views/PreviewInvitation.vue'
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
    {
      path: '/create',
      name: 'create',
      component: CreateDesign,
    },
    {
      path: '/create/form',
      name: 'create.form',
      component: CreateForm,
    },
    {
      path: '/preview',
      name: 'preview',
      component: PreviewInvitation,
    },
  ],
})

export default router
