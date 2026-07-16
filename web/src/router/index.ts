
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/mp3',
    component: () => import("@/views/mp3/Mp3View.vue")
  }
]
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
