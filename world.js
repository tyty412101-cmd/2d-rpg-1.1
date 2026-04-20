import { CONFIG } from "./config.js";

export const World = {
    draw(ctx) {
        ctx.fillStyle = "#222";
        ctx.fillRect(0, 0, CONFIG.worldWidth, CONFIG.worldHeight);

        ctx.strokeStyle = "#333";

        for (let x = 0; x < CONFIG.worldWidth; x += 50) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, CONFIG.worldHeight);
            ctx.stroke();
        }

        for (let y = 0; y < CONFIG.worldHeight; y += 50) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(CONFIG.worldWidth, y);
            ctx.stroke();
        }
    }
};
