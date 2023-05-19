/// <reference path='../phaser.d.ts'/>

import { TextImageButton, ImageButton } from '../objects/button';
import { SoupWord } from '../objects/soup-word';

enum SoupState {
    INIT,
    GAME,
    END
}

const TILE_SIZE = 24;

const COLORS = [0x50bc76, 0x3eddd1, 0x5a1cd3, 0x1423e0, 0xd8c51d,
    0x57e044, 0xea6744, 0xdd1b1b, 0x2356c9, 0xedd732, 0xca40e2,
    0x21cace, 0x7acc32
]

export class SoupScene extends Phaser.Scene {
    // state machine
    private state: SoupState;

    // selected word
    private selected: number;

    // starting point
    private firstPoint: Phaser.Geom.Point;
    private selector: Phaser.GameObjects.Image;

    private nextButton: ImageButton;

    // lista de palabras
    private words: Array<SoupWord>;
    private questionNumber: Phaser.GameObjects.BitmapText;
    private question: Phaser.GameObjects.BitmapText;

    // // debugger
    // private debug: Phaser.GameObjects.Graphics;
    // private startDebug(): void {
    //     this.debug = this.add.graphics().fillStyle(0xff0000);
    // }

    constructor(level: number) {
        super({
            key: "SoupScene"
        });
    }

    preload(): void {
        // load assets needed to build the loading screen
        this.load.image('soup', './bin/assets/soup/soup.png');
        this.load.image('soup-bar', './bin/assets/soup/selector.png');
    }

    create(): void {
        this.add.image(0, 0, 'background').setOrigin(0, 0);
        this.add.image(768, 11, 'right-note').setOrigin(0, 0);
        this.add.image(0, 0, 'note-background').setOrigin(0, 0);
        this.add.image(305, 164, 'soup').setOrigin(0, 0);

        this.selector = this.add.image(0, 0, 'soup-bar')
            .setVisible(false).setTint(0x8AFF64);

        this.words = new Array<SoupWord>(13);
        for (let i = 0; i < this.words.length; i++) {
            this.words[i] = new SoupWord(this, i);
        }

        this.words[0].setAnswer('PREVENCION', 4, 4, 12 - 12, 12 - 3);
        this.words[1].setAnswer('LAVANDINA', 0, 8, 12 - 3, 12 - 11);
        this.words[2].setAnswer('CELULAR', 5, 11, 12 - 1, 12 - 1);
        this.words[3].setAnswer('ORDENAR', 12, 12, 12 - 7, 12 - 1);
        this.words[4].setAnswer('SEMAFORO', 0, 0, 12 - 12, 12 - 5);
        this.words[5].setAnswer('REPARAR', 6, 12, 12 - 12, 12 - 6);
        this.words[6].setAnswer('QUEMADURA', 3, 11, 11, 3);
        this.words[7].setAnswer('VENENO', 1, 6, 7, 2);
        this.words[8].setAnswer('CASCO', 0, 4, 12 - 4, 12 - 4);
        this.words[9].setAnswer('INFLAMABLE', 3, 12, 12, 3);
        this.words[10].setAnswer('BOMBERO', 5, 11, 12 - 4, 12 - 10);
        this.words[11].setAnswer('GASISTA', 0, 6, 12 - 0, 12 - 0);
        this.words[12].setAnswer('ESPALDA', 4, 10, 12 - 8, 12 - 2);

        // load questions;
        this.questionNumber = this.add.bitmapText(261, 95, 'arial-rounded', '', 38).setTint(0x252525);
        this.question = this.add.bitmapText(298, 110, 'arial-rounded', '', 20).setTint(0x252525);

        // back button
        new TextImageButton(this, 854, 488, 'button-idle', 'button-hover',
            () => this.backCallback());

        this.input.on('pointerdown', () => this.onDown());
        this.input.on('pointerup', () => this.onUp());

        this.playFadeEnterAnimation();

        this.state = SoupState.GAME;
        this.selected = 0;
        this.loadSelected();
    }

    private loadSelected() {
        this.words[this.selected].setActive();

        this.questionNumber.text = (this.selected + 1) + ')';
        if (this.selected > 8) {
            this.questionNumber.x = 261 - 20;
        } else {
            this.questionNumber.x = 261;
        }
        switch (this.selected) {
            case 0: this.question.text = 'Evita accidentes y enfermedades.'; break;
            case 1: this.question.text = 'Sirve para limpiar y desinfectar. Siempre hay \nque guardarla en un lugar seguro.'; break;
            case 2: this.question.text = 'Se usa para hablar y sacar fotos, pero nunca \ncaminando.'; break;
            case 3: this.question.text = 'Guardar las cosas luego de usarlas y ponerlas \nen un lugar.'; break;
            case 4: this.question.text = 'Ordena el tránsito y el cruce de las personas \nen las calles.'; break;
            case 5: this.question.text = 'Lo hacemos con las cosas que están rotas o no \nfuncionan para poderlas usar.'; break;
            case 6: this.question.text = 'Daño en la piel por tocar algo muy caliente.'; break;
            case 7: this.question.text = 'Se usa para matar insectos y otras plagas, se \ndebe guardar en un lugar seguro.'; break;
            case 8: this.question.text = 'Protege la cabeza.'; break;
            case 9: this.question.text = 'Característica de algo que se prende fuego fácil \ny rápidamente.'; break;
            case 10: this.question.text = 'Persona responsable de apagar el fuego de un \nincendio.'; break;
            case 11: this.question.text = 'Única persona responsable de conectar y \narreglar los artefactos a gas.'; break;
            case 12: this.question.text = 'Parte del cuerpo que nos duele cuando cargamos \nla mochila con muchos útiles y libros.'; break;
        }
    }

