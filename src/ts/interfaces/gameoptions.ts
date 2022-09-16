export default interface GameOptions {
    fps?: number,
    dotSize?: number,
    periodicBoundaries?: boolean,
    onStart?(): void,
    onStop?(): void
}