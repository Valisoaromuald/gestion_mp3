import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import "./assets/main.css"
// Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css'
// Bootstrap JS (pour les composants interactifs : modals, dropdowns, etc.)
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'bootstrap-icons/font/bootstrap-icons.css'
import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'
const app = createApp(App)
const pinia = createPinia()
const persistedState= createPersistedState()
pinia.use(persistedState)
app.use(router)
app.use(pinia)
app.mount('#app')

