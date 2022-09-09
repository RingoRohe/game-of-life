"use strict";

import Game from './Game';

function initialize() {
    const canvas: HTMLCanvasElement = <HTMLCanvasElement>document.querySelector('#gameboard');

    // take current size of Canvas and setting it hard in case it was a % or VW or ...
    canvas.style.width = canvas.offsetWidth + 'px';
    canvas.style.height = canvas.offsetHeight + 'px';
    canvas.setAttribute('width', canvas.offsetWidth.toString());
    canvas.setAttribute('height', canvas.offsetHeight.toString());

    const game: Game = new Game(canvas, { periodicBoundaries: false });

    document.querySelector('header > h1')?.addEventListener('click', e => {
        if (game.running) {
            game.stop();
        } else {
            game.start();
        }
    })
}

window.addEventListener("load", () => {
    initialize();
});

