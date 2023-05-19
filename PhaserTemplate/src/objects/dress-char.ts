/// <reference path='../phaser.d.ts'/>

export class DressChar extends Phaser.GameObjects.Image {
    private index: number;
    private state: number;


    constructor(scene: Phaser.Scene, index: number, position: number) {
        super(scene, 125 + 234 * position, 30, 'character-' + index);

        this.index = index;
        this.state = 0;

        this.setOrigin(0, 0);
        scene.add.existing(this);
    }

    public getShape(): Phaser.Geom.Rectangle {
        return new Phaser.Geom.Rectangle(this.x, this.y, this.width, this.height);
    }

    public addItem(index): void {
        this.state += (1 << index);

        this.setFrame(this.state);
    }
}

export class DressItem extends Phaser.GameObjects.Image {
    private xInitial: number;
    private yInitial: number;

    private dropZone: Phaser.Geom.Rectangle;

    private inverted: boolean;

    constructor(scene: Phaser.Scene, x: number, y: number,
        image: string, frame: number, drop: Phaser.Geom.Rectangle) {
        super(scene, x, y, image, frame);

        this.xInitial = x;
        this.yInitial = y;

        this.setScale(60 / (this.height > this.width ? this.height : this.width));

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
            this.setScale(60 / (this.height > this.width ? this.height : this.width));
        }
    }

} 