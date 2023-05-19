/// <reference path='../phaser.d.ts'/>

import { TextImageButton } from '../objects/button';
import { LupaTarget } from '../objects/lupa-target';

enum LupaState {
    INIT,
    GAME,
    END
}

export class LupaScene extends Phaser.Scene {
    private lupa: Phaser.GameObjects.Image;

    private picked: boolean;
    private selected: number;
    private targets: Array<LupaTarget>;
    private counter: number;

    private level: number;

    private solvedCounter: number;
    private textCounter: Phaser.GameObjects.BitmapText;

    // state machine
    private state: LupaState;

    constructor(level: number) {
        super({
            key: "LupaScene"
        });
    }

    init(data): void {
        this.level = data.level;
    }

    preload(): void {
        // load assets needed to build the loading screen
        this.load.image('lupa', './bin/assets/lupa/lupa.png');
        this.load.image('circle', './bin/assets/lupa/circle-14.png');
        this.load.image('lupa-background-' + this.level, './bin/assets/lupa/level-' + this.level + '/background.png');
        // this.load.image('lupa-scene-' + this.level, './bin/assets/lupa/level-' + this.level + '/0.png');
    }

    create(): void {
        this.add.image(0, 0, 'background').setOrigin(0, 0);
        this.add.image(768, 11, 'right-note').setOrigin(0, 0);

        this.add.image(0, 0, 'lupa-background-' + this.level).setOrigin(0, 0);
        this.add.sprite(0, 0, 'lupa-scene-' + this.level + '-0').setOrigin(0, 0).play('lupa-scene-' + this.level);

        this.textCounter = this.add.bitmapText(855 - 35 + (this.level == 1 ? -10 : 0),
            150, 'arial-rounded', '', 60).setTint(0x252525);

        // back button
        new TextImageButton(this, 854, 488, 'button-idle', 'button-hover',
            () => this.backCallback());

        this.lupa = this.add.image(855, 320, 'lupa').setScale(0.8, 0.8).setDepth(5);
        this.lupa.setInteractive();
        this.lupa.on('pointerdown', () => this.pickUp());
        this.input.on('pointerup', () => this.release());

        // this.debug = this.add.graphics().fillStyle(0xFF0000, 0.6);

        this.loadLevel();
        this.playFadeEnterAnimation();
    }

    public loadLevel(): void {
        this.state = LupaState.GAME;

        // reset
        this.picked = false;
        this.selected = -1;
        this.counter = 0;
        this.solvedCounter = 0;

        switch (this.level) {
            case 0:
                this.targets = new Array<LupaTarget>(9);
                this.targets[0] = new LupaTarget(this, 1265, 490);
                this.targets[1] = new LupaTarget(this, 320, 780);
                this.targets[2] = new LupaTarget(this, 600, 600);
                this.targets[3] = new LupaTarget(this, 170, 920);
                this.targets[4] = new LupaTarget(this, 865, 95);
                this.targets[5] = new LupaTarget(this, 960, 425);
                this.targets[6] = new LupaTarget(this, 1120, 945);
                this.targets[7] = new LupaTarget(this, 735, 767);
                this.targets[8] = new LupaTarget(this, 395, 380);
                break;
            case 1:
                this.targets = new Array<LupaTarget>(10);
                this.targets[0] = new LupaTarget(this, 515, 240);
                this.targets[1] = new LupaTarget(this, 200, 480);
                this.targets[2] = new LupaTarget(this, 925, 760);
                this.targets[3] = new LupaTarget(this, 575, 855);
                this.targets[4] = new LupaTarget(this, 205, 280);
                this.targets[5] = new LupaTarget(this, 775, 525);
                this.targets[6] = new LupaTarget(this, 275, 140);
                this.targets[7] = new LupaTarget(this, 418, 512);
                this.targets[8] = new LupaTarget(this, 1212, 487);
                this.targets[9] = new LupaTarget(this, 1390, 790);
                break;
            case 2:
                this.targets = new Array<LupaTarget>(8);
                this.targets[0] = new LupaTarget(this, 340, 970);
                this.targets[1] = new LupaTarget(this, 1350, 840);
                this.targets[2] = new LupaTarget(this, 880, 925);
                this.targets[3] = new LupaTarget(this, 555, 730);
                this.targets[4] = new LupaTarget(this, 1080, 275);
                this.targets[5] = new LupaTarget(this, 935, 460);
                this.targets[6] = new LupaTarget(this, 325, 475);
                this.targets[7] = new LupaTarget(this, 525, 485);
                break;
        }

        this.textCounter.text = '0/' + this.targets.length;
    }

    private pickUp(): void {
        this.sound.play('pick-sound');
        if (this.state == LupaState.GAME) {
            this.picked = true;
            this.lupa.setRotation(315 * Phaser.Math.DEG_TO_RAD)
                .setScale(1, 1)
                .setPosition(this.input.x - 50, this.input.y - 50);
        }
    }

    private release(): void {
        if (this.state == LupaState.GAME) {
            if (this.picked) {
                this.sound.play('drop-sound');
                this.lupa.setPosition(855, 320)
                    .setRotation(0)
                    .setScale(0.8, 0.8);
                this.picked = false;
            }
        }
    }

    public update(time: number, delta: number): void {
        if (this.state != LupaState.GAME) return;

        if (this.selected != -1) {
            if (this.targets[this.selected].isInside(this.input.x - 78, this.input.y - 78)
                && this.picked) {
                this.counter += delta;

                if (this.counter > 1000) {
                    this.targets[this.selected].markSolved();
                    this.sound.play('mark-sound');
                    this.solvedCounter++;
                    this.textCounter.text = this.solvedCounter + '/' + this.targets.length;
                }

            } else {
                this.selected = -1;
                this.counter = 0;
            }
        }

        // var finish = true;
        // for (let i = 0; i < this.targets.length; i++) {
        //     if (!this.targets[i].visible) {
        //         finish = false;
        //     }
        // }

        if (this.solvedCounter == this.targets.length) {
            this.state = LupaState.END;
            this.release();
            this.sound.play('victory-sound');
            this.time.delayedCall(2000, this.loadFinish, [], this);
        }


        if (this.picked) {
            for (let i = 0; i < this.targets.length; i++) {
                if (this.targets[i].isInside(this.input.x - 78, this.input.y - 78)) {
                    this.selected = i;
                }
            }

            this.lupa.setPosition(this.input.x - 50, this.input.y - 50);
        }
    }

    private backCallback() {
        this.sound.play('down-sound');
        this.playFadeExitAnimation();

        // after fade animation start menu scene
        this.time.delayedCall(500, this.scene.start,
            ["MenuScene"], this.scene);
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
                    ["LupaScene", { level: this.level }], this.scene);
            });

        if (this.level < 2)
            this.add.image(480, 270 + 50, 'button-next-idle')
                .setDepth(15).setInteractive()
                .on('pointerdown', () => {
                    this.playFadeExitAnimation();

                    // after fade animation start menu scene
                    this.time.delayedCall(500, this.scene.start,
                        ["LupaScene", { level: this.level + 1 }], this.scene);
                });

        this.add.image(480 + 150, 270 + 50, 'button-menu-idle')
            .setDepth(15).setInteractive()
            .on('pointerdown', () => this.backCallback());
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