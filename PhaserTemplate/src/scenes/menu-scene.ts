/// <reference path='../phaser.d.ts'/>

import { TextImageButton, TextButton, ImageButton } from '../objects/button'
import { Time } from 'phaser';

const enum MenuState {
    LUPA = 0,
    HOTSPOT = 1,
    SEQUENCE = 2,
    DRESS = 3,
    SOUP = 4,
    QUIZ = 5,
    MAIN = 6
}

export class MenuScene extends Phaser.Scene {
    private backButton: TextImageButton;
    private nextButton: TextImageButton;

    private levelHighligh: Phaser.GameObjects.Graphics;
    private levelButtons: TextButton[];

    private tutorial: Phaser.GameObjects.Image;

    private state: number;
    private selected: number;

    static mute = false;

    constructor() {
        super({
            key: "MenuScene"
        });
    }

    create(): void {
        // setup menu
        this.add.image(0, 0, 'background').setOrigin(0, 0);
        this.add.image(25, 0, 'left-tools').setOrigin(0, 0);
        this.add.image(768, 11, 'right-note').setOrigin(0, 0);
        let book = this.add.sprite(130 - 17, 104 - 44, 'book-0').setOrigin(0, 0);

        this.playFadeEnterAnimation();

        let startButton = this.add.image(600, 400, 'play-button');
        startButton.setInteractive();

        startButton.on('pointerdown', () => {
            book.play('book');
            startButton.visible = false;
            this.time.delayedCall(1000, () => this.start(), [], this);
        });
    }
    private start() {
        this.tutorial = this.add.image(620, 310, 'tutorial-0');

        // buttons
        // this.backButton = new TextImageButton(this, 854, 488,
        //     'button-idle', 'button-hover');
        this.nextButton = new ImageButton(this, 717, 500,
            'button-next-inicio-idle', null,
            'button-next-inicio-hold', () => this.nextCallback());

        // highligh
        this.levelHighligh = this.add.graphics()
            .fillStyle(0xffc373, 1);

        // selectors
        this.levelButtons = Array<TextButton>(7);
        for (let i = 0; i < 7; i++) {
            this.levelButtons[i] = new TextButton(this, 170, 180 + i * 45,
                'arial-rounded', 18, 200, 50, () => this.levelCallback(i));

            this.levelButtons[i].tint = 0x000000;
        }

        // var playbutton = this.add.image(483, 396, 'play-button')
        //     .setInteractive();

        // sound
        // if (!MenuScene.isPlayingBackground) {
        //     this.game.sound.add('background-music', { loop: true }).play();
        //     MenuScene.isPlayingBackground = true;
        // }

        this.backButton = new TextImageButton(this, 854, 488, 'button-idle', 'button-hover',
            () => {
                this.setState(MenuState.MAIN);
                this.sound.play('down-sound');
            }
        ).setVisible(false);

        let soundButton = this.add.image(854, 200, (MenuScene.mute ? 'button-volume-deactive' : 'button-volume-active')).setInteractive();
        soundButton.on('pointerdown', () => {
            if (MenuScene.mute) {
                this.sound.mute = false;
                MenuScene.mute = false;
                soundButton.setTexture('button-volume-active');
            } else {
                this.sound.mute = true;
                MenuScene.mute = true;
                soundButton.setTexture('button-volume-deactive');
            }
        });

        this.initialize();
    }

    /**
     * Loads initial state
     */
    private initialize(): void {
        this.setState(MenuState.MAIN);
    }

    /**
     * Saves new state of menu an loads the texts for every button
     * @param newState 
     */
    private setState(newState: MenuState): void {
        this.deselectHighligh();

        this.state = newState;

        for (let i = 0; i < 7; i++) {
            this.levelButtons[i].reset();
        }

        if (this.state != MenuState.MAIN) this.backButton.setVisible(true); else this.backButton.setVisible(false);

        switch (this.state) {
            case MenuState.MAIN:
                this.levelButtons[0].setTextAndShape('1- Mirando con lupa')
                    .setScale(1, 1).setInteractive();
                this.levelButtons[1].setTextAndShape('2- Identificar en la imagen');
                this.levelButtons[2].setTextAndShape('3- Ordenar la secuencia');
                this.levelButtons[3].setTextAndShape('4- Proteger al trabajador');
                this.levelButtons[4].setTextAndShape('5- Sopa de letras');
                this.levelButtons[5].setTextAndShape('6- Verdadero o falso');
                this.levelButtons[6].visible = false;

                this.tutorial.setTexture('tutorial-0');
                break;
            case MenuState.LUPA:
                this.levelButtons[0].setTextAndShape('1 - Mirando con lupa')
                    .setScale(1.05, 1.05).disableInteractive();
                this.levelButtons[1].setTextAndShape('   a - Garage   ');
                this.levelButtons[2].setTextAndShape('   b - Salida de la escuela   ');
                this.levelButtons[3].setTextAndShape('   c - Patio   ');
                this.levelButtons[4].visible = false;
                this.levelButtons[5].visible = false;
                this.levelButtons[6].visible = false;

                this.tutorial.setTexture('tutorial-1');
                break;
            case MenuState.HOTSPOT:
                this.levelButtons[0].setTextAndShape('2 - Identificar en la imagen')
                    .setScale(1.05, 1.05).disableInteractive();
                this.levelButtons[1].setTextAndShape('   a - Aula   ');
                this.levelButtons[2].setTextAndShape('   b - Patio   ');
                this.levelButtons[3].setTextAndShape('   c - Calle   ');
                this.levelButtons[4].setTextAndShape('   d - Living   ');
                this.levelButtons[5].setTextAndShape('   e - Cocina   ');
                this.levelButtons[6].setTextAndShape('   f - Plaza   ');

                this.tutorial.setTexture('tutorial-2');
                break;
            case MenuState.SEQUENCE:
                this.levelButtons[0].setTextAndShape('3 - Ordenar la secuencia')
                    .setScale(1.05, 1.05).disableInteractive();
                this.levelButtons[1].setTextAndShape('   a - Aula   ');
                this.levelButtons[2].setTextAndShape('   b - Calle   ');
                this.levelButtons[3].setTextAndShape('   c - Cocina   ');
                this.levelButtons[4].visible = false;
                this.levelButtons[5].visible = false;
                this.levelButtons[6].visible = false;

                this.tutorial.setTexture('tutorial-3');
                break;
            case MenuState.DRESS:
                this.levelButtons[0].setTextAndShape('4 - Proteger al trabajador')
                    .setScale(1.2, 1.2).disableInteractive();
                this.levelButtons[1].setTextAndShape('   a - Primer grupo   ');
                this.levelButtons[2].setTextAndShape('   b - Segundo grupo   ');
                this.levelButtons[3].setTextAndShape('   c - Tercer grupo   ');
                this.levelButtons[4].visible = false;
                this.levelButtons[5].visible = false;
                this.levelButtons[6].visible = false;

                this.tutorial.setTexture('tutorial-4');
                break;
            case MenuState.SOUP:
                this.levelButtons[0].setTextAndShape('5 - Sopa de letras')
                    .setScale(1.05, 1.05).disableInteractive();
                this.levelButtons[1].visible = false;
                this.levelButtons[2].visible = false;
                this.levelButtons[3].visible = false;
                this.levelButtons[4].visible = false;
                this.levelButtons[5].visible = false;
                this.levelButtons[6].visible = false;

                this.tutorial.setTexture('tutorial-5');

                this.nextButton.visible = true;
                break;
            case MenuState.QUIZ:
                this.levelButtons[0].setTextAndShape('6 - Verdadero o falso')
                    .setScale(1.05, 1.05).disableInteractive();
                this.levelButtons[1].visible = false;
                this.levelButtons[2].visible = false;
                this.levelButtons[3].visible = false;
                this.levelButtons[4].visible = false;
                this.levelButtons[5].visible = false;
                this.levelButtons[6].visible = false;

                this.tutorial.setTexture('tutorial-6');

                this.nextButton.visible = true;
                break;
            default:
                break;
        }
    }

    private levelCallback(index: number): void {
        this.sound.play('down-sound');

        if (this.selected != -1) {
            // if some level is selected make it selectable again
            this.levelButtons[this.selected].reset();
            // and remove highligh
            this.levelHighligh.clear();
        } else {
            // if nothing was selected then active the next button
            this.nextButton.visible = true;
        }

        // place background highligh
        this.levelHighligh.fillStyle(0xffc373, 1)
            .fillRoundedRect(
                this.levelButtons[index].x - 5,
                this.levelButtons[index].y - 5,
                this.levelButtons[index].width + 10,
                this.levelButtons[index].height + 10,
                5
            );

        // disable button
        this.levelButtons[index].disableInteractive();

        // save selected
        this.selected = index;
    }

    private deselectHighligh() {
        this.levelHighligh.clear();
        this.selected = -1;

        this.nextButton.visible = false;
    }

    private nextCallback() {
        this.sound.play('down-sound');

        if (this.state == MenuState.MAIN) {
            this.setState(this.selected);
            return;
            // this.state = this.selected;
        }

        switch (this.state) {
            case MenuState.LUPA:
                this.playFadeExitAnimation();
                this.time.delayedCall(500, this.scene.start,
                    ["LupaScene", { level: this.selected - 1 }], this.scene);

                break;
            case MenuState.HOTSPOT:
                this.playFadeExitAnimation();
                this.time.delayedCall(500, this.scene.start,
                    ["HotspotScene", { level: this.selected - 1 }], this.scene);

                break;
            case MenuState.SEQUENCE:
                this.playFadeExitAnimation();
                this.time.delayedCall(500, this.scene.start,
                    ["SequenceScene", { level: this.selected - 1 }], this.scene);

                break;
            case MenuState.DRESS:
                this.playFadeExitAnimation();
                this.time.delayedCall(500, this.scene.start,
                    ["DressScene", { level: this.selected - 1 }], this.scene);

                break;
            case MenuState.SOUP:
                this.playFadeExitAnimation();
                this.time.delayedCall(500, this.scene.start,
                    ["SoupScene"], this.scene);

                break;
            case MenuState.QUIZ:
                this.playFadeExitAnimation();
                this.time.delayedCall(500, this.scene.start,
                    ["QuizScene"], this.scene);

                break;
            default:
                break;
        }
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