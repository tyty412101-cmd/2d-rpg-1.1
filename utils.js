export function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
}

export function distance(a, b) {
    return Math.hypot(a.x - b.x, a.y - b.y);
}

export function normalize(dx, dy) {
    const mag = Math.hypot(dx, dy) || 1;
    return { x: dx / mag, y: dy / mag };
}
