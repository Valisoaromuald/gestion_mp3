# BaseButton

## Description

BaseButton est le bouton réutilisable de l'application.

Toutes les pages doivent utiliser ce composant au lieu d'un bouton HTML afin de conserver une interface homogène.

---

## Import

```ts
import BaseButton from "@/components/ui/button/BaseButton.vue"
```

---

## Utilisation simple

```vue
<BaseButton>
    Enregistrer
</BaseButton>
```

---

## Variantes

```vue
<BaseButton variant="primary">
    Ajouter
</BaseButton>

<BaseButton variant="success">
    Valider
</BaseButton>

<BaseButton variant="danger">
    Supprimer
</BaseButton>

<BaseButton variant="secondary">
    Annuler
</BaseButton>
```

---

## Largeur

Occupe toute la largeur disponible.

```vue
<BaseButton fullWidth>
    Sauvegarder
</BaseButton>
```

---

## Partage de l'espace

Dans un conteneur flex.

```vue
<div class="flex gap-2">

    <BaseButton grow>
        Oui
    </BaseButton>

    <BaseButton grow variant="secondary">
        Non
    </BaseButton>

</div>
```

---

## Loading

```vue
<BaseButton :loading="true">
    Sauvegarde...
</BaseButton>
```

---

## Désactivation

```vue
<BaseButton disabled>
    Impossible
</BaseButton>
```

---

## Événement

```vue
<BaseButton @click="save">
    Sauvegarder
</BaseButton>
```

---

## Bonnes pratiques

✔ Toujours utiliser BaseButton

✔ Ne jamais ajouter directement des classes Tailwind de couleur sur le composant.

✔ Utiliser les variantes disponibles.

✔ Laisser le composant gérer le style.