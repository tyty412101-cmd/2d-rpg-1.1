export const Input = {
    keys: {},
    mouseDown: false,

    init() {
        window.addEventListener("keydown", e => {
            this.keys[e.key.toLowerCase()] = true;

            if (e.key === "Escape") {
                document.getElementById("pauseScreen")
                    .classList.toggle("hidden");
            }
        });

        window.addEventListener("keyup", e => {
            this.keys[e.key.toLowerCase()] = false;
        });

        window.addEventListener("mousedown", () => this.mouseDown = true);
        window.addEventListener("mouseup", () => this.mouseDown = false);
    },

    down(k) {
        return !!this.keys[k];
    }
};
