<template>
    <div class="container-fluid">
        <div class="card" style="background-color: var(--bg-gray);">
            <div class="card-header fs-1 fw-bold" style="color:var(--text-color)">Mes Playlists</div>
            <div class="card-body">
                <BaseTable :columns="playlistColumns" :items="playlists" :page-size="10">
                    <template #cell-actions="{ item }">
                         <div class="d-flex gap-2 justify-content-center"> 
                            <BaseButton variant="success" @click="downloadPlaylist(item)"><i class="bi bi-download"></i>Télécharger</BaseButton>
                            <BaseButton variant="info" @click="listenPlaylist(item)"><i class="bi bi-play-fill"></i>Écouter</BaseButton>
                        </div> 
                    </template>
                </BaseTable>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import BaseTable from '../ui/table/BaseTable.vue'
import BaseButton from '../ui/button/BaseButton.vue'
import { usePlaylistListing } from '@/composables/playlist/usePlaylistListing'
import type { TableColumn } from '../ui/table/BaseTable.types'
import type { IPlaylist } from '@/types/playlist'
import { useDurationConverter } from '@/composables/global/useDurationConverter'

const { playlists, getPlaylists, downloadPlaylist, listenPlaylist } = usePlaylistListing()
const { convertInHHMMSS } = useDurationConverter()

onMounted(async () => {
    await getPlaylists()
})

const playlistColumns: TableColumn<IPlaylist>[] = [
    { key: "nom", label: "Nom", align: "center" },
    { key: "nombreMorceaux", label: "Nombre de morceaux", align: "center" },
    { key: "dureeTotale", label: "Durée totale", formatter: (v) => convertInHHMMSS(v), align: "center" },
    { key: "actions", label: "Actions", align: "center" }
]
</script>