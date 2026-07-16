export const dateUtils = {
    convertTimeToSeconds(time: string): number {
        if (!time) return 0;

        const [hours=0, minutes=0, seconds = 0] = time.split(":").map(Number);

        return hours  * 3600 + minutes  * 60 + seconds;
    }
}