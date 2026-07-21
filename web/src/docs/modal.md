# BaseModal

## Description

Fenêtre modale réutilisable.

---

## Import

```ts
import BaseModal from "@/components/ui/modal/BaseModal.vue"
```

---

## Ouverture

```ts
const open = ref(false)
```

```vue
<BaseModal
    v-model="open"
>
</BaseModal>
```

---

## Titre

```vue
<BaseModal
    title="Nouvel utilisateur"
>
</BaseModal>
```

---

## Taille

```vue
<BaseModal
    size="sm"
/>

<BaseModal
    size="md"
/>

<BaseModal
    size="lg"
/>
```

---

## Contenu

```vue
<BaseModal
    v-model="open"
>

    <BaseInput
        v-model="username"
    />

</BaseModal>
```

---

## Footer personnalisé

```vue
<BaseModal
    v-model="open"
>

    <template #footer>

        <BaseButton
            variant="secondary"
        >
            Annuler
        </BaseButton>

        <BaseButton>
            Sauvegarder
        </BaseButton>

    </template>

</BaseModal>
```

---

## Fermeture

Le modal peut être fermé :

- bouton X
- touche ESC
- clic sur l'arrière-plan (si autorisé)

---

## Animation

Le composant possède une animation d'ouverture et de fermeture intégrée.

Aucune configuration supplémentaire n'est nécessaire.

---

## Bonnes pratiques

Le contenu métier doit être placé dans les slots.

Ne pas modifier directement BaseModal pour un cas particulier. Si un comportement spécifique est nécessaire, utiliser les props ou les slots.