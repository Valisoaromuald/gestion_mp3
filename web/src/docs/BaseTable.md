# BaseTable

Composant de tableau générique pour Vue 3 avec recherche, tri, pagination, sélection multiple, totaux et slots personnalisés.

## Import

```ts
import BaseTable from '@/components/ui/BaseTable'
```

## Utilisation basique

```vue
<template>
  <BaseTable :items="users" :columns="['name', 'email']" />
</template>
```

## Props

| Prop | Type | Défaut | Description |
|---|---|---|---|
| `items` | `T[]` | requis | Données à afficher |
| `columns` | `Array<TableColumn<T> \| string>` | requis | Colonnes : string simple ou objet `TableColumn` |
| `pageSize` | `number` | `10` | Nombre de lignes par page |
| `searchable` | `boolean` | `false` | Affiche la barre de recherche |
| `sortable` | `boolean` | `false` | Active le tri au clic sur l'en-tête |
| `loading` | `boolean` | `false` | Affiche un skeleton de chargement |
| `customClass` | `string \| string[] \| Record<string, boolean>` | — | Classes CSS additionnelles sur le conteneur |
| `onRowClick` | `(item: T, event: Event) => void \| null` | — | Callback au clic sur une ligne |
| `multiSelect` | `boolean` | `false` | Active les checkboxes de sélection |
| `selectedItems` | `T[]` | — | Liste des éléments sélectionnés (à utiliser avec `v-model:selectedItems`) |

## Events

| Event | Payload | Description |
|---|---|---|
| `update:selectedItems` | `any[]` | Émis quand la sélection change (cocher/décocher une ou toutes les lignes) |

## Colonnes : `TableColumn<T>`

```ts
interface TableColumn<T = any> {
    key: string                 // clé de l'objet à afficher
    label: string                // libellé affiché dans l'en-tête
    class?: string                // classe CSS sur les cellules
    align?: TableAlign            // alignement (voir ci-dessous)

    badge?: boolean
    badgeVariant?: string | ((value: any, item: T) => string)
    badgeColor?: string
    badgeTextColor?: string

    formatter?: (value: any, item: T) => string   // formatte la valeur affichée
    total?: boolean                                 // affiche un total en pied de tableau
    totalFormatter?: (total: number, items: T[]) => string

    footer?: string | number       // contenu statique du footer pour cette colonne

    onClick?: (value: any, item: T, event: Event) => void  // clic sur la cellule
}
```

Une colonne peut être déclarée simplement par une string :
```ts
columns: ['name', 'email']
// équivaut à
columns: [{ key: 'name', label: 'name' }, { key: 'email', label: 'email' }]
```

### `TableAlign`

```ts
type TableAlign = 'left' | 'right' | 'center' | 'start' | 'end' | 'text-start' | 'text-end' | 'text-center'
```

Si `align` n'est pas précisé, l'alignement est déduit automatiquement :
- valeurs numériques ou colonnes `total` → alignées à droite
- valeurs ressemblant à des dates (`YYYY-MM-DD`, `DD/MM/YYYY`, etc.) → alignées à droite
- sinon → alignées à gauche

## Slots

### Cellule personnalisée

Chaque colonne expose un slot nommé `cell-{key}` :

```vue
<BaseTable :items="users" :columns="[{ key: 'status', label: 'Statut' }]">
  <template #cell-status="{ item, value }">
    <span :class="value === 'active' ? 'text-success' : 'text-danger'">
      {{ value }}
    </span>
  </template>
</BaseTable>
```

Si le slot n'est pas fourni, la cellule affiche soit `column.formatter(value, item)` soit la valeur brute.

## Recherche

Activée avec `searchable`. La recherche est globale : elle filtre sur la représentation JSON complète de chaque item (insensible à la casse), pas seulement sur les colonnes affichées.

```vue
<BaseTable :items="users" :columns="columns" searchable />
```

## Tri

Activé avec `sortable`. Le clic sur un en-tête de colonne trie par cette colonne ; un second clic inverse l'ordre (asc/desc). Le tri compare directement les valeurs (`<`, `>`), donc il fonctionne nativement pour les nombres et chaînes ; pour des cas spécifiques, formatez vos données en amont.

