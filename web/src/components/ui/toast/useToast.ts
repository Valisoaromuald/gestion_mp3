import { ref } from 'vue'

export type ToastType = 'success' | 'error' | 'info'

export interface Toast {
  id: number
  message: string
  type: ToastType
}

// État global partagé par tous les composants qui utilisent useToast()
const toasts = ref<Toast[]>([])
let nextId = 1

function push(message: string, type: ToastType = 'success', duration: number = 3000): number {
  const id = nextId++
  toasts.value.push({ id, message, type })

  if (duration > 0) {
    setTimeout(() => remove(id), duration)
  }

  return id
}

function remove(id: number): void {
  const index = toasts.value.findIndex((t:Toast) => t.id === id)
  if (index !== -1) toasts.value.splice(index, 1)
}

export function useToast() {
  return {
    toasts: toasts,

    // Raccourcis pratiques pour CRUD
    success: (msg: string, duration?: number) => push(msg, 'success', duration),
    error:   (msg: string, duration?: number) => push(msg, 'error', duration),
    info:    (msg: string, duration?: number) => push(msg, 'info', duration),

    // Raccourcis spécifiques CRUD (optionnels, mais pratiques)
    notifyCreated: (entity: string = 'Élément') => push(`${entity} ajouté avec succès`, 'success'),
    notifyUpdated: (entity: string = 'Élément') => push(`${entity} mis à jour avec succès`, 'success'),
    notifyDeleted: (entity: string = 'Élément') => push(`${entity} supprimé avec succès`, 'success'),
    notifyError:   (msg: string = 'Une erreur est survenue') => push(msg, 'error'),

    remove
  }
}