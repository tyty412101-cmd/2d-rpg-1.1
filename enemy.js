import { CONFIG } from "./config.js";
import { distance, normalize } from "./utils.js";

export function createEnemy(x, y) {
    return {
        x,
        y,
        health: CONFIG.enemy.health,
        speed: CONFIG.enemy.speed,
        damage: CONFIG.enemy.damage,
        cooldown: 0,
        flash: 0
    };
}

export function updateEnemies(enemies, player, dt) {

    enemies.forEach((e, i) => {

        const dist = distance(e, player);

        if (dist < CONFIG.enemy.detection) {
            const dir = normalize(player.x - e.x, player.y - e.y);
            e.x += dir.x * e.speed;
            e.y += dir.y * e.speed;
        }

        if (dist < 25 && e.cooldown <= 0) {
            player.health -= e.damage;
            e.cooldown = 1;
        }

        if (e.cooldown > 0) e.cooldown -= dt;
        if (e.flash > 0) e.flash -= dt;

        if (e.health <= 0) {
            enemies.splice(i, 1);
        }
    });
}

export function drawEnemies(ctx, enemies) {
    enemies.forEach(e => {
        ctx.fillStyle = e.flash > 0 ? "white" : "red";
        ctx.fillRect(e.x - 10, e.y - 10, 20, 20);
    });
}