```vue
<BaseTable :items="users" :columns="columns" sortable />
```

## Pagination

Automatique dès que `items.length > pageSize`. La page revient à 1 quand la recherche change ou que `items` est remplacé.

```vue
<BaseTable :items="users" :columns="columns" :pageSize="20" />
```

## Sélection multiple

```vue
<script setup>
import { ref } from 'vue'
const selected = ref([])
</script>

<template>
  <BaseTable
    :items="users"
    :columns="columns"
    multiSelect
    v-model:selectedItems="selected"
  />
</template>
```

La comparaison entre items repose sur `JSON.stringify`. Une checkbox dans l'en-tête permet de sélectionner/désélectionner tous les éléments de la page courante.

## Totaux et pied de tableau

```ts
const columns = [
  { key: 'label', label: 'Produit' },
  { key: 'amount', label: 'Montant', total: true }
]
```

- `total: true` calcule automatiquement la somme de la colonne (sur tous les éléments filtrés, pas seulement la page courante) et l'affiche dans le footer.
- Si plus d'une page existe, une ligne additionnelle affiche le total de la page courante uniquement.
- `totalFormatter(total, items)` permet de personnaliser l'affichage du total global.
- `footer` affiche un contenu statique pour une colonne sans calcul (ex: un libellé "Total :").

## Clic sur ligne / cellule

```ts
const onRowClick = (item, event) => {
  console.log('Ligne cliquée', item)
}
```

```vue
<BaseTable :items="users" :columns="columns" :onRowClick="onRowClick" />
```

Le clic sur une ligne est ignoré automatiquement si l'élément cliqué est un `button`, `input`, `select`, `textarea`, `a`, ou porte la classe `.no-row-click` — utile pour éviter de déclencher `onRowClick` en cliquant sur une checkbox ou un bouton d'action dans une cellule.

Pour un clic spécifique à une colonne, utilisez `column.onClick` :
```ts
{
  key: 'actions',
  label: '',
  onClick: (value, item, event) => deleteItem(item)
}
```

## Formatage des valeurs

```ts
{
  key: 'amount',
  label: 'Montant',
  formatter: (value, item) => `${value.toFixed(2)} €`
}
```

## État de chargement

```vue
<BaseTable :items="[]" :columns="columns" :loading="isLoading" />
```

Affiche 4 lignes de squelettes animés tant que `loading` est `true`.

## État vide

Si `items` (après filtrage/pagination) est vide et que `loading` est `false`, le message "Aucune donnée" s'affiche automatiquement sur toute la largeur du tableau.

## Exemple complet

```vue
<script setup lang="ts">
import { ref } from 'vue'
import BaseTable from '@/components/ui/BaseTable'
import type { TableColumn } from '@/components/ui/BaseTable'

interface Employee {
  id: number
  name: string
  salary: number
  hiredAt: string
}

const employees = ref<Employee[]>([
  { id: 1, name: 'Alice', salary: 1200, hiredAt: '2024-01-15' },
  { id: 2, name: 'Bob', salary: 950, hiredAt: '2023-09-01' }
])

const selected = ref<Employee[]>([])

const columns: TableColumn<Employee>[] = [
  { key: 'name', label: 'Nom' },
  { key: 'salary', label: 'Salaire', total: true, formatter: (v) => `${v} €` },
  { key: 'hiredAt', label: 'Date d\'embauche' }
]

const onRowClick = (item: Employee) => {
  console.log('Employé sélectionné :', item)
}
</script>

<template>
  <BaseTable
    :items="employees"
    :columns="columns"
    searchable
    sortable
    multiSelect
    :pageSize="10"
    :onRowClick="onRowClick"
    v-model:selectedItems="selected"
  />
</template>
```

## Fichiers du composant

| Fichier | Rôle |
|---|---|
| `BaseTable.vue` | Template et logique d'affichage (slots, classes, événements DOM) |
| `BaseTable.ts` | Composable `useBaseTable` : recherche, tri, pagination |
| `BaseTable.types.ts` | Types TypeScript exportés (`TableColumn`, `BaseTableProps`, `TableAlign`, `TableVariant`) |
| `index.ts` | Point d'entrée : exporte le composant par défaut et tous les types |
