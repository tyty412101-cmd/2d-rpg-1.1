export const Camera = {
    x: 0,
    y: 0,

    update(player, canvas) {
        this.x += (player.x - canvas.width / 2 - this.x) * 0.1;
        this.y += (player.y - canvas.height / 2 - this.y) * 0.1;
    },

    apply(ctx) {
        ctx.setTransform(1, 0, 0, 1, -this.x, -this.y);
    },

    reset(ctx) {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
};
