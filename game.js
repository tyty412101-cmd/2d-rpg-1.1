// ===============================
// CANVAS SETUP
// ===============================
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// ===============================
// GAME STATE
// ===============================
const GAME = {
    paused: false,
    lastTime: 0,
    deltaTime: 0
};

// ===============================
// INPUT SYSTEM
// ===============================
const Input = {
    keys: {},
    mouse: { clicked: false },

    init() {
        window.addEventListener("keydown", e => {
            this.keys[e.key.toLowerCase()] = true;

            if (e.key === "Escape") {
                GAME.paused = !GAME.paused;
                document.getElementById("pauseScreen")
                    .classList.toggle("hidden", !GAME.paused);
            }
        });

        window.addEventListener("keyup", e => {
            this.keys[e.key.toLowerCase()] = false;
        });

        window.addEventListener("mousedown", () => {
            this.mouse.clicked = true;
        });

        window.addEventListener("mouseup", () => {
            this.mouse.clicked = false;
        });
    },

    down(key) {
        return this.keys[key];
    }
};

// ===============================
// WORLD
// ===============================
const World = {
    width: 3000,
    height: 3000,
    tiles: [],

    generate() {
        for (let i = 0; i < 100; i++) {
            this.tiles.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                size: 40
            });
        }
    },

    draw() {
        ctx.fillStyle = "#222";
        ctx.fillRect(0, 0, this.width, this.height);

        ctx.strokeStyle = "#333";
        for (let x = 0; x < this.width; x += 50) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, this.height);
            ctx.stroke();
        }

        for (let y = 0; y < this.height; y += 50) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(this.width, y);
            ctx.stroke();
        }

        ctx.fillStyle = "#555";
        this.tiles.forEach(t => {
            ctx.fillRect(t.x, t.y, t.size, t.size);
        });
    }
};

// ===============================
// PLAYER
// ===============================
const Player = {
    x: 500,
    y: 300,
    size: 20,

    velX: 0,
    velY: 0,

    accel: 0.6,
    friction: 0.85,
    maxSpeed: 5,

    health: 100,
    maxHealth: 100,

    xp: 0,
    level: 1,

    inventory: {
        gold: 0,
        items: []
    },

    attackCooldown: 0,

    update(dt) {

        // Movement
        if (Input.down("w")) this.velY -= this.accel;
        if (Input.down("s")) this.velY += this.accel;
        if (Input.down("a")) this.velX -= this.accel;
        if (Input.down("d")) this.velX += this.accel;

        this.velX *= this.friction;
        this.velY *= this.friction;

        this.x += this.velX * dt * 60;
        this.y += this.velY * dt * 60;

        this.x = Math.max(0, Math.min(World.width, this.x));
        this.y = Math.max(0, Math.min(World.height, this.y));

        // Attack cooldown
        if (this.attackCooldown > 0) this.attackCooldown -= dt;

        if (Input.mouse.clicked && this.attackCooldown <= 0) {
            this.attack();
            this.attackCooldown = 0.3;
        }
    },

    attack() {
        enemies.forEach(e => {
            const dist = Math.hypot(e.x - this.x, e.y - this.y);
            if (dist < 60) {
                e.health -= 25;
            }
        });
    },

    gainXP(amount) {
        this.xp += amount;

        if (this.xp >= this.level * 50) {
            this.xp = 0;
            this.level++;
            this.maxHealth += 10;
            this.health = this.maxHealth;
        }
    },

    draw() {
        ctx.fillStyle = "lime";
        ctx.fillRect(this.x - 10, this.y - 10, 20, 20);
    }
};

// ===============================
// ENEMIES
// ===============================
const enemies = [];

function spawnEnemy() {
    enemies.push({
        x: Math.random() * World.width,
        y: Math.random() * World.height,
        size: 18,
        speed: 1 + Math.random(),
        health: 50,
        damage: 10,
        attackCooldown: 0
    });
}

for (let i = 0; i < 10; i++) spawnEnemy();

// ===============================
// ITEMS
// ===============================
const items = [];

function dropLoot(x, y) {
    items.push({
        x,
        y,
        type: Math.random() < 0.5 ? "health" : "gold",
        value: 20
    });
}

// ===============================
// UPDATE SYSTEMS
// ===============================
function updateEnemies(dt) {
    enemies.forEach((e, i) => {

        const dx = Player.x - e.x;
        const dy = Player.y - e.y;
        const dist = Math.hypot(dx, dy);

        if (dist > 5) {
            e.x += (dx / dist) * e.speed;
            e.y += (dy / dist) * e.speed;
        }

        if (dist < 25 && e.attackCooldown <= 0) {
            Player.health -= e.damage;
            e.attackCooldown = 1;
        }

        if (e.attackCooldown > 0) e.attackCooldown -= dt;

        if (e.health <= 0) {
            dropLoot(e.x, e.y);
            Player.gainXP(20);
            enemies.splice(i, 1);
            spawnEnemy();
        }
    });
}

function updateItems() {
    items.forEach((item, i) => {
        const dist = Math.hypot(Player.x - item.x, Player.y - item.y);

        if (dist < 25) {
            if (item.type === "health") {
                Player.health = Math.min(Player.maxHealth, Player.health + item.value);
            } else {
                Player.inventory.gold += item.value;
            }
            items.splice(i, 1);
        }
    });
}

// ===============================
// CAMERA
// ===============================
const Camera = {
    x: 0,
    y: 0,

    update() {
        this.x = Player.x - canvas.width / 2;
        this.y = Player.y - canvas.height / 2;
    },

    apply() {
        ctx.setTransform(1, 0, 0, 1, -this.x, -this.y);
    },

    reset() {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
};

// ===============================
// DRAW
// ===============================
function drawEnemies() {
    enemies.forEach(e => {
        ctx.fillStyle = "red";
        ctx.fillRect(e.x - 9, e.y - 9, 18, 18);
    });
}

function drawItems() {
    items.forEach(i => {
        ctx.fillStyle = i.type === "health" ? "yellow" : "gold";
        ctx.beginPath();
        ctx.arc(i.x, i.y, 8, 0, Math.PI * 2);
        ctx.fill();
    });
}

// ===============================
// UI
// ===============================
function updateUI() {
    document.getElementById("healthFill").style.width =
        (Player.health / Player.maxHealth) * 100 + "%";

    document.getElementById("inventory").textContent =
        `🎒 Gold: ${Player.inventory.gold} | Level: ${Player.level}`;
}

// ===============================
// LOOP
// ===============================
function gameLoop(time) {
    GAME.deltaTime = (time - GAME.lastTime) / 1000;
    GAME.lastTime = time;

    if (!GAME.paused) {
        update(GAME.deltaTime);
        render();
    }

    requestAnimationFrame(gameLoop);
}

function update(dt) {
    Player.update(dt);
    updateEnemies(dt);
    updateItems();
    Camera.update();
    updateUI();
}

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    Camera.apply();
    World.draw();
    drawItems();
    Player.draw();
    drawEnemies();
    Camera.reset();
}

// ===============================
// START
// ===============================
Input.init();
World.generate();
requestAnimationFrame(gameLoop);
