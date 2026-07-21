    <script setup lang="ts">
    import { watch } from 'vue'
    import BaseButton from '../button/BaseButton.vue'
    import type { BaseTableProps, TableAlign, TableColumn } from './BaseTable.types'
    import { useBaseTable } from './BaseTable'
    import BaseInput from '../input/BaseInput.vue';

    const props = defineProps<BaseTableProps<any>>()

    const emit = defineEmits<{
        (e: 'update:selectedItems', value: any[]): void
    }>()

    const {
        search,
        currentPage,
        sort,
        filteredItems,
        normalizedColumns,
        paginatedItems,
        totalPages,
        sortKey,
        sortDirection,
        getValue
    } = useBaseTable(props, emit)

    /* reset pagination */
    watch(search, () => {
        currentPage.value = 1
    })

    watch(
        () => props.items,
        () => {
            currentPage.value = 1
        }
    )

    /* =========================
    HELPERS (UI SAFE)
    ========================= */

    const isSelected = (item: any) => {
        return (props.selectedItems ?? []).some((s: any) =>
            JSON.stringify(s) === JSON.stringify(item)
        )
    }

    const toggleItem = (item: any) => {
        const selected = [...(props.selectedItems ?? [])]

        const index = selected.findIndex((s: any) =>
            JSON.stringify(s) === JSON.stringify(item)
        )

        if (index >= 0) {
            selected.splice(index, 1)
        } else {
            selected.push(item)
        }

        emit('update:selectedItems', selected)
    }

    const allSelected = () => {
        if (!paginatedItems.value.length) return false
        return paginatedItems.value.every(isSelected)
    }

    const toggleAll = () => {
        const selected = [...(props.selectedItems ?? [])]
        const page = paginatedItems.value

        const all = allSelected()

        page.forEach(item => {
            const index = selected.findIndex((s: any) =>
                JSON.stringify(s) === JSON.stringify(item)
            )

            if (all && index >= 0) {
                selected.splice(index, 1)
            }

            if (!all && index === -1) {
                selected.push(item)
            }
        })

        emit('update:selectedItems', selected)
    }

    /* =========================
    COLUMN HELPERS
    ========================= */

    const getHeadAlignment = (column: TableColumn, items: any[]) => {
        if (!items.length) return ''
        return getCellAlignment(column, items[0])
    }

    const isDateValue = (value: any) => {
        if (value instanceof Date) {
            return !Number.isNaN(value.getTime())
        }
        if (typeof value !== 'string') {
            return false
        }
        const trimmed = value.trim()
        return /^\d{4}[-\/]\d{2}[-\/]\d{2}/.test(trimmed) || /^\d{2}[-\/]\d{2}[-\/]\d{4}/.test(trimmed)
    }

    const getCellAlignment = (column: TableColumn, item: any) => {
        const alignClass = normalizeAlignment(column.align)
        if (alignClass) return alignClass

        const rawValue = getValue(item, column.key)
        if (column.total || isNumericValue(rawValue) || isDateValue(rawValue)) {
            return 'text-end'
        }
        return 'text-start'
    }

    const normalizeAlignment = (align: TableAlign | undefined) => {
        if (!align) return null
        if (typeof align !== 'string') return null
        const normalized = align.trim().toLowerCase()
        if (normalized.startsWith('text-')) {
            return normalized
        }
        if (normalized === 'left' || normalized === 'start') {
            return 'text-start'
        }
        if (normalized === 'right' || normalized === 'end') {
            return 'text-end'
        }
        if (normalized === 'center') {
            return 'text-center'
        }
        return null
    }

    const isNumericValue = (value: any) => {
        if (typeof value === 'number' && isFinite(value)) {
            return true
        }
        if (typeof value !== 'string') {
            return false
        }
        const trimmed = value.trim()
        return trimmed !== '' && /^-?\d+(?:[\.,]\d+)?$/.test(trimmed)
    }

    const getFooterCellAlignment = (column: TableColumn) => {
        const alignClass = normalizeAlignment(column.align)
        if (alignClass) return alignClass
        if (column.total) return 'text-end'
        if (isNumericValue(column.footer)) return 'text-end'
        return 'text-start'
    }

    const getTotal = (columnKey: string) => {
        const total = filteredItems.value.reduce((sum, item) => {
            const value = Number(item?.[columnKey]) || 0
            return sum + value
        }, 0)

        return formatNumber(total)
    }

    const getPageTotal = (columnKey: string) => {
        return paginatedItems.value.reduce((sum, item) => {
            const value = Number(item?.[columnKey]) || 0;
            return sum + value;
        }, 0);
    };

    const formatNumber = (num: any) => {
        return Number(parseFloat(num).toFixed(5))
    }

    const handleRowClick = (event: Event, item: any) => {
        const ignored = (event.target as HTMLElement).closest(
            'button, input, select, textarea, a, .no-row-click'
        )
        if (ignored) return

        props.onRowClick?.(item, event)
    }

    /* =========================
    BADGE HELPERS
    ========================= */

    // Résout badgeVariant qui peut être une string OU une fonction
    const resolveBadgeVariant = (column: TableColumn, value: any, item: any): string | undefined => {
        if (typeof column.badgeVariant === 'function') {
            return column.badgeVariant(value, item)
        }
        return column.badgeVariant
    }

    // Retourne la classe CSS Tailwind selon la variante
    const getBadgeVariantClass = (variant: string | undefined): string => {
        switch (variant) {
            case 'success': return 'badge-success'
            case 'danger': return 'badge-danger'
            case 'warning': return 'badge-warning'
            case 'primary': return 'badge-primary'
            case 'secondary': return 'badge-secondary'
            default: return 'badge-secondary' // valeur par défaut si rien n'est précisé
        }
    }

    // Retourne un style inline si badgeColor/badgeTextColor sont fournis (prioritaire sur badgeVariant)
    const getBadgeInlineStyle = (column: TableColumn) => {
        if (!column.badgeColor) return {}
        return {
            backgroundColor: column.badgeColor,
            color: column.badgeTextColor ?? '#fff'
        }
    }
    const handleColumnClick = (column: TableColumn, item: any, event: Event) => {
        column.onClick?.(getValue(item, column.key), item, event)
        event.stopPropagation()
    }
    </script>

    <template>
        <div :class="['base-table-container', customClass]">

            <!-- SEARCH -->
            <div v-if="searchable" class="table-search">
                <div class="search-box">
                    <span class="search-icon">
                        <i class="bi bi-search"></i>
                    </span>
                    <BaseInput v-model="search" type="text" placeholder="Rechercher..." variant="success" />
                </div>
            </div>

            <div class="table-scroll">
                <table class="table table-modern align-middle no-total">

                    <!-- HEADER -->
                    <thead>
                        <tr>
                            <th v-if="multiSelect" class="text-center">
                                <input type="checkbox" :checked="allSelected()" @change="toggleAll" />
                            </th>

                            <th v-for="column in normalizedColumns" :key="column.key" @click="sort(column.key)"
                                :class="getHeadAlignment(column, paginatedItems)">
                                {{ column.label }}

                                <span v-if="sortKey === column.key">
                                    {{ sortDirection === 'asc' ? '▲' : '▼' }}
                                </span>
                            </th>
                        </tr>
                    </thead>

                    <!-- BODY -->
                    <tbody>

                        <!-- LOADING -->
                        <template v-if="loading">
                            <tr v-for="i in 4" :key="i">
                                <td v-if="multiSelect"></td>
                                <td v-for="col in normalizedColumns" :key="col.key">
                                    <div class="skeleton"></div>
                                </td>
                            </tr>
                        </template>

                        <!-- EMPTY -->
                        <tr v-else-if="paginatedItems.length === 0">
                            <td :colspan="normalizedColumns.length + (multiSelect ? 1 : 0)" class="text-center py-5">
                                Aucune donnée
                            </td>
                        </tr>

                        <!-- ROWS -->
                        <tr v-else v-for="(item, index) in paginatedItems" :key="index"
                            @click="handleRowClick($event, item)" :class="{ clickable: onRowClick }">

                            <!-- SELECT -->
                            <td v-if="multiSelect" class="text-center no-row-click">
                                <input type="checkbox" :checked="isSelected(item)" @change="toggleItem(item)" />
                            </td>

                            <!-- CELLS -->
                            <td v-for="column in normalizedColumns" :key="column.key" :class="[
                                column.class,
                                getCellAlignment(column, item)
                            ]" @click="handleColumnClick(column, item, $event)">
                                <slot :name="`cell-${column.key}`" :item="item" :value="getValue(item, column.key)">

                                    <!-- Mode BADGE -->
                                    <span v-if="column.badge" class="badge"
                                        :class="!column.badgeColor ? getBadgeVariantClass(resolveBadgeVariant(column, getValue(item, column.key), item)) : ''"
                                        :style="getBadgeInlineStyle(column)">
                                        {{ column.formatter ? column.formatter(getValue(item, column.key), item) :
                                            getValue(item, column.key) }}
                                    </span>

                                    <!-- Mode TEXTE NORMAL (comportement actuel, inchangé) -->
                                    <template v-else>
                                        {{ column.formatter ? column.formatter(getValue(item, column.key), item) :
                                            getValue(item, column.key) }}
                                    </template>

                                </slot>
                            </td>
                        </tr>

                    </tbody>

                    <tfoot v-if="!loading && normalizedColumns.some(col => col.total || col.footer)">
                        <tr>
                            <td v-if="multiSelect"></td>
                            <td v-for="column in normalizedColumns" :key="column.key"
                                :class="[getFooterCellAlignment(column), totalPages > 1 ? 'pad-red' : '']">

                                <template v-if="column.total">
                                    <span class="grand-total mb-2" title="Total global">
                                        {{ column.totalFormatter ? column.totalFormatter(getTotal(column.key),
                                            paginatedItems) : getTotal(column.key) }}
                                    </span>
                                </template>

                                <template v-else-if="column.footer">
                                    {{ column.footer }}
                                </template>
                            </td>
                        </tr>
                        <tr v-if="totalPages > 1">
                            <td v-if="multiSelect"></td>
                            <td v-for="column in normalizedColumns" :key="column.key"
                                :class="['page-total', column.footer ? 'align-start' : '']">
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            <!-- PAGINATION -->
            <div class="table-pagination" v-if="totalPages > 1">
                <BaseButton size="sm" :disabled="currentPage === 1" @click="currentPage--">
                    <<</BaseButton>
                <span>
                    Page {{ currentPage }} / {{ totalPages }}
                </span>

                <BaseButton  size="sm" :disabled="currentPage === totalPages" @click="currentPage++" >>></BaseButton>
            </div>

        </div>
    </template>

    <style scoped>
    /* ===================================
    CONTAINER
    =================================== */

    .base-table-container {
        width: 100%;
        background: var(--surface-color);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 1px 3px rgba(0, 0, 0, .04), 0 1px 8px rgba(0, 0, 0, .03);
    }

    /* ===================================
    TOOLBAR
    =================================== */

    .table-toolbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: .75rem 1rem;
        background: var(--surface-color);
        border-bottom: 1px solid var(--border-color);
    }

    .toolbar-left {
        display: flex;
        align-items: center;
        gap: .5rem;
    }

    .toolbar-btn {
        display: flex;
        align-items: center;
        gap: .4rem;
        border: 1px solid var(--border-color);
        background: transparent;
        color: var(--text-muted-custom);
        padding: .4rem .75rem;
        border-radius: 8px;
        font-size: .8rem;
        transition: background .15s, color .15s, border-color .15s;
        cursor: pointer;
    }

    .toolbar-btn:hover {
        background: rgba(59, 115, 247, .07);
        color: var(--primary-color);
        border-color: rgba(59, 115, 247, .3);
    }

    /* ===================================
    SEARCH
    =================================== */

    .table-search {
        padding: .875rem 1rem;
        background: var(--surface-color);
        border-bottom: 1px solid var(--border-color);
    }

    .search-box {
        position: relative;
        max-width: 340px;
        width: 100%;
    }

    .search-icon {
        position: absolute;
        left: .85rem;
        top: 50%;
        transform: translateY(-50%);
        color: var(--text-muted-custom);
        font-size: .85rem;
        pointer-events: none;
    }

    .search-box input {
        width: 100%;
        height: 38px;
        padding-left: 2.4rem;
        padding-right: 1rem;
        border: 1px solid var(--border-color);
        border-radius: 8px;
        background: var(--light-color);
        color: var(--text-color);
        font-size: .875rem;
        transition: border-color .15s, box-shadow .15s;
    }

    .search-box input::placeholder {
        color: var(--text-muted-custom);
    }

    .search-box input:focus {
        outline: none;
        border-color: var(--primary-color);
        box-shadow: 0 0 0 3px rgba(59, 115, 247, .1);
    }

    /* ===================================
    TABLE
    =================================== */

    .table-scroll {
        overflow-x: auto;
    }

    .table {
        width: 100%;
        min-width: 900px;
        border-collapse: collapse;
    }

    /* HEADER */

    thead {
        background: var(--bg-gray);
    }

    thead th {
        padding: .75rem .875rem;
        font-size: .7rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: .05em;
        color: var(--text-muted-custom);
        border-bottom: 1px solid var(--border-color);
        white-space: nowrap;
        user-select: none;
        transition: color .15s;
        cursor: pointer;
    }

    thead th:hover {
        color: var(--text-color);
    }

    /* BODY */

    tbody td {
        padding: .85rem .875rem;
        color: var(--text-color);
        font-size: .875rem;
        border-bottom: 1px solid var(--border-color);
        white-space: nowrap;
        background-color: var(--light-color);
    }

    tbody tr {
        transition: background .1s;
    }

    tbody tr:hover {
        background: rgba(59, 115, 247, .035);
    }

    tbody tr:hover td {
        background: rgba(59, 115, 247, .035);
    }

    tbody tr:last-child td {
        border-bottom: none;
    }

    /* FOOTER */

    tfoot td {
        padding: .85rem .875rem;
        font-weight: 600;
        color: var(--text-color);
        border-top: 1px solid var(--border-color);
        border-bottom: none;
        background: var(--light-color);
    }

    .page-total {
        font-size: 0.75rem;
        color: var(--text-muted-custom);
        font-weight: normal;
        text-align: end;
        padding-top: 5px;
        border-top-style: dashed;
    }

    .pad-red {
        padding-bottom: 5px;
    }

    .align-start {
        text-align: start;
    }

    .grand-total {
        font-size: 0.9rem;
        color: var(--text-color);
        font-weight: 700;
    }

    /* ===================================
    EMPTY STATE
    =================================== */

    tbody tr td.text-center.py-5 {
        padding-top: 3rem;
        padding-bottom: 3rem;
        color: var(--text-muted-custom);
        font-size: .875rem;
    }

    /* ===================================
    ROW CLICK
    =================================== */

    .clickable {
        cursor: pointer;
    }

    /* ===================================
    PAGINATION
    =================================== */

    .table-pagination {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: .875rem;
        padding: .875rem 1rem;
        border-top: 1px solid var(--border-color);
        background: var(--bg-gray);
    }

    .table-pagination span {
        color: var(--text-muted-custom);
        font-size: .8rem;
    }

    /* ===================================
    SKELETON
    =================================== */

    .skeleton {
        width: 100%;
        height: 14px;
        border-radius: 6px;
        background:
            linear-gradient(90deg,
                var(--skeleton-bg) 25%,
                var(--skeleton-highlight) 50%,
                var(--skeleton-bg) 75%);
        background-size: 200% 100%;
        animation: skeleton-loading 1.5s infinite;
    }

    .skeleton-checkbox {
        width: 16px;
        height: 16px;
        margin: 0 auto;
    }

    @keyframes skeleton-loading {
        from {
            background-position: 200% 0;
        }

        to {
            background-position: -200% 0;
        }
    }

    /* ===================================
    CHECKBOXES
    =================================== */

    thead th input[type="checkbox"],
    tbody td input[type="checkbox"] {
        width: 16px;
        height: 16px;
        cursor: pointer;
        accent-color: var(--primary-color);
        border-radius: 4px;
    }

    thead th input[type="checkbox"]:disabled,
    tbody td input[type="checkbox"]:disabled {
        cursor: not-allowed;
        opacity: 0.5;
    }

    th {
        background-color: var(--primary-color) !important;
        color: var(--w-color) !important;
    }

    /* ===================================
    BADGES
    =================================== */

    .badge {
        display: inline-flex;
        align-items: center;
        padding: 0.25rem 0.65rem;
        border-radius: 999px;
        font-size: 0.75rem;
        font-weight: 600;
        line-height: 1.2;
        white-space: nowrap;
    }

    .badge-success {
        background-color: rgba(16, 185, 129, 0.15);
        color: rgb(5, 150, 105);
    }

    .badge-danger {
        background-color: rgba(239, 68, 68, 0.15);
        color: rgb(220, 38, 38);
    }

    .badge-warning {
        background-color: rgba(245, 158, 11, 0.15);
        color: rgb(180, 83, 9);
    }

    .badge-primary {
        background-color: rgba(59, 115, 247, 0.15);
        color: rgb(37, 99, 235);
    }

    .badge-secondary {
        background-color: rgba(107, 114, 128, 0.15);
        color: rgb(75, 85, 99);
    }

    /* ===================================
    RESPONSIVE
    =================================== */

    @media (max-width: 768px) {

        .table-toolbar {
            flex-direction: column;
            align-items: flex-start;
            gap: .75rem;
        }

        .search-box {
            max-width: 100%;
        }

        .table {
            min-width: 700px;
        }
    }

    .no-total {
        margin-bottom: 0 !important;
    }
    </style>