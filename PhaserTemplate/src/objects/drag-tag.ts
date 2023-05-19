/// <reference path='../phaser.d.ts'/>

export class DragTag extends Phaser.GameObjects.Image {
    private xInitial: number;
    private yInitial: number;

    private inverted: boolean;
    private text: Phaser.GameObjects.BitmapText;

    private index: number;
    private dropZone: Phaser.Geom.Circle;

    constructor(scene: Phaser.Scene, index: number) {
        super(scene, 855, 165 + index * 40, 'sticker');

        this.xInitial = this.x = 855;
        this.yInitial = this.y = 165 + index * 40;
        this.index = index;

        scene.add.existing(this);
    }

    public addText(scene: Phaser.Scene, text: string, x: number, y: number): this {
        this.text = scene.add.bitmapText(0, 0, 'arial-rounded', text, 16)
            .setTint(0x3f3f3f);

        this.text.x = this.xInitial + 137 / 2 - this.text.width - 20;
        this.text.y = 165 + this.index * 40 - 7;

        this.dropZone = new Phaser.Geom.Circle(x, y, 50);
        return this;
    }

    public invert(): this {
        this.inverted = true;
        return this;
    }

    public pick() {
        if (this.inverted) {
            this.flipX = true;
            this.setOrigin(1, 0.5);
        }
        else {
            this.setOrigin(0, 0.5);
        }
    }

    public drop(x: number, y: number): boolean {
        if (this.dropZone.contains(x, y)) {
            this.disableInteractive();
            this.move(this.dropZone.x, this.dropZone.y);
            return true;
        }
        else {
            this.setOrigin(0.5, 0.5);

            this.x = this.xInitial;
            this.y = this.yInitial;

            // centered
            this.text.x = this.xInitial + 48 - this.text.width;
            this.text.y = this.yInitial - 9;

            if (this.inverted) this.flipX = false;
        }
    }

    public move(x: number, y: number): this {
        this.x = x;
        this.y = y;

        if (this.inverted) {
            this.text.x = x - 137 + 20;
        } else {
            this.text.x = x + 137 - 20 - this.text.width;
        }
        this.text.y = y - 9;
        return this;
    }
}

export class DragImage extends Phaser.GameObjects.Image {
    private xInitial: number;
    private yInitial: number;

    private dropZone: Phaser.Geom.Rectangle;

    private inverted: boolean;

    constructor(scene: Phaser.Scene, x: number, y: number,
        image: string, frame: number, drop: Phaser.Geom.Rectangle) {
        super(scene, x, y, image, frame);

        this.xInitial = x;
        this.yInitial = y;

        this.dropZone = drop;

        scene.add.existing(this);
    }

    public drop(x: number, y: number): boolean {
        if (this.dropZone.contains(x, y)) {
            this.disableInteractive();
            this.setPosition(this.dropZone.centerX, this.dropZone.centerY);
            return true;
        }
        else {
            this.setPosition(this.xInitial, this.yInitial);
            this.setScale(0.8);
        }
    }

} 