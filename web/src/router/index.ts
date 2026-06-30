
import { createRouter, createWebHistory } from 'vue-router'

const routes  = [
  {
    path:'/mp3',
    children :[
      {
        path: 'form',
        component: ()=> import("@/views/mp3/Mp3FormView.vue")
      }
    ]
  }
]
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
