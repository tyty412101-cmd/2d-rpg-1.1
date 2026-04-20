export function updateUI(player, enemies, items) {

    document.getElementById("healthFill").style.width =
        (player.health / player.maxHealth) * 100 + "%";

    document.getElementById("statsText").textContent =
        `Level ${player.level} | XP ${player.xp}`;

    document.getElementById("inventoryText").textContent =
        `Gold: ${player.gold}`;

    document.getElementById("enemyCount").textContent =
        enemies.length;

    document.getElementById("itemCount").textContent =
        items.length;
}
