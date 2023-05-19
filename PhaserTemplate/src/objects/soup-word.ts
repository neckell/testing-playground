/// <reference path='../phaser.d.ts'/>

import { SoupScene } from '../scenes/soup-scene';

export class SoupWord {
    private x0: number; private x1: number;
    private y0: number; private y1: number;
    private index: number;
    private text: string;

    private word: Phaser.GameObjects.BitmapText;

    constructor(scene: SoupScene, index: number) {
        this.index = index;

        this.word = scene.add.bitmapText(805, 135 + 22 * index, 'arial-rounded', 'Ejemplo ' + index, 16);

        this.word.tint = 0x3f3f3f;
    }

    public setAnswer(text: string, x0: number, x1: number,
        y0: number, y1: number) {

        this.text = text;
        this.x0 = x0; this.x1 = x1;
        this.y0 = y0; this.y1 = y1;

        this.word.text = text.charAt(0);
        for (let i = 0; i < text.length - 2; i++)
            this.word.text += ' _';
        this.word.text += ' ' + text.charAt(text.length - 1);
    }

    public setActive() {
        this.word.tint = 0x7bb02a;
    }

    public isSolved(x0: number, x1: number, y0: number, y1: number): boolean {
        if ((x0 == this.x0 && x1 == this.x1 && y0 == this.y0 && y1 == this.y1)
            || x0 == this.x1 && x1 == this.x0 && y0 == this.y1 && y1 == this.y0) {
            this.word.text = this.text;
            return true;
        }

        return false;
    }
}