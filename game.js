// ===============================
// CORE ENGINE SETUP
// ===============================
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// ===============================
// GAME CONFIG
// ===============================
const CONFIG = {
    width: canvas.width,
    height: canvas.height,
    maxFPS: 60
};

// ===============================
// GLOBAL GAME STATE
// ===============================
const GAME = {
    running: true,
    paused: false,
    lastTime: 0,
    deltaTime: 0,
    fps: 0
};

// ===============================
// INPUT SYSTEM
// ===============================
const Input = {
    keys: {},

    init() {
        window.addEventListener("keydown", (e) => {
            this.keys[e.key.toLowerCase()] = true;

            if (e.key === "Escape") {
                GAME.paused = !GAME.paused;
                UI.togglePause(GAME.paused);
            }
        });

        window.addEventListener("keyup", (e) => {
            this.keys[e.key.toLowerCase()] = false;
        });
    },

    isDown(key) {
        return this.keys[key];
    }
};

// ===============================
// PLAYER SYSTEM
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

    update(dt) {
        // Movement input
        if (Input.isDown("w") || Input.isDown("arrowup")) this.velY -= this.accel;
        if (Input.isDown("s") || Input.isDown("arrowdown")) this.velY += this.accel;
        if (Input.isDown("a") || Input.isDown("arrowleft")) this.velX -= this.accel;
        if (Input.isDown("d") || Input.isDown("arrowright")) this.velX += this.accel;

        // Apply friction
        this.velX *= this.friction;
        this.velY *= this.friction;

        // Clamp speed
        this.velX = Math.max(-this.maxSpeed, Math.min(this.maxSpeed, this.velX));
        this.velY = Math.max(-this.maxSpeed, Math.min(this.maxSpeed, this.velY));

        // Apply movement (delta time adjusted)
        this.x += this.velX * dt * 60;
        this.y += this.velY * dt * 60;

        // Boundary check
        this.x = Math.max(0, Math.min(CONFIG.width, this.x));
        this.y = Math.max(0, Math.min(CONFIG.height, this.y));
    },

    draw() {
        ctx.fillStyle = "lime";
        ctx.fillRect(
            this.x - this.size / 2,
            this.y - this.size / 2,
            this.size,
            this.size
        );
    }
};

// ===============================
// CAMERA SYSTEM (FOLLOW PLAYER)
// ===============================
const Camera = {
    x: 0,
    y: 0,

    update() {
        this.x = Player.x - CONFIG.width / 2;
        this.y = Player.y - CONFIG.height / 2;
    },

    apply() {
        ctx.setTransform(1, 0, 0, 1, -this.x, -this.y);
    },

    reset() {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
};

// ===============================
// WORLD SYSTEM
// ===============================
const World = {
    width: 2000,
    height: 2000,

    draw() {
        ctx.fillStyle = "#222";
        ctx.fillRect(0, 0, this.width, this.height);

        // Grid
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
    }
};

// ===============================
// UI SYSTEM
// ===============================
const UI = {
    healthBar: document.getElementById("healthFill"),
    fpsText: document.getElementById("fps"),
    posText: document.getElementById("pos"),
    pauseScreen: document.getElementById("pauseScreen"),

    update() {
        this.healthBar.style.width =
            (Player.health / Player.maxHealth) * 100 + "%";

        this.posText.textContent =
            Math.round(Player.x) + ", " + Math.round(Player.y);

        this.fpsText.textContent = GAME.fps;
    },

    togglePause(state) {
        if (state) {
            this.pauseScreen.classList.remove("hidden");
        } else {
            this.pauseScreen.classList.add("hidden");
        }
    }
};

// ===============================
// DEBUG SYSTEM
// ===============================
const Debug = {
    enabled: true,

    draw() {
        if (!this.enabled) return;

        ctx.fillStyle = "red";
        ctx.fillRect(Player.x - 2, Player.y - 2, 4, 4);
    }
};

// ===============================
// GAME LOOP
// ===============================
function gameLoop(timestamp) {

    if (!GAME.running) return;

    // Delta time
    GAME.deltaTime = (timestamp - GAME.lastTime) / 1000;
    GAME.lastTime = timestamp;

    // FPS
    GAME.fps = Math.round(1 / GAME.deltaTime);

    if (!GAME.paused) {
        update(GAME.deltaTime);
        render();
    }

    requestAnimationFrame(gameLoop);
}

// ===============================
// UPDATE
// ===============================
function update(dt) {
    Player.update(dt);
    Camera.update();
    UI.update();
}

// ===============================
// RENDER
// ===============================
function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    Camera.apply();

    World.draw();
    Player.draw();
    Debug.draw();

    Camera.reset();
}

// ===============================
// INITIALIZE
// ===============================
function init() {
    Input.init();
    requestAnimationFrame(gameLoop);
}

init();
