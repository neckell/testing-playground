/// <reference path='../phaser.d.ts'/>

const SQ_RADIUS = 40 * 40;

export class LupaTarget extends Phaser.GameObjects.Image {

    constructor(scene: Phaser.Scene, x: number, y: number) {
        // hotfix
        x *= 0.5; y *= 0.5;

        super(scene, x, y, 'circle');

        this.visible = false;

        scene.add.existing(this);

        //debug
        // scene.add.graphics()
        //     .fillStyle(0x5dae47, 1)
        //     .fillCircle(x, y, 1);
    }

    public isInside(x: number, y: number): boolean {
        if (!this.visible) {
            x -= this.x; x *= x;
            y -= this.y; y *= y;

            if (x + y < SQ_RADIUS) return true;
        }
        return false;
    }

    public markSolved(): void {
        this.visible = true;
    }
}