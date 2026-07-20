export function useDurationConverter() {
    function convertInSeconds(hhmmss: string): number {
        const [h, m, s] = hhmmss.split(':').map(Number)
        return h! * 3600 + m! * 60 + s!
    }

    function convertInHHMMSS(secondes: number): string {
        const h = Math.floor(secondes / 3600)
        const m = Math.floor((secondes % 3600) / 60)
        const s = secondes % 60
        return [h, m, s].map(n => String(n).padStart(2, '0')).join(':')
    }
    return {
        convertInSeconds,
        convertInHHMMSS
    }
}