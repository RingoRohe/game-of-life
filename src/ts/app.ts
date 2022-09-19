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

    const inputDotSize = (<HTMLInputElement>document.querySelector('#input_dot-size'));
    const inputPeriodicBoundaries = (<HTMLInputElement>document.querySelector('#input_periodic-boundaries'));
    const inputSpeed = (<HTMLInputElement>document.querySelector('#input_speed'));

    let options: GameOptions = {
        dotSize: Number(inputDotSize.value),
        periodicBoundaries: inputPeriodicBoundaries.checked,
        fps: Number(inputSpeed.value),
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

    inputDotSize.addEventListener('change', e => {
        // @ts-ignore
        game.dotSize = e.target?.value;
    });
    inputPeriodicBoundaries.addEventListener('change', e => {
        // @ts-ignore
        game.periodicBoundaries = e.target?.checked;
    });
    inputSpeed.addEventListener('change', e => {
        // @ts-ignore
        game.fps = e.target?.value;
    });
}

window.addEventListener("load", () => {
    initialize();
});

