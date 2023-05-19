/// <reference path='../phaser.d.ts'/>

export class TextImageButton extends Phaser.GameObjects.Image {

    constructor(scene: Phaser.Scene, x: number, y: number,
        idle: string, hover: string, callback: () => void) {
        super(scene, x, y, idle);

        this.setInteractive();
        this.on('pointerover', () => this.setTexture(hover));
        this.on('pointerout', () => this.setTexture(idle));
        this.on('pointerdown', () => callback());
        // this.on('pointerup', () => this.startCallback());

        scene.add.existing(this);
    }
}

export class TextButton extends Phaser.GameObjects.BitmapText {
    private initialX: number;
    private initialY: number;

    callback: () => void;

    constructor(scene: Phaser.Scene, x: number, y: number,
        font: string, size: number, width: number, height: number,
        callback: () => void) {
        super(scene, x, y, font, '', size);

        this.on('pointerover', this.onPointerOver);
        this.on('pointerout', this.onPointerOut);
        this.on('pointerdown', this.onPointerDown);
        this.on('pointerup', this.onPointerUp);

        this.initialY = x;
        this.initialY = y;
        this.callback = callback;

        this.setInteractive(new Phaser.Geom.Rectangle(0, 0,
            width, height), Phaser.Geom.Rectangle.Contains);

        scene.add.existing(this);
    }

    private onPointerOver(): void {
        // this.x -= this.width * 0.05;
        this.y = this.initialY - this.height * 0.05;
        this.setScale(1.1, 1.1);
    }

    private onPointerOut(): void {
        if (this.input.enabled) {
            this.setScale(1, 1);
            this.y = this.initialY;
        }
    }

    private onPointerDown(): void {
        this.setScale(0.95, 0.95);
        this.y = this.initialY + this.height * 0.025;
    }

    private onPointerUp() {
        this.setScale(1.1, 1.1);
        this.y = this.initialY - this.height * 0.05;

        this.callback();
    }

    /**
     * Sets a new string for the button,
     * activate it and recalculate the
     * shape of interaction.
     * @param content String to be setted
     */
    public setTextAndShape(content: string): TextButton {
        this.text = content;
        this.visible = true;

        this.setInteractive();
        return this;
    }

    /**
     * Reset the button to initial state:
     * - Interactive: enable
     * - Size: original
     */
    public reset(): void {
        this.setInteractive();
        this.setScale(1, 1);
        this.y = this.initialY;
    }
}

export class ImageButton extends Phaser.GameObjects.Image {
    callback: () => void;

    idle: string; hover: string; hold: string;

    constructor(scene: Phaser.Scene, x: number, y: number,
        idle: string, hover: string, hold: string,
        callback: () => void) {
        super(scene, x, y, idle);

        this.on('pointerover', this.onPointerOver);
        this.on('pointerout', this.onPointerOut);
        this.on('pointerdown', this.onPointerDown);
        this.on('pointerup', this.onPointerUp);

        this.idle = idle;
        this.hover = hover;
        this.hold = hold;

        this.setInteractive();
        this.callback = callback;

        scene.add.existing(this);
    }

    private onPointerOver(): void {
        if (this.hover)
            this.setTexture(this.hover);
        else
            this.setScale(1.1, 1.1);
    }

    private onPointerOut(): void {

        if (this.input.enabled) {
            this.setTexture(this.idle);
            this.setScale(1, 1);
        }
    }

    private onPointerDown(): void {
        if (this.hold)
            this.setTexture(this.hold)
        else
            this.setScale(0.95, 0.95);
    }

    private onPointerUp() {
        if (this.hover)
            this.setTexture(this.idle);
        else {
            this.setTexture(this.idle);
            this.setScale(1.1, 1.1);
        }

        this.callback();
    }
}