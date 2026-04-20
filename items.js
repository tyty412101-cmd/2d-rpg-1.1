export const items = [];

export function dropItem(x, y) {
    items.push({
        x,
        y,
        type: Math.random() < 0.5 ? "gold" : "health",
        value: 20
    });
}

export function updateItems(player) {
    items.forEach((item, i) => {
        const dist = Math.hypot(player.x - item.x, player.y - item.y);

        if (dist < 25) {
            if (item.type === "gold") {
                player.gold += item.value;
            } else {
                player.health = Math.min(player.maxHealth, player.health + item.value);
            }

            items.splice(i, 1);
        }
    });
}
