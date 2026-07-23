import { useAuthStore } from '@/stores/authStore'
import { createRouter, createWebHistory } from 'vue-router'
import type { RouteLocationNormalized, NavigationGuardNext } from "vue-router"

const routes = [
  {
    path: "/",
    name:"login", 
    component: () => import("@/views/login/LoginView.vue")
  },
  {
    path: "/",
    component: () => import("@/layouts/GlobalLayout.vue"),
    children: [
      {
        path: 'mp3',
        component: () => import("@/views/mp3/Mp3View.vue"),
        meta: { requiresAuth: true }
      },
      {
        path: 'playlist',
        meta: { requiresAuth: true },
        children: [
          {
            path: 'playlist-generation',
            component: () => import("@/views/playlist/PlaylistGenerationView.vue")
          },
          {
            path: '',
            name: 'playlists',
            component: () => import('@/components/playlist/PlaylistListing.vue')
          },
          {
            path: ':id/lecture',
            name: 'playlist-player',
            component: () => import('@/views/playlist/PlaylistPlayerView.vue'),
            props: true
          }
        ]
      }
    ]
  }
]
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})
router.beforeEach((to:RouteLocationNormalized,from:RouteLocationNormalized,next:NavigationGuardNext)=>{
  const authStore = useAuthStore()
  if(to.meta.requiresAuth){
    if(authStore.isAuthenticated){
      next();
    }
    else{
      next("/")
    }
  }
  else{
    next()
  }
})
export default router