    private onDown(): void {
        if (this.state == SoupState.GAME) {
            this.firstPoint = this.calculateGrid(
                this.input.mousePointer.x, this.input.mousePointer.y);

            if (this.firstPoint == null) return;

            // check if needed
            this.selector.setVisible(true)
                .setPosition(306 + 12 + 24 * this.firstPoint.x,
                    166 + 12 + 24 * this.firstPoint.y);
        }
    }

    public update(time: number, delta: number): void {
        if (this.state == SoupState.GAME) {
            if (this.firstPoint != null) {
                var secondPoint = this.calculateGrid(
                    this.input.mousePointer.x, this.input.mousePointer.y);

                if (secondPoint != null) {
                    // if we have second point draw the line
                    this.setSelector(secondPoint);
                }
            }
        }
    }

    private onUp(): void {
        if (this.state == SoupState.GAME) {
            if (this.firstPoint != null) {
                // calculate solved
                var secondPoint = this.calculateGrid(
                    this.input.mousePointer.x, this.input.mousePointer.y);

                if (secondPoint != null) {
                    if (this.words[this.selected].isSolved(
                        this.firstPoint.x, secondPoint.x,
                        this.firstPoint.y, secondPoint.y)) {
                        this.sound.play('mark-sound');
                        // save bar
                        this.selector.tint = COLORS[this.selected];

                        this.selected++
                        if (this.selected == 13) {
                            this.sound.play('victory-sound');
                            this.time.delayedCall(2000, this.loadFinish, [], this);
                        } else {
                            this.loadSelected();
                        }

                        this.selector = this.add.image(0, 0, 'soup-bar')
                            .setVisible(false).setTint(0x8AFF64);
                    }

                }

                this.firstPoint = null;
                this.selector.setVisible(false);
            }

        }
    }

    private loadFinish() {
        this.add.graphics().fillStyle(0x515151, 0.55)
            .fillRect(0, 0, 960, 540).setDepth(10);

        this.add.image(480, 270, 'win-background').setDepth(11);

        this.add.image(480 - 150, 270 + 50, 'button-replay-idle')
            .setDepth(15).setInteractive()
            .on('pointerdown', () => {
                this.playFadeExitAnimation();

                // after fade animation start menu scene
                this.time.delayedCall(500, this.scene.start,
                    ["SoupScene"], this.scene);
            });

        this.add.image(480 + 150, 270 + 50, 'button-menu-idle')
            .setDepth(15).setInteractive()
            .on('pointerdown', () => this.backCallback());
    }

    public calculateGrid(x: number, y: number): Phaser.Geom.Point {
        var xp = 307;
        var yp = 166;

        for (let i = 0; i < 13; i++) {
            for (let j = 0; j < 13; j++) {
                // implement marching diff
                if (x > xp && y > yp && x < xp + TILE_SIZE && y < yp + TILE_SIZE) {
                    return new Phaser.Geom.Point(i, j);
                }
                yp += TILE_SIZE;
            }
            yp = 166;
            xp += TILE_SIZE;
        }

        return null;
    }

    private setSelector(secondPoint: Phaser.Geom.Point) {
        var dx = this.firstPoint.x - secondPoint.x;
        var dy = this.firstPoint.y - secondPoint.y;

        if (dy == 0) {
            this.selector.scaleX = Math.abs(dx) + 1;
            this.selector.setRotation(0);

            this.selector.setPosition(
                318 + (12 * (this.firstPoint.x + secondPoint.x)),
                178 + (12 * (this.firstPoint.y + secondPoint.y))
            );
        }
        else if (dx == 0) {
            this.selector.scaleX = Math.abs(dy) + 1;
            this.selector.setRotation(1.5708);

            this.selector.setPosition(
                318 + (12 * (this.firstPoint.x + secondPoint.x)),
                178 + (12 * (this.firstPoint.y + secondPoint.y))
            );
        }
        else if (dx == dy) {
            this.selector.scaleX = Math.sqrt(dx * dx + dy * dy) + 1;
            this.selector.setRotation(0.785398);

            this.selector.setPosition(
                318 + (12 * (this.firstPoint.x + secondPoint.x)),
                178 + (12 * (this.firstPoint.y + secondPoint.y))
            );
        }
        else if (dx == -dy) {
            this.selector.scaleX = Math.sqrt(dx * dx + dy * dy) + 1;
            this.selector.setRotation(-0.785398);

            this.selector.setPosition(
                318 + (12 * (this.firstPoint.x + secondPoint.x)),
                178 + (12 * (this.firstPoint.y + secondPoint.y))
            );
        }
    }

    private backCallback() {
        this.sound.play('down-sound');
        this.playFadeExitAnimation();

        // after fade animation start menu scene
        this.time.delayedCall(500, this.scene.start,
            ["MenuScene"], this.scene);
    }

    private playFadeEnterAnimation(): void {
        // declares a black screen, sets alpha to 1 
        var fade = this.add.graphics();
        fade.fillStyle(0x000000, 1);
        fade.fillRect(0, 0, 960, 560);
        fade.alpha = 1;

        // and add animation of fade to transition
        this.tweens.add({
            targets: fade,
            duration: 500,
            alpha: 0
        });
    }

    private playFadeExitAnimation(): void {
        // declares a black screen, sets alpha to 0 
        var fade = this.add.graphics().setDepth(50);;
        fade.fillStyle(0x000000, 1);
        fade.fillRect(0, 0, 960, 560);
        fade.alpha = 0;

        // and add animation of fade to transition
        this.tweens.add({
            targets: fade,
            duration: 500,
            alpha: 1
        });
    }
}