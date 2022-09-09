'use strict';

class Dot {
    private size: number;
    private ctx: CanvasRenderingContext2D | null;
    private x: number;
    private y: number;
    private colorActive: string;
    private colorInactive: string;
    public active: boolean;

    constructor(ctx: CanvasRenderingContext2D | null, x: number, y: number, size: number) {
        this.size = size;
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.colorActive = getComputedStyle(document.documentElement).getPropertyValue('--dot-color');
        this.colorInactive = getComputedStyle(document.documentElement).getPropertyValue('--dot-color-inactive');
        this.active = Math.random() > 0.7 ? true : false;
    }

    draw(): void {
        if (this.ctx) {
            this.ctx.fillStyle = this.active ? this.colorActive : this.colorInactive;
            this.ctx.fillRect(this.x, this.y, this.size, this.size);
        }
    }

    clone() {
        let newDot: Dot = new Dot(this.ctx, this.x, this.y, this.size);
        newDot.active = this.active;
        return newDot;
    }
}

export default Dot;