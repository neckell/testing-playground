/// <reference path='../phaser.d.ts'/>

import { TextImageButton } from '../objects/button';
import { DragTag } from '../objects/drag-tag'

enum HotspotState {
    INIT,
    GAME,
    END
}

const LEVEL_SIZE = [6, 4, 4, 5, 5, 5];

export class HotspotScene extends Phaser.Scene {
    private level: number;

    private tags: Array<DragTag>;
    private targets: Array<Phaser.GameObjects.Image>;

    private selected: number;
    private solvedCounter: number;

    // state machine
    private state: HotspotState;

    constructor(level: number) {
        super({
            key: "HotspotScene"
        });
    }

    init(data): void {
        this.level = data.level;
    }

    preload(): void {
        // load assets needed to build the loading screen
        this.load.image('sticker', './bin/assets/hotspot/sticker.png');
        this.load.image('marker', './bin/assets/hotspot/marker.png');

        this.load.image('hotspot-background-' + this.level,
            './bin/assets/hotspot/level-' + this.level + '/background.png');
    }

    create(): void {
        this.add.image(0, 0, 'background').setOrigin(0, 0);
        this.add.image(768, 11, 'right-note').setOrigin(0, 0);

        this.add.image(0, 0, 'hotspot-background-' + this.level).setOrigin(0, 0);
        this.add.sprite(0, 0, 'hotspot-scene-' + this.level + '-0').setOrigin(0, 0).play('hotspot-scene-' + this.level);

        // back button
        new TextImageButton(this, 854, 488, 'button-idle', 'button-hover',
            () => this.backCallback());

        // load stickers
        this.tags = new Array<DragTag>(LEVEL_SIZE[this.level]);
        this.targets = new Array<Phaser.GameObjects.Image>(LEVEL_SIZE[this.level]);

        for (let i = 0; i < LEVEL_SIZE[this.level]; i++) {
            this.targets[i] = this.add.image(0, 0, 'marker');

            this.tags[i] = new DragTag(this, i);

            this.tags[i].setInteractive();
            this.tags[i].on('pointerdown', () => this.pickUp(i));
        }

        switch (this.level) {
            case 0:
                this.tags[0].addText(this, 'CORTE', 610, 125);
                this.tags[1].addText(this, 'ELECTRICIDAD', 685, 255).invert();
                this.tags[2].addText(this, 'DOLORES', 725, 385).invert();
                this.tags[3].addText(this, 'CAIDA', 525, 360).invert();
                this.tags[4].addText(this, 'RESBALAR', 295, 500);
                this.tags[5].addText(this, 'DISFONIA', 100, 170);

                this.targets[0].setPosition(610, 125);
                this.targets[1].setPosition(685, 255);
                this.targets[2].setPosition(725, 385);
                this.targets[3].setPosition(525, 360);
                this.targets[4].setPosition(295, 500);
                this.targets[5].setPosition(100, 170);
                break;
            case 1:
                this.tags[0].addText(this, 'CAIDA', 242, 60);
                this.tags[1].addText(this, 'CAIDA', 695, 150).invert();
                this.tags[2].addText(this, 'GOLPE', 445, 380);
                this.tags[3].addText(this, 'RESBALAR', 560, 185).invert();

                this.targets[0].setPosition(242, 60);
                this.targets[1].setPosition(695, 150);
                this.targets[2].setPosition(445, 380);
                this.targets[3].setPosition(560, 185);
                break;
            case 2:
                this.tags[0].addText(this, 'CAIDA', 262, 132).invert();
                this.tags[1].addText(this, 'CARGA', 490, 112).invert();
                this.tags[2].addText(this, 'CHOQUE', 180, 417);
                this.tags[3].addText(this, 'GOLPE', 587, 362);

                this.targets[0].setPosition(262, 132);
                this.targets[1].setPosition(490, 112);
                this.targets[2].setPosition(180, 417);
                this.targets[3].setPosition(587, 362);
                break;
            case 3:
                this.tags[0].addText(this, 'CAIDA', 145, 250);
                this.tags[1].addText(this, 'ELECTRICIDAD', 540, 130);
                this.tags[2].addText(this, 'QUEMADURA', 720, 240).invert();
                this.tags[3].addText(this, 'CORTE', 335, 367);
                this.tags[4].addText(this, 'TROPEZAR', 125, 477);

                this.targets[0].setPosition(145, 250);
                this.targets[1].setPosition(540, 130);
                this.targets[2].setPosition(720, 240);
                this.targets[3].setPosition(335, 367);
                this.targets[4].setPosition(125, 477);
                break;
            case 4:
                this.tags[0].addText(this, 'ELECTRICIDAD', 640, 222);
                this.tags[1].addText(this, 'QUEMADURA', 340, 270);
                this.tags[2].addText(this, 'CORTE', 202, 437);
                this.tags[3].addText(this, 'INCENDIO', 380, 180);
                this.tags[4].addText(this, 'INTOXICACION', 50, 320);

                this.targets[0].setPosition(640, 222);
                this.targets[1].setPosition(340, 270);
                this.targets[2].setPosition(202, 437);
                this.targets[3].setPosition(380, 180);
                this.targets[4].setPosition(50, 320);
                break;
            case 5:
                this.tags[0].addText(this, 'CAIDA', 405, 310).invert();
                this.tags[1].addText(this, 'GOLPE', 350, 235).invert();
                this.tags[2].addText(this, 'CONTAGIO', 75, 105);
                this.tags[3].addText(this, 'ELECTRICIDAD', 707, 200).invert();
                this.tags[4].addText(this, 'GOLPE', 650, 340).invert();

                this.targets[0].setPosition(405, 310);
                this.targets[1].setPosition(350, 235);
                this.targets[2].setPosition(75, 105);
                this.targets[3].setPosition(707, 200);
                this.targets[4].setPosition(650, 340);
                break;
        }

        this.input.on('pointerup', () => this.pickOff());

        this.playFadeEnterAnimation();

        //initial state
        this.state = HotspotState.GAME;

        this.selected = -1;
        this.solvedCounter = 0;
    }

    private pickUp(index: number): void {
        this.sound.play('pick-sound');
        if (this.state == HotspotState.GAME) {
            this.selected = index;
            this.tags[index].move(this.input.x, this.input.y);
            this.tags[index].pick();
        }
    }

    private pickOff(): void {
        if (this.state == HotspotState.GAME) {
            if (this.selected != -1) {
                this.sound.play('drop-sound');
                if (this.tags[this.selected].drop(this.input.x, this.input.y)) {
                    // check if win
                    this.solvedCounter++;
                    if (this.solvedCounter == LEVEL_SIZE[this.level]) {
                        this.sound.play('victory-sound');
                        this.time.delayedCall(2000, this.loadFinish, [], this);
                        this.state = HotspotState.END;
                    }
                }

                this.selected = -1;
            }
        }
    }

    public update(time: number, delta: number): void {
        if (this.selected != -1)
            this.tags[this.selected].move(this.input.x, this.input.y);
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
                    ["HotspotScene", { level: this.level }], this.scene);
            });

        if (this.level < 5)
            this.add.image(480, 270 + 50, 'button-next-idle')
                .setDepth(15).setInteractive()
                .on('pointerdown', () => {
                    this.playFadeExitAnimation();

                    // after fade animation start menu scene
                    this.time.delayedCall(500, this.scene.start,
                        ["HotspotScene", { level: this.level + 1 }], this.scene);
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