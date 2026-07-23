<template>
  <aside class="sidebar" :class="{ 'sidebar--collapsed': collapsed }">
    <!-- Header -->
    <div class="sidebar-header">
      <span class="sidebar-brand">
        <i class="bi bi-apple-music"></i>
        <span class="label">Melofy</span>
      </span>
      <button
        class="btn-toggle"
        type="button"
        @click="toggle"
        :aria-expanded="!collapsed"
        aria-label="Réduire ou agrandir le menu"
      >
        <i class="bi" :class="collapsed ? 'bi-chevron-right' : 'bi-chevron-left'"></i>
      </button>
    </div>

    <!-- Body -->
    <div class="sidebar-body">
      <div class="accordion accordion-flush" id="sidebarAccordion">

        <!-- ==== MP3 ==== -->
        <div class="accordion-item">
          <h2 class="accordion-header" id="headingMp3">
            <button
              class="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseMp3"
              aria-expanded="false"
              aria-controls="collapseMp3"
              :title="collapsed ? 'MP3' : ''"
            >
              <i class="bi bi-music-note-list me-2"></i>
              <span class="label">MP3</span>
            </button>
          </h2>
          <div
            id="collapseMp3"
            class="accordion-collapse collapse"
            aria-labelledby="headingMp3"
            data-bs-parent="#sidebarAccordion"
          >
            <div class="accordion-body p-0">
              <ul class="list-group list-group-flush">
                <li class="list-group-item">
                  <router-link
                    :to="{ path: '/mp3' }"
                    class="nav-link-item"
                    :title="collapsed ? 'Gérer les MP3' : ''"
                  >
                    <i class="bi bi-music-note-beamed me-2"></i>
                    <span class="label">Gérer les MP3</span>
                  </router-link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- ==== Playlist ==== -->
        <div class="accordion-item">
          <h2 class="accordion-header" id="headingPlaylist">
            <button
              class="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapsePlaylist"
              aria-expanded="false"
              aria-controls="collapsePlaylist"
              :title="collapsed ? 'Playlist' : ''"
            >
              <i class="bi bi-collection-play me-2"></i>
              <span class="label">Playlist</span>
            </button>
          </h2>
          <div
            id="collapsePlaylist"
            class="accordion-collapse collapse"
            aria-labelledby="headingPlaylist"
            data-bs-parent="#sidebarAccordion"
          >
            <div class="accordion-body p-0">
              <ul class="list-group list-group-flush">
                <li class="list-group-item">
                  <router-link
                    :to="{ name: 'playlists' }"
                    class="nav-link-item"
                    :title="collapsed ? 'Mes playlists' : ''"
                  >
                    <i class="bi bi-list-ul me-2"></i>
                    <span class="label">Mes playlists</span>
                  </router-link>
                </li>
                <li class="list-group-item">
                  <router-link
                    :to="{ path: '/playlist/playlist-generation' }"
                    class="nav-link-item"
                    :title="collapsed ? 'Génération de playlist' : ''"
                  >
                    <i class="bi bi-magic me-2"></i>
                    <span class="label">Génération de playlist</span>
                  </router-link>
                </li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- Footer : déconnexion -->
    <div class="sidebar-footer">
      <button
        type="button"
        class="btn-logout"
        @click="handleLogout"
        :title="collapsed ? 'Déconnexion' : ''"
      >
        <i class="bi bi-box-arrow-right"></i>
        <span class="label">Déconnexion</span>
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { useUtilisateur } from '@/composables/login/useUtilisateur';
import { ref } from 'vue';

const collapsed = ref(false);
const {seDeconnecter} = useUtilisateur()
function toggle() {
  collapsed.value = !collapsed.value;
}

function handleLogout() {
  seDeconnecter()
}
</script>

<style scoped>
.sidebar {
  --sidebar-width-expanded: 260px;
  --sidebar-width-collapsed: 72px;

  width: var(--sidebar-width-expanded);
  min-width: var(--sidebar-width-expanded);
  height: 100vh;
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: column;
  background-color: var(--surface-color);
  border-right: 1px solid var(--border-subtle);
  color: var(--text-color);
  transition: width 0.25s ease, min-width 0.25s ease;
  overflow-x: hidden;
}

.sidebar--collapsed {
  width: var(--sidebar-width-collapsed);
  min-width: var(--sidebar-width-collapsed);
}

/* ==== Header ==== */
.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid var(--border-subtle);
}

.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-color);
  font-weight: 600;
  font-size: 1.1rem;
  white-space: nowrap;
}

.sidebar-brand i {
  color: var(--primary-color);
  font-size: 1.4rem;
}

.btn-toggle {
  background: transparent;
  border: none;
  color: var(--text-secondary);
  padding: 4px 8px;
  border-radius: 6px;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.btn-toggle:hover {
  background-color: var(--surface-hover);
  color: var(--primary-color);
}

/* ==== Body ==== */
.sidebar-body {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
}

.accordion-item {
  background-color: transparent;
  border: none;
}

.accordion-button {
  background-color: transparent;
  color: var(--text-color);
  padding: 12px 16px;
  white-space: nowrap;
  box-shadow: none;
}

.accordion-button:not(.collapsed) {
  background-color: var(--surface-active);
  color: var(--primary-color);
  box-shadow: none;
}

.accordion-button:focus {
  box-shadow: none;
}

.accordion-button::after {
  filter: invert(1) grayscale(1) brightness(2);
}

.accordion-button i {
  color: var(--primary-color);
  font-size: 1.1rem;
  min-width: 20px;
  text-align: center;
}

.accordion-body {
  background-color: transparent;
}

.list-group-item {
  background-color: transparent;
  border: none;
  padding: 0;
}

.nav-link-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px 10px 40px;
  color: var(--text-secondary);
  text-decoration: none;
  white-space: nowrap;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.nav-link-item:hover {
  background-color: var(--surface-hover);
  color: var(--primary-color);
}

.nav-link-item.router-link-active {
  background-color: var(--surface-active);
  color: var(--primary-color);
}

.nav-link-item i {
  min-width: 20px;
  text-align: center;
}

/* ==== Footer : déconnexion ==== */
.sidebar-footer {
  border-top: 1px solid var(--border-subtle);
  padding: 12px;
}

.btn-logout {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  background: transparent;
  border: none;
  color: var(--text-secondary);
  padding: 10px 12px;
  border-radius: 6px;
  white-space: nowrap;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.btn-logout:hover {
  background-color: var(--error-bg);
  color: var(--error-color);
}

.btn-logout i {
  font-size: 1.1rem;
  min-width: 20px;
  text-align: center;
}

/* ==== Etat rétréci : icônes seules ==== */
.sidebar--collapsed .label {
  display: none;
}

.sidebar--collapsed .sidebar-header {
  justify-content: center;
  padding: 16px 8px;
}

.sidebar--collapsed .accordion-button {
  justify-content: center;
  padding: 12px 0;
}

.sidebar--collapsed .accordion-button::after {
  display: none;
}

.sidebar--collapsed .nav-link-item {
  justify-content: center;
  padding: 10px 0;
}

.sidebar--collapsed .accordion-button i,
.sidebar--collapsed .nav-link-item i {
  margin-right: 0 !important;
  font-size: 1.2rem;
}

.sidebar--collapsed .btn-logout {
  justify-content: center;
  padding: 10px 0;
}

.sidebar--collapsed .btn-logout i {
  margin-right: 0 !important;
  font-size: 1.2rem;
}
</style>