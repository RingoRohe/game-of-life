'use strict';

class Dot {
    public static size: number = 20;
    private ctx: CanvasRenderingContext2D | null;
    private x: number;
    private y: number;
    public active: boolean;


    constructor(ctx: CanvasRenderingContext2D | null, x: number, y: number) {
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.active = Math.random() > 0.7 ? true : false;
    }

    draw(): void {
        if (this.ctx) {
            this.ctx.fillStyle = this.active ? '#ff0000ff' : '#ff000055';
            this.ctx.fillRect(this.x, this.y, Dot.size, Dot.size);
        }
    }

    clone() {
        let newDot: Dot = new Dot(this.ctx, this.x, this.y);
        newDot.active = this.active;
        return newDot;
    }
}

export default Dot;