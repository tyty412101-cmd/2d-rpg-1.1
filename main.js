import { CONFIG } from "./config.js";
import { Input } from "./input.js";
import { Player } from "./player.js";
import { createEnemy, updateEnemies, drawEnemies } from "./enemy.js";
import { items, updateItems } from "./items.js";
import { World } from "./world.js";
import { Camera } from "./camera.js";
import { updateUI } from "./ui.js";
import { startEngine } from "./engine.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

Input.init();

const player = new Player();
const enemies = [];

// spawn enemies
for (let i = 0; i < CONFIG.enemy.count; i++) {
    enemies.push(createEnemy(
        Math.random() * CONFIG.worldWidth,
        Math.random() * CONFIG.worldHeight
    ));
}

function update(dt) {
    player.update(dt, enemies);
    updateEnemies(enemies, player, dt);
    updateItems(player);
    Camera.update(player, canvas);
    updateUI(player, enemies, items);
}

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    Camera.apply(ctx);
    World.draw(ctx);
    player.draw(ctx);
    drawEnemies(ctx, enemies);
    Camera.reset(ctx);
}

document.getElementById("startBtn").onclick = () => {
    document.getElementById("startScreen").style.display = "none";
    startEngine(update, render);
};
