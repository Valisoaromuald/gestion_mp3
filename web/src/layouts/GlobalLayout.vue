<template>
  <div class="d-flex min-vh-100">
    <SideBarOffCanvas />
    <main class="flex-grow-1 p-3">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import SideBarOffCanvas from '@/components/ui/sidebar/SideBarOffCanvas.vue';
</script>