import { CONFIG } from "./config.js";
import { Input } from "./input.js";
import { clamp, distance } from "./utils.js";

export class Player {

    constructor() {
        this.x = 500;
        this.y = 300;

        this.health = CONFIG.player.maxHealth;
        this.maxHealth = CONFIG.player.maxHealth;

        this.gold = 0;
        this.level = 1;
        this.xp = 0;

        this.cooldown = 0;
    }

    update(dt, enemies) {

        if (Input.down("w")) this.y -= CONFIG.player.speed;
        if (Input.down("s")) this.y += CONFIG.player.speed;
        if (Input.down("a")) this.x -= CONFIG.player.speed;
        if (Input.down("d")) this.x += CONFIG.player.speed;

        this.x = clamp(this.x, 0, CONFIG.worldWidth);
        this.y = clamp(this.y, 0, CONFIG.worldHeight);

        if (this.cooldown > 0) this.cooldown -= dt;

        if (Input.mouseDown && this.cooldown <= 0) {
            enemies.forEach(e => {
                if (distance(this, e) < CONFIG.player.range) {
                    e.health -= CONFIG.player.damage;
                    e.flash = 0.1;
                }
            });

            this.cooldown = CONFIG.player.cooldown;
        }

        if (this.health <= 0) {
            document.getElementById("gameOverScreen")
                .classList.remove("hidden");
        }
    }

    draw(ctx) {
        ctx.fillStyle = "lime";
        ctx.fillRect(this.x - 10, this.y - 10, 20, 20);
    }
}
