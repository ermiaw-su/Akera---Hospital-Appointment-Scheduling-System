const WINDOW = 60 * 1000; // 1 minute
const MAX = 5

const map = new Map<string, {count: number, time: number}>();

export function rateLimit(ip: string) {
    const now = Date.now();
    const data = map.get(ip)

    if(!data) {
        map.set(ip, {count: 1, time: now});
        return true;
    }

    if (now - data.time > WINDOW) {
        map.set(ip, {count: 1, time: now})
        return true;
    }

    if (data.count >= MAX) return false
    
    data.count++;
    map.set(ip, data)
    return true
}