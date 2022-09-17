import GameOptions from './interfaces/gameoptions';
import Dot from './models/Dot';


const defaultOptions: GameOptions = {
    fps: 4,
    periodicBoundaries: true,
    dotSize: 20
}

export default class Game {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D | null;
    private width: number;
    private height: number;
    private dots: Dot[][] = [];
    private iterations: number;
    private textColor: string;
    private options: GameOptions;

    public running: boolean;

    constructor(canvas: HTMLCanvasElement, options?: GameOptions) {
        this.iterations = 0;
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = canvas.offsetWidth;
        this.height = canvas.offsetHeight;
        this.textColor = getComputedStyle(document.documentElement).getPropertyValue('--gameboard-text');
        this.running = false;

        this.options = { ...defaultOptions, ...options };

        this.initialize();
    }

    get dotSize(): number {
        // @ts-ignore
        return this.options.dotSize || defaultOptions.dotSize;
    }

    set dotSize(value: number) {
        this.unload()
        this.options.dotSize = value;
        this.initialize();
    }

    get periodicBoundaries(): boolean {
        // @ts-ignore
        return this.options.periodicBoundaries || defaultOptions.periodicBoundaries;
    }

    set periodicBoundaries(value: boolean) {
        this.options.periodicBoundaries = value;
    }

    get fps(): number {
        // @ts-ignore
        return this.options.fps || defaultOptions.fps;
    }

    set fps(value: number) {
        this.options.fps = value;
    }

    initialize(): void {
        const numHorizontally = Math.floor(this.width / this.options.dotSize!);
        const numVertically = Math.floor(this.height / this.options.dotSize!);
        const offsetX: number = Math.floor((this.width - (numHorizontally * this.options.dotSize!)) / 2);
        const offsetY: number = Math.floor((this.height - (numVertically * this.options.dotSize!)) / 2);

        console.log('canvas', `${this.width} x ${this.height}`);
        console.log('grid', `${numHorizontally} x ${numVertically}`);

        this.dots = [];
        for (let i = 0; i < numVertically; i++) {
            this.dots[i] = [];
            for (let j = 0; j < numHorizontally; j++) {
                this.dots[i][j] = new Dot(this.ctx, offsetX + (this.options.dotSize! * j), offsetY + (this.options.dotSize! * i), this.options.dotSize!);
            }
        }

        this.draw();

        this.canvas.addEventListener('click', e => {
            this.iterations = 0;
            let i = Math.floor((e.offsetY - offsetY) / this.options.dotSize!);
            let j = Math.floor((e.offsetX - offsetX) / this.options.dotSize!);
            this.dots[i][j].active = !this.dots[i][j].active;
            this.draw();
        });
    }

    unload(): void {
        this.stop();
        this.iterations = 0;
        this.canvas.removeEventListener('click', e => { });
    }

    clear(): void {
        this.dots.forEach((row: Dot[], i) => {
            row.forEach((dot: Dot, j) => {
                dot.active = false;
            });
        });
        this.iterations = 0;
        this.draw();
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
        this.iterations++;
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

                if (
                    !this.options.periodicBoundaries &&
                    (
                        (x === 0 && i < 0) ||
                        (x === this.dots.length - 1 && i > 0) ||
                        (y === 0 && j < 0) ||
                        (y === this.dots[x].length - 1 && j > 0)
                    )
                ) {
                    continue;
                } else {
                    numNeighbours += this.dots[x2 + i][y2 + j].active ? 1 : 0;
                }
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

        if (this.ctx) {
            this.ctx.fillStyle = this.textColor;
            this.ctx.font = '14px Arial';
            this.ctx.textAlign = 'right';
            this.ctx.textBaseline = 'bottom';
            this.ctx?.fillText(this.iterations.toString(), this.width - 10, this.height - 10);
        }
    }

    start(): void {
        this.running = true;
        this.animate();
        if (this.options.onStart) {
            this.options.onStart!();
        }
    }

    stop(): void {
        this.running = false;
        if (this.options.onStop) {
            this.options.onStop();
        }
    }

    animate(): void {
        console.log('animating');
        this.iterate();
        setTimeout(() => {
            if (this.running) {
                requestAnimationFrame(() => { this.animate(); });
            }
        }, 1000 / this.options.fps!);
    }
}