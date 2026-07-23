<template>
    <div class="player-view">
        <div class="player-shell">
            <!-- Colonne gauche : platine -->
            <div class="deck-column">
                <p class="eyebrow">Lecture en cours</p>
                <h1 class="playlist-name">{{ playlistNom }}</h1>

                <div class="turntable">
                    <div class="disc" :class="{ spinning: isPlaying }">
                        <div class="disc-ring"></div>
                        <div class="disc-label">
                            <span class="disc-index">{{ formattedIndex }}</span>
                        </div>
                    </div>
                    <div class="tonearm" :class="{ resting: !isPlaying }"></div>
                </div>

                <div class="track-info">
                    <h2 class="track-title">{{ currentTrack?.titre ?? 'Aucun morceau' }}</h2>
                    <p class="track-artist">{{ currentTrack?.nomArtiste }}</p>
                    <p class="track-meta" v-if="currentTrack">
                        {{ currentTrack.libelleGenre }} · {{ currentTrack.libelleLangue }}
                    </p>
                </div>

                <div class="transport">
                    <button class="transport-btn" @click="playPrevious" :disabled="currentIndex === 0"
                        aria-label="Morceau précédent">
                        <svg viewBox="0 0 24 24" width="18" height="18">
                            <path fill="currentColor" d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
                        </svg>
                    </button>
                    <button class="transport-btn transport-btn--main" @click="togglePlay"
                        :aria-label="isPlaying ? 'Pause' : 'Lecture'">
                        <svg v-if="!isPlaying" viewBox="0 0 24 24" width="22" height="22">
                            <path fill="currentColor" d="M8 5v14l11-7z" />
                        </svg>
                        <svg v-else viewBox="0 0 24 24" width="22" height="22">
                            <path fill="currentColor" d="M6 5h4v14H6zm8 0h4v14h-4z" />
                        </svg>
                    </button>
                    <button class="transport-btn" @click="playNext" :disabled="currentIndex === morceaux.length - 1"
                        aria-label="Morceau suivant">
                        <svg viewBox="0 0 24 24" width="18" height="18">
                            <path fill="currentColor" d="M16 6h2v12h-2zM6 6l8.5 6L6 18z" />
                        </svg>
                    </button>
                </div>

                <div class="progress">
                    <span class="time">{{ formatTime(currentTime) }}</span>
                    <input type="range" class="progress-bar"
                        :style="{ '--progress': `${duration ? (displayTime / duration) * 100 : 0}%` }" min="0"
                        :max="duration || 0" step="0.1" :value="displayTime" @input="onScrub" @mousedown="startScrub"
                        @touchstart="startScrub" @mouseup="endScrub" @touchend="endScrub" />
                    <span class="time">{{ formatTime(duration) }}</span>
                </div>

                <audio ref="audioRef" :src="currentTrack ? `http://localhost:8080${currentTrack.url}` : undefined"
                    @timeupdate="onTimeUpdate" @loadedmetadata="onLoadedMetadata" @ended="playNext"></audio>
            </div>

            <!-- Colonne droite : file d'attente -->
            <div class="queue-column">
                <p class="eyebrow">Titres · {{ morceaux.length }}</p>
                <ul class="queue-list">
                    <li v-for="(track, index) in morceaux" :key="track.mp3Id" class="queue-item"
                        :class="{ active: index === currentIndex }" @click="playAt(index)">
                        <span class="queue-number">{{ String(index + 1).padStart(2, '0') }}</span>
                        <div class="queue-text">
                            <span class="queue-title">{{ track.titre }}</span>
                            <span class="queue-artist">{{ track.nomArtiste }}</span>
                        </div>
                        <span class="queue-duration">{{ formatTime(track.duree) }}</span>
                        <svg v-if="index === currentIndex && isPlaying" class="queue-playing" viewBox="0 0 24 24"
                            width="14" height="14">
                            <rect x="4" y="8" width="3" height="8" fill="currentColor">
                                <animate attributeName="height" values="8;16;8" dur="0.9s" repeatCount="indefinite" />
                                <animate attributeName="y" values="8;4;8" dur="0.9s" repeatCount="indefinite" />
                            </rect>
                            <rect x="10.5" y="4" width="3" height="16" fill="currentColor">
                                <animate attributeName="height" values="16;6;16" dur="0.9s" repeatCount="indefinite" />
                                <animate attributeName="y" values="4;9;4" dur="0.9s" repeatCount="indefinite" />
                            </rect>
                            <rect x="17" y="10" width="3" height="6" fill="currentColor">
                                <animate attributeName="height" values="6;14;6" dur="0.9s" repeatCount="indefinite" />
                                <animate attributeName="y" values="10;5;10" dur="0.9s" repeatCount="indefinite" />
                            </rect>
                        </svg>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { gestionMp3Api } from '@/api/clients/gestionMp3Api'
