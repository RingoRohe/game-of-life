import Dot from './models/Dot';

export default class Game {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D | null;
    private width: number;
    private height: number;
    private dots: Dot[][] = [];
    private fps: number;

    public running: boolean;

    constructor(canvas: HTMLCanvasElement) {
        this.fps = 4;
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = canvas.offsetWidth;
        this.height = canvas.offsetHeight;
        this.running = false;

        this.initialize();
    }

    initialize(): void {
        const numHorizontally = Math.floor(this.width / Dot.size);
        const numVertically = Math.floor(this.height / Dot.size);
        const offsetX: number = Math.floor((this.width - (numHorizontally * Dot.size)) / 2);
        const offsetY: number = Math.floor((this.height - (numVertically * Dot.size)) / 2);

        console.log('canvas', `${this.width} x ${this.height}`);
        console.log('grid', `${numHorizontally} x ${numVertically}`);

        for (let i = 0; i < numVertically; i++) {
            this.dots[i] = [];
            for (let j = 0; j < numHorizontally; j++) {
                this.dots[i][j] = new Dot(this.ctx, offsetX + (Dot.size * j), offsetY + (Dot.size * i));
                this.dots[i][j].draw();
            }
        }
    }

    iterate(): void {
        let newDots: Dot[][] = [];

        this.dots.forEach((row: Dot[], i) => {
            newDots[i] = [];
            row.forEach((dot: Dot, j) => {
                let numNeighbours: number = this.countNeighbours(i, j);
                let newDot = dot.clone();
                newDot.active = false;

                if (dot.active) {
                    if (numNeighbours === 2 || numNeighbours === 3) {
                        newDot.active = true;
                    }
                } else {
                    if (numNeighbours === 3) {
                        newDot.active = true;
                    }
                }

                newDots[i][j] = newDot;
            });
        });

        this.dots = newDots;

        this.draw();
    }

    countNeighbours(x: number, y: number): number {
        let numNeighbours = 0;
        let x2 = 0;
        let y2 = 0;

        for (let i = -1; i < 2; i++) {
            for (let j = -1; j < 2; j++) {
                x2 = x;
                y2 = y;
                if (x === 0 && i < 0) {
                    x2 = this.dots.length;
                }
                if (x === this.dots.length - 1 && i > 0) {
                    x2 = -1;
                }
                if (y === 0 && j < 0) {
                    y2 = this.dots[x].length;
                }
                if (y === this.dots[x].length - 1 && j > 0) {
                    y2 = -1;
                }
                numNeighbours += this.dots[x2 + i][y2 + j].active ? 1 : 0;
            }
        }

        numNeighbours -= this.dots[x][y].active ? 1 : 0;

        return numNeighbours;
    }

    draw() {
        this.ctx?.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.dots.forEach((row: Dot[]) => {
            row.forEach((dot: Dot) => {
                dot.draw();
            });
        });
    }

    start(): void {
        this.running = true;
        this.animate();
    }

    stop(): void {
        this.running = false;
    }

    animate(): void {
        console.log('animating');
        this.iterate();
        setTimeout(() => {
            if (this.running) {
                requestAnimationFrame(() => { this.animate(); });
            }
        }, 1000 / this.fps);
    }
}