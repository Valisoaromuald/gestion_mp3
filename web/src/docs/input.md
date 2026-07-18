# BaseInput

## Description

Champ de saisie réutilisable.

Il est compatible avec `v-model`.

---

## Import

```ts
import BaseInput from "@/components/ui/input/BaseInput.vue"
```

---

## Utilisation

```vue
<BaseInput
    v-model="username"
/>
```

---

## Placeholder

```vue
<BaseInput
    v-model="username"
    placeholder="Nom utilisateur"
/>
```

---

## Types HTML

```vue
<BaseInput
    type="password"
/>

<BaseInput
    type="email"
/>

<BaseInput
    type="number"
/>
```

---

## États

Erreur

```vue
<BaseInput
    variant="error"
/>
```

Succès

```vue
<BaseInput
    variant="success"
/>
```

---

## Désactivé

```vue
<BaseInput
    disabled
/>
```

---

## Largeur

```vue
<BaseInput
    fullWidth
/>
```

---

## Exemple

```vue
<div class="flex gap-2">

    <BaseInput
        v-model="search"
        placeholder="Recherche..."
    />

    <BaseButton>
        Rechercher
    </BaseButton>

</div>
```

---

## Bonnes pratiques

Toujours utiliser BaseInput.

Ne jamais styliser directement un `<input>` HTML dans une page.