import { playlistService } from '@/services/playlistService'
import type { IMorceauPlaylist } from '@/types/morceauPlaylist'
import { useRoute } from 'vue-router';

const props = defineProps<{ id: string }>()

const morceaux = ref<IMorceauPlaylist[]>([])
const currentIndex = ref(0)
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const audioRef = ref<HTMLAudioElement | null>(null)
const scrubTime = ref(0)        // position pendant qu'on glisse
const isScrubbing = ref(false)  // true pendant le glissement

const displayTime = computed(() => isScrubbing.value ? scrubTime.value : currentTime.value)


const currentTrack = computed<IMorceauPlaylist | undefined>(() => morceaux.value[currentIndex.value])
const formattedIndex = computed(() => String(currentIndex.value + 1).padStart(2, '0'))

const route = useRoute();
const playlistNom = computed(() => (route.query.nom as string) ?? '');
onMounted(async () => {
    const response = (await gestionMp3Api.get<IMorceauPlaylist[]>(
        `${playlistService.endpoint}/${props.id}/morceaux`
    )).data
    morceaux.value = response
})

function startScrub() {
    isScrubbing.value = true
    scrubTime.value = currentTime.value
}

function onScrub(event: Event) {
    const value = Number((event.target as HTMLInputElement).value)
    scrubTime.value = value
    // Optionnel : déplacer l'audio en direct pendant le glissement (scrubbing "live")
    if (audioRef.value) audioRef.value.currentTime = value
}

function formatTime(seconds: number | undefined): string {
    if (!seconds || Number.isNaN(seconds)) return '0:00'
    const m = Math.floor(seconds / 60)
    const s = Math.floor(seconds % 60)
    return `${m}:${s.toString().padStart(2, '0')}`
}

function togglePlay() {
    if (!audioRef.value) return
    if (isPlaying.value) {
        audioRef.value.pause()
    } else {
        audioRef.value.play()
    }
    isPlaying.value = !isPlaying.value
}

function playAt(index: number) {
    currentIndex.value = index
    nextTick(() => {
        audioRef.value?.play()
        isPlaying.value = true
    })
}

function playNext() {
    if (currentIndex.value < morceaux.value.length - 1) {
        playAt(currentIndex.value + 1)
    } else {
        isPlaying.value = false
    }
}

function playPrevious() {
    if (currentIndex.value > 0) {
        playAt(currentIndex.value - 1)
    }
}

function onTimeUpdate() {
    if (audioRef.value) currentTime.value = audioRef.value.currentTime
}

function onLoadedMetadata() {
    if (audioRef.value) {
        duration.value = audioRef.value.duration
    }
}
function endScrub() {
    if (audioRef.value) {
        audioRef.value.currentTime = scrubTime.value
        currentTime.value = scrubTime.value
    }
    isScrubbing.value = false
}
watch(currentIndex, () => {
    currentTime.value = 0
    duration.value = 0
    scrubTime.value = 0
    isScrubbing.value = false
})
</script>

