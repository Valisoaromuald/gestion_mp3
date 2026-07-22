import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import "./assets/main.css"
// Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css'
// Bootstrap JS (pour les composants interactifs : modals, dropdowns, etc.)
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'bootstrap-icons/font/bootstrap-icons.css'
const app = createApp(App)

app.use(router)
app.mount('#app')
