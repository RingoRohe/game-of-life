"use strict";

import Game from './Game';
import GameOptions from './interfaces/gameoptions';

function initialize() {
    const body: HTMLBodyElement = <HTMLBodyElement>document.querySelector('body');
    const canvas: HTMLCanvasElement = <HTMLCanvasElement>document.querySelector('#gameboard');

    // take current size of Canvas and setting it hard in case it was a % or VW or ...
    canvas.style.width = canvas.offsetWidth + 'px';
    canvas.style.height = canvas.offsetHeight + 'px';
    canvas.setAttribute('width', canvas.offsetWidth.toString());
    canvas.setAttribute('height', canvas.offsetHeight.toString());

    let options: GameOptions = {
        periodicBoundaries: false,
        onStart: () => {
            body.classList.add('running');
        },
        onStop: () => {
            body.classList.remove('running');
        }
    }

    let game: Game = new Game(canvas, options);

    document.querySelector('.controls .play')?.addEventListener('click', e => {
        if (!game.running) {
            game.start();
        }
    })
    document.querySelector('.controls .stop')?.addEventListener('click', e => {
        if (game.running) {
            game.stop();
        }
    })
    document.querySelector('.controls .clear')?.addEventListener('click', e => {
        game.clear();
    })
    document.querySelector('.controls .settings')?.addEventListener('click', e => {
        const settingsDiv = document.querySelector('#settings');
        settingsDiv?.classList.toggle('active');
    })
    document.querySelector('#input_dot-size')?.addEventListener('change', e => {
        // @ts-ignore
        game.dotSize = e.target?.value;
    });
    document.querySelector('#input_periodic-boundaries')?.addEventListener('change', e => {
        // @ts-ignore
        game.periodicBoundaries = e.target?.checked;
    });
    document.querySelector('#input_speed')?.addEventListener('change', e => {
        // @ts-ignore
        game.fps = e.target?.value;
    });
}

window.addEventListener("load", () => {
    initialize();
});

