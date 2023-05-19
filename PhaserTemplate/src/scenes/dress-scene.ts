/// <reference path='../phaser.d.ts'/>

import { TextImageButton, ImageButton } from '../objects/button';
import { DressChar, DressItem } from '../objects/dress-char';

enum DressState {
    INIT,
    GAME,
    END
}

export class DressScene extends Phaser.Scene {
    private level: number;
    private picked: boolean;
    private selected: number;
    private solvedCounter: number;

    private items: Array<DressItem>;
    private characters: Array<DressChar>;

    // state machine
    private state: DressState;

    constructor(level: number) {
        super({
            key: "DressScene"
        });
    }

    public init(data): void {
        this.level = data.level;
    }

    preload(): void {
        // load assets needed to build the loading screen
        this.load.image('dress-background', './bin/assets/dress/background.png');

        console.log('loading from ' + this.level * 3 + ' to ' + (this.level * 3 + 3));
        for (let i = this.level * 3; i < this.level * 3 + 3; i++) {
            this.load.spritesheet('character-' + i,
                './bin/assets/dress/character-' + i + '/spritesheet.png', { frameWidth: 127.5, frameHeight: 315 });

            for (let j = 0; j < 3; j++) {
                this.load.image('character-' + i + 'item-' + j,
                    './bin/assets/dress/character-' + i + '/item-' + j + '.png');
            }
        }

        this.load.image('dress-name-' + this.level, './bin/assets/dress/level-' + this.level + '.png');
    }

    create(): void {
        this.add.image(0, 0, 'background').setOrigin(0, 0);
        this.add.image(768, 11, 'right-note').setOrigin(0, 0);
        this.add.image(45, 2, 'dress-background').setOrigin(0, 0);
        this.add.image(0, 0, 'dress-name-' + this.level).setOrigin(0, 0);

        // back button
        new TextImageButton(this, 854, 488, 'button-idle', 'button-hover',
            () => this.backCallback());

        let shuffle = [0, 1, 2, 3, 4, 5, 6, 7, 8];
        for (let i = shuffle.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffle[i], shuffle[j]] = [shuffle[j], shuffle[i]];
        }

        this.items = new Array<DressItem>(9); let index = 0;
        this.characters = new Array<DressChar>(3);
        for (let i = 0; i < 3; i++) {
            this.characters[i] = new DressChar(this, this.level * 3 + i, i);

            for (let item = 0; item < 3; item++) {
                this.items[index] = new DressItem(this, 140 + shuffle[index] * 70, 460,
                    'character-' + (this.level * 3 + i) + 'item-' + item, 0, this.characters[i].getShape());

                let current = index;
                this.items[index].setInteractive().on('pointerdown', () => this.pickUp(current));

                index++;
            }
        }

        this.input.on('pointerup', () => this.pickOff());

        this.playFadeEnterAnimation();

        // initial state
        this.state = DressState.GAME;

        this.selected = -1;
        this.solvedCounter = 0;
    }

    private pickUp(index: number): void {
        if (this.state == DressState.GAME) {
            this.sound.play('pick-sound');
            this.selected = index;
            this.items[index].setPosition(this.input.x, this.input.y);
            this.items[index].setScale(0.5, 0.5);
        }
    }

    private pickOff(): void {
        if (this.state == DressState.GAME) {
            if (this.selected != -1) {
                this.sound.play('drop-sound');
                if (this.items[this.selected].drop(this.input.x, this.input.y)) {
                    // check if win
                    this.solvedCounter++;
                    this.items[this.selected].visible = false;
                    this.characters[Math.floor(this.selected / 3)].addItem(this.selected % 3);

                    if (this.solvedCounter == 9) {
                        this.sound.play('victory-sound');
                        this.time.delayedCall(2000, this.loadFinish, [], this);
                        this.state = DressState.END;
                    }
                }


                this.selected = -1;
            }
        }
    }

    public update(time: number, delta: number): void {
        if (this.selected != -1)
            this.items[this.selected].setPosition(this.input.x, this.input.y);
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
                    ["DressScene", { level: this.level }], this.scene);
            });

        if (this.level < 2)
            this.add.image(480, 270 + 50, 'button-next-idle')
                .setDepth(15).setInteractive()
                .on('pointerdown', () => {
                    this.playFadeExitAnimation();

                    // after fade animation start menu scene
                    this.time.delayedCall(500, this.scene.start,
                        ["DressScene", { level: this.level + 1 }], this.scene);
                });

        this.add.image(480 + 150, 270 + 50, 'button-menu-idle')
            .setDepth(15).setInteractive()
            .on('pointerdown', () => this.backCallback());
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
        var fade = this.add.graphics().setDepth(50);
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