<style scoped>
.player-view {
    min-height: 100vh;
    background: var(--body-color);
    color: var(--text-color);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem 1rem;
}

.player-shell {
    width: 100%;
    max-width: 980px;
    display: grid;
    grid-template-columns: 1.1fr 0.9fr;
    gap: 3rem;
    background: var(--surface-color);
    border: 1px solid var(--border-subtle);
    border-radius: 4px;
    padding: 2.5rem;
}

.eyebrow {
    font-family: ui-monospace, "JetBrains Mono", Menlo, monospace;
    font-size: 0.7rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--text-secondary);
    margin-bottom: 0.4rem;
}

.deck-column {
    display: flex;
    flex-direction: column;
}

.playlist-name {
    font-family: Georgia, "Times New Roman", serif;
    font-size: 1.6rem;
    font-weight: 600;
    margin: 0 0 1.75rem 0;
    color: var(--text-color);
}

/* --- Tourne-disque : élément signature --- */
.turntable {
    position: relative;
    width: 220px;
    height: 220px;
    margin: 0 auto 2.5rem auto;
}

.disc {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background:
        repeating-radial-gradient(circle at center, var(--disc-groove) 0px, var(--disc-groove) 2px, var(--disc-groove-dark) 3px, var(--disc-groove-dark) 5px);
    border: 6px solid var(--disc-groove-dark);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.45);
    animation: spin 6s linear infinite;
    animation-play-state: paused;
    position: relative;
    z-index: 0;
}

.disc.spinning {
    animation-play-state: running;
}

.disc-label {
    width: 84px;
    height: 84px;
    border-radius: 50%;
    background: var(--primary-color);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: inset 0 0 0 3px var(--body-color);
}

.disc-index {
    font-family: ui-monospace, "JetBrains Mono", Menlo, monospace;
    font-weight: 700;
    color: var(--body-color);
    font-size: 1.1rem;
}

/* 🔧 Bras + pivot repositionnés pour partager le même point d'ancrage
   (transform-origin: top left ↔ pivot placé au même endroit) */
.tonearm {
    position: absolute;
    top: 18px;
    left: 6px;
    width: 150px;
    height: 5px;
    background: linear-gradient(to left, var(--primary-color), var(--surface-color));
    border-radius: 3px;
    transform-origin: top left;
    transform: rotate(40deg);
    transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 1;
}

.tonearm.resting {
    transform: rotate(-30deg);
}

.tonearm-pivot {
    position: absolute;
    top: 12px;
    /* aligné sur le "top" du bras */
    left: 0px;
    /* aligné sur le "left" du bras, plutôt que "right" */
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: var(--primary-color);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
    z-index: 2;
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

/* --- fin élément signature --- */

.track-info {
    text-align: center;
    margin-bottom: 1.75rem;
}

.track-title {
    font-family: Georgia, "Times New Roman", serif;
    font-size: 1.75rem;
    margin: 0 0 0.25rem 0;
    color: var(--text-color);
}

.track-artist {
    color: var(--text-secondary);
    margin: 0;
    font-size: 1rem;
}

.track-meta {
    font-family: ui-monospace, "JetBrains Mono", Menlo, monospace;
    font-size: 0.75rem;
    color: var(--text-tertiary);
    margin-top: 0.5rem;
}

.transport {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1.25rem;
    margin-bottom: 1.5rem;
}

.transport-btn {
    background: transparent;
    border: 1px solid var(--border-subtle);
    color: var(--text-color);
    width: 42px;
    height: 42px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: border-color 0.2s ease, color 0.2s ease;
}

.transport-btn:hover:not(:disabled) {
    border-color: var(--primary-color);
    color: var(--primary-color);
}

.transport-btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
}

.transport-btn--main {
    width: 54px;
    height: 54px;
    background: var(--primary-color);
    border-color: var(--primary-color);
    color: var(--body-color);
}

.transport-btn--main:hover:not(:disabled) {
    color: var(--body-color);
    opacity: 0.9;
}

.transport-btn:focus-visible {
    outline: 2px solid var(--primary-color);
    outline-offset: 2px;
}

.progress {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.time {
    font-family: ui-monospace, "JetBrains Mono", Menlo, monospace;
    font-size: 0.75rem;
    color: var(--text-tertiary);
    min-width: 2.5rem;
}

.progress-bar {
    flex: 1;
    -webkit-appearance: none;
    appearance: none;
    height: 4px;
    border-radius: 2px;
    background: transparent;
    /* le fond réel est géré par le track ci-dessous */
    cursor: pointer;
    outline: none;
}

/* Chrome / Edge / Safari : la vraie piste */
.progress-bar::-webkit-slider-runnable-track {
    height: 4px;
    border-radius: 2px;
    background: linear-gradient(to right,
            var(--primary-color) 0%,
            var(--primary-color) var(--progress, 0%),
            var(--border-subtle) var(--progress, 0%),
            var(--border-subtle) 100%);
}

.progress-bar::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(53, 178, 224, 0.25);
    cursor: pointer;
    margin-top: -4px;
    /* recentre le thumb sur une piste de 4px */
    transition: transform 0.15s ease;
}

.progress-bar::-webkit-slider-thumb:hover {
    transform: scale(1.2);
}

/* Firefox : la vraie piste */
.progress-bar::-moz-range-track {
    height: 4px;
    border-radius: 2px;
    background: var(--border-subtle);
}

.progress-bar::-moz-range-progress {
    height: 4px;
    border-radius: 2px;
    background: var(--primary-color);
}

.progress-bar::-moz-range-thumb {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: var(--primary-color);
    border: none;
    box-shadow: 0 0 0 3px rgba(53, 178, 224, 0.25);
    cursor: pointer;
    transition: transform 0.15s ease;
}

.progress-bar::-moz-range-thumb:hover {
    transform: scale(1.2);
}

.progress-bar:focus-visible {
    outline: 2px solid var(--primary-color);
    outline-offset: 3px;
}

/* --- File d'attente --- */
.queue-column {
    border-left: 1px solid var(--border-subtle);
    padding-left: 2rem;
    display: flex;
    flex-direction: column;
}

.queue-list {
    list-style: none;
    margin: 0.5rem 0 0 0;
    padding: 0;
    overflow-y: auto;
    max-height: 420px;
}

.queue-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.65rem 0.5rem;
    border-radius: 3px;
    cursor: pointer;
    transition: background 0.15s ease;
}

.queue-item:hover {
    background: var(--surface-hover);
}

.queue-item.active {
    background: var(--surface-active);
}

.queue-item.active .queue-title {
    color: var(--primary-color);
}

.queue-number {
    font-family: ui-monospace, "JetBrains Mono", Menlo, monospace;
    font-size: 0.75rem;
    color: var(--text-tertiary);
    width: 1.5rem;
}

.queue-text {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0;
}

.queue-title {
    font-size: 0.9rem;
    color: var(--text-color);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.queue-artist {
    font-size: 0.75rem;
    color: var(--text-secondary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.queue-duration {
    font-family: ui-monospace, "JetBrains Mono", Menlo, monospace;
    font-size: 0.75rem;
    color: var(--text-tertiary);
}

.queue-playing {
    color: var(--primary-color);
}

/* Responsive */
@media (max-width: 760px) {
    .player-shell {
        grid-template-columns: 1fr;
        padding: 1.5rem;
    }

    .queue-column {
        border-left: none;
        border-top: 1px solid var(--border-subtle);
        padding-left: 0;
        padding-top: 1.5rem;
    }
}

@media (prefers-reduced-motion: reduce) {

    .disc,
    .tonearm {
        animation: none !important;
        transition: none !important;
    }
}
</style>