import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path:"/",
    component : ()=> import("@/views/login/LoginView.vue")
  },
  {
    path: '/mp3',
    component: () => import("@/views/mp3/Mp3View.vue")
  },
  {
    path: '/playlist',
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
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
