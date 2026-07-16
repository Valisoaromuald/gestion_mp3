<!--
  1) Placez <~ontainer /> UNE SEULE FOIS dans votre App.vue (racine),
     pour que les toasts s'affichent au-dessus de toute l'application.

  2) Dans n'importe quel composant, importez useToast() et appelez
     les méthodes après vos appels API.
-->

<template>
  <div>
    <button @click="creerUtilisateur">Créer</button>
    <button @click="modifierUtilisateur">Modifier</button>
    <button @click="supprimerUtilisateur">Supprimer</button>
  </div>
</template>

<script setup>
import { useToast } from './useToast'

const toast = useToast()

async function creerUtilisateur() {
  try {
    // await api.post('/users', data)
    toast.notifyCreated('Utilisateur')
    // ou : toast.success('Utilisateur créé avec succès')
  } catch (e) {
    toast.notifyError("Échec de la création de l'utilisateur")
  }
}

async function modifierUtilisateur() {
  try {
    // await api.put('/users/1', data)
    toast.notifyUpdated('Utilisateur')
  } catch (e) {
    toast.notifyError("Échec de la mise à jour")
  }
}

async function supprimerUtilisateur() {
  try {
    // await api.delete('/users/1')
    toast.notifyDeleted('Utilisateur')
  } catch (e) {
    toast.notifyError("Échec de la suppression")
  }
}
</script>
