<template>
  <div class="toast-container">
    <transition-group name="toast">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="custom-toast"
        :class="`custom-toast--${toast.type}`"
        @click="remove(toast.id)"
      >
        <span class="custom-toast__icon">
          <template v-if="toast.type === 'success'">✔</template>
          <template v-else-if="toast.type === 'error'">✖</template>
          <template v-else>ℹ</template>
        </span>
        <span class="custom-toast__message">{{ toast.message }}</span>
      </div>
    </transition-group>
  </div>
</template>

<script setup lang="ts">
import { useToast } from '@/components/ui/toast/useToast'
const { toasts, remove } = useToast()
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.custom-toast {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 260px;
  max-width: 360px;
  padding: 12px 16px;
  border-radius: 8px;
  color: #fff;
  font-size: 14px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  cursor: pointer;
}

.custom-toast--success { background-color: #22c55e; }
.custom-toast--error   { background-color: #ef4444; }
.custom-toast--info    { background-color: #3b82f6; }

.custom-toast__icon { font-weight: bold; }

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
.toast-enter-to,
.toast-leave-from {
  opacity: 1;
  transform: translateX(0);
}
</style>