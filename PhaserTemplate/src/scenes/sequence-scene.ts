/// <reference path='../phaser.d.ts'/>

import { TextImageButton } from '../objects/button';
import { DragImage } from '../objects/drag-tag';

enum SequenceState {
    INIT,
    GAME,
    END
}

export class SequenceScene extends Phaser.Scene {
    private pieces: Array<DragImage>;
    private selected: number;
    private solvedCounter: number;

    private level: number;

    // state machine
    private state: SequenceState;

    constructor(level: number) {
        super({
            key: "SequenceScene"
        });
    }

    public init(data): void {
        this.level = data.level;
    }

    preload(): void {
        // load assets needed to build the loading screen
        this.load.image('sequence-background', './bin/assets/sequence/background.png');
        this.load.spritesheet('sequence-scene-' + this.level, './bin/assets/sequence/level-' + this.level + '.png',
            { frameWidth: 103 - (this.level > 0 ? 0.5 : 0), frameHeight: 103 });
    }

    create(): void {
        this.add.image(0, 0, 'background').setOrigin(0, 0);
        this.add.image(43, 0, 'sequence-background').setOrigin(0, 0);

        // back button
        new TextImageButton(this, 854, 488, 'button-idle', 'button-hover',
            () => this.backCallback());


        var index = 6;
        for (var j = 0; j < 3; j++)
            for (var i = 0; i < 2; i++) {
                this.add.image(54 + 85 + 136 * i,
                    160 + 133 * j,
                    'sequence-scene-' + this.level, index).setScale(1.1, 1.1);
                index++;
            }

        // var debug = this.add.graphics().fillStyle(0xFF0000, 1);

        let shuffle = [0, 1, 2, 3, 4, 5];
        for (let i = shuffle.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffle[i], shuffle[j]] = [shuffle[j], shuffle[i]];
        }

        var index = 0;
        this.pieces = new Array<DragImage>(6);
        for (var j = 0; j < 3; j++)
            for (var i = 0; i < 2; i++) {
                this.pieces[index] = new DragImage(this, this.getX(shuffle[index]), this.getY(shuffle[index]),
                    'sequence-scene-' + this.level, index, new Phaser.Geom.Rectangle(459 + 136 * i,
                        104 + 133 * j, 112, 112)).setScale(0.8, 0.8);

                let current = index;
                this.pieces[index].setInteractive();
                this.pieces[index].on('pointerdown', () => this.pickUp(current));
                index++;
            }
        this.input.on('pointerup', () => this.pickOff());

        this.playFadeEnterAnimation();
        this.state = SequenceState.GAME;

        this.selected = -1;
        this.solvedCounter = 0;
    }

    private getX(index: number) {
        return 800 + (90 * (index % 2));
    }

    private getY(index: number) {
        if (index == 0 || index == 1) return 115;
        if (index == 2 || index == 3) return 115 + 90;
        if (index == 4 || index == 5) return 115 + (90 * 2);

        return 115 + (90 * index);
    }

    private pickUp(index: number): void {
        if (this.state == SequenceState.GAME) {
            this.sound.play('pick-sound');
            this.selected = index;
            this.pieces[index].setPosition(this.input.x, this.input.y);
            this.pieces[index].setScale(1.1, 1.1);
        }
    }

    private pickOff(): void {
        if (this.state == SequenceState.GAME) {
            if (this.selected != -1) {
                this.sound.play('drop-sound');
                if (this.pieces[this.selected].drop(this.input.x, this.input.y)) {
                    // check if win
                    this.solvedCounter++;
                    if (this.solvedCounter == 6) {
                        this.sound.play('victory-sound');
                        this.time.delayedCall(2000, this.loadFinish, [], this);
                        this.state = SequenceState.END;
                    }
                }

                this.selected = -1;
            }
        }
    }

    public update(time: number, delta: number): void {
        if (this.selected != -1)
            this.pieces[this.selected].setPosition(this.input.x, this.input.y);
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
                    ["SequenceScene", { level: this.level }], this.scene);
            });

        if (this.level < 2)
            this.add.image(480, 270 + 50, 'button-next-idle')
                .setDepth(15).setInteractive()
                .on('pointerdown', () => {
                    this.playFadeExitAnimation();

                    // after fade animation start menu scene
                    this.time.delayedCall(500, this.scene.start,
                        ["SequenceScene", { level: this.level + 1 }], this.scene);
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