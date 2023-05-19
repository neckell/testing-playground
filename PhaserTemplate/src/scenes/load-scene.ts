/// <reference path='../phaser.d.ts'/>

export class LoadScene extends Phaser.Scene {
    private loadingBar: Phaser.GameObjects.Graphics;
    private progressBar: Phaser.GameObjects.Graphics;

    constructor() {
        super({
            key: "LoadScene"
        });
    }

    preload(): void {
        // setup prefix for loading assets
        this.load.setBaseURL('./bin/assets/');

        // load assets needed to build the loading screen
        this.load.image('background', 'menu/background.png');
    }

    create(): void {
        // background items
        this.load.image('left-tools', 'menu/left-tools.png');
        this.load.image('right-note', 'menu/right-note.png');
        this.load.image('note-background', 'menu/note-background.png');
        this.load.image('win-background', 'menu/win-background.png');

        // tutoriales
        for (let i = 0; i < 7; i++) this.load.image('tutorial-' + i, 'menu/' + i + '.png');


        // common
        this.load.bitmapFont("arial-rounded", 'fonts/arial-rounded.png', 'fonts/arial-rounded.fnt');

        // buttons
        this.load.image('button-idle', 'buttons/button-idle.png');
        this.load.image('button-hover', 'buttons/button-hover.png');
        this.load.image('button-next-inicio-idle', 'buttons/next-inicio-idle.png');
        this.load.image('button-next-inicio-hold', 'buttons/next-inicio-hold.png');

        this.load.image('button-menu-idle', 'buttons/menu-idle.png');
        this.load.image('button-menu-hold', 'buttons/menu-hold.png');
        this.load.image('button-replay-idle', 'buttons/replay-idle.png');
        this.load.image('button-replay-hold', 'buttons/replay-hold.png');
        this.load.image('button-next-idle', 'buttons/next-idle.png');
        this.load.image('button-next-hold', 'buttons/next-hold.png');

        this.load.image('button-volume-active', '/buttons/active-sound.png');
        this.load.image('button-volume-deactive', '/buttons/deactive-sound.png');

        // main menu
        this.load.image('play-button', 'menu/play-button.png');
        this.load.audio('background-music', 'sound/background-music.mp3');

        this.load.audio('victory-sound', 'sound/victory.mp3');
        this.load.audio('down-sound', 'sound/down.mp3');
        this.load.audio('mark-sound', 'sound/mark.mp3');
        this.load.audio('pick-sound', 'sound/pick.mp3');
        this.load.audio('drop-sound', 'sound/drop.mp3');

        // libro de fondo + animacion
        this.load.image('book-background', 'menu/book-background.png');
        for (let i = 0; i < 13; i++) {
            this.load.image('book-' + i, 'menu/book-' + i + '.png');
        }

        // this.load.spritesheet('blue-anim', './assets/sprites/blue-anim.png', { frameWidth: 256, frameHeight: 256 });

        // hotspot
        for (let level = 0; level < 6; level++) {
            for (let index = 0; index < 13; index++) {
                this.load.image('hotspot-scene-' + level + '-' + index,
                    'hotspot/level-' + level + '/' + index + '.png');
            }
        }

        // lupa 
        for (let level = 0; level < 3; level++) {
            for (let index = 0; index < 13; index++) {
                this.load.image('lupa-scene-' + level + '-' + index,
                    'lupa/level-' + level + '/' + index + '.png');
            }
        }

        for (let i = 0; i < 13; i++) {
            this.load.image('book-' + i, 'menu/book-' + i + '.png');
        }

        // set the background and create loading bar
        this.add.sprite(0, 0, 'background').setOrigin(0, 0);

        this.loadingBar = this.add.graphics();
        this.loadingBar.fillStyle(0x5dae47, 1);
        this.loadingBar.fillRect(
            this.cameras.main.width / 4 - 2,
            this.cameras.main.height / 2 - 18,
            this.cameras.main.width / 2 + 4,
            20
        );
        this.progressBar = this.add.graphics();

        // pass value to change the loading bar fill
        this.load.on(
            "progress",
            function (value) {
                this.progressBar.clear();
                this.progressBar.fillStyle(0xfff6d3, 1);
                this.progressBar.fillRect(
                    this.cameras.main.width / 4,
                    this.cameras.main.height / 2 - 16,
                    (this.cameras.main.width / 2) * value,
                    16
                );
            },
            this
        );

        this.load.on(
            "complete",
            function () {
                // after loading all assets create the animations here
                // so its only happen once
                // this.anims.create({
                //     key: 'win',
                //     frames: this.anims.generateFrameNumbers('blue-anim', {
                //         start: 0, end: 75
                //         //frames: [26, 27, 28, 18, 17, 16]
                //     }),
                //     yoyo: true,
                //     repeat: -1,
                //     frameRate: 30
                // });

                // hotspot
                for (let level = 0; level < 6; level++) {
                    this.anims.create({
                        key: 'hotspot-scene-' + level,
                        frames:
                            [
                                { key: 'hotspot-scene-' + level + '-0' },
                                { key: 'hotspot-scene-' + level + '-1' },
                                { key: 'hotspot-scene-' + level + '-2' },
                                { key: 'hotspot-scene-' + level + '-3' },
                                { key: 'hotspot-scene-' + level + '-4' },
                                { key: 'hotspot-scene-' + level + '-5' },
                                { key: 'hotspot-scene-' + level + '-6' },
                                { key: 'hotspot-scene-' + level + '-7' },
                                { key: 'hotspot-scene-' + level + '-8' },
                                { key: 'hotspot-scene-' + level + '-9' },
                                { key: 'hotspot-scene-' + level + '-10' },
                                { key: 'hotspot-scene-' + level + '-11' },
                                { key: 'hotspot-scene-' + level + '-12' },
                            ],
                        yoyo: true,
                        repeat: -1,
                        frameRate: 16
                    });
                }

                // lupa 
                for (let level = 0; level < 3; level++) {
                    this.anims.create({
                        key: 'lupa-scene-' + level,
                        frames:
                            [
                                { key: 'lupa-scene-' + level + '-0' },
                                { key: 'lupa-scene-' + level + '-1' },
                                { key: 'lupa-scene-' + level + '-2' },
                                { key: 'lupa-scene-' + level + '-3' },
                                { key: 'lupa-scene-' + level + '-4' },
                                { key: 'lupa-scene-' + level + '-5' },
                                { key: 'lupa-scene-' + level + '-6' },
                                { key: 'lupa-scene-' + level + '-7' },
                                { key: 'lupa-scene-' + level + '-8' },
                                { key: 'lupa-scene-' + level + '-9' },
                                { key: 'lupa-scene-' + level + '-10' },
                                { key: 'lupa-scene-' + level + '-11' },
                                { key: 'lupa-scene-' + level + '-12' },
                            ],
                        yoyo: true,
                        repeat: -1,
                        frameRate: 16
                    });
                }

                this.anims.create({
                    key: 'book',
                    frames:
                        [
                            { key: 'book-0' },
                            { key: 'book-1' },
                            { key: 'book-2' },
                            { key: 'book-3' },
                            { key: 'book-4' },
                            { key: 'book-5' },
                            { key: 'book-6' },
                            { key: 'book-7' },
                            { key: 'book-8' },
                            { key: 'book-9' },
                            { key: 'book-10' },
                            { key: 'book-11' },
                            { key: 'book-12' },
                            { key: 'book-background' }
                        ],
                    repeat: 0,
                    frameRate: 16
                });

                // fade screen
                // declares a black screen, sets alpha to 0 
                var fade = this.add.graphics();
                fade.fillStyle(0x000000, 1);
                fade.fillRect(0, 0, 960, 560);
                fade.alpha = 0;

                // and add animation of fade to transition to next scene
                this.tweens.add({
                    targets: fade,
                    duration: 500,
                    alpha: 1
                });

                // after fade animation start menu scene
                this.time.delayedCall(500, this.scene.start,
                    ["MenuScene"], this.scene);

                this.time.delayedCall(500, () => {
                    this.game.sound.add('background-music', { loop: true }).play();
                });
            },
            this
        );

        // restart load process
        this.load.start();
    }
}