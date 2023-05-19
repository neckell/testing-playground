/// <reference path='../phaser.d.ts'/>

import { TextImageButton, ImageButton } from '../objects/button';

enum QuizState {
    INIT,
    GAME,
    END
}

const CORRECT_ANS = [false, false, true, true, false, false, false, true, false, false, false, true, false, false, false, false, false, true, true, true];

export class QuizScene extends Phaser.Scene {
    private selected = 1;

    // state machine
    private state: QuizState;

    private question: Phaser.GameObjects.BitmapText;
    private questionNumber: Phaser.GameObjects.BitmapText;
    private image: Phaser.GameObjects.Image;

    private trueSlot: Phaser.Geom.Rectangle;
    private falseSlot: Phaser.Geom.Rectangle;

    private questionSlot: Array<Phaser.Geom.Rectangle>;
    private questionAns: Array<Phaser.GameObjects.Image>;

    private answers = Array<boolean>(20);

    private selection: Phaser.GameObjects.Image;

    private nextButton: ImageButton;

    // // debugger
    // private debug: Phaser.GameObjects.Graphics;
    // private startDebug(): void {
    //     this.debug = this.add.graphics().fillStyle(0xff0000);
    // }

    constructor(level: number) {
        super({
            key: "QuizScene"
        });
    }

    preload(): void {
        // load assets needed to build the loading screen
        this.load.image('quiz-background', './bin/assets/quiz/background.png')

        for (let i = 0; i < 20; i++)
            this.load.image('quiz-image-' + i, './bin/assets/quiz/' + i + '.png');

        //icons
        this.load.image('quiz-true', './bin/assets/quiz/true.png');
        this.load.image('quiz-false', './bin/assets/quiz/false.png');
    }

    create(): void {
        // setup background
        this.add.image(0, 0, 'quiz-background').setOrigin(0, 0);

        // load questions;
        this.questionNumber = this.add.bitmapText(261 + 50, 150, 'arial-rounded', '1)', 38).setTint(0x252525);
        this.question = this.add.bitmapText(298 + 50, 165, 'arial-rounded', 'Ejemplo', 20).setTint(0x252525);

        this.image = this.add.image(397, 357, 'quiz-image-' + 1);

        this.trueSlot = new Phaser.Geom.Rectangle(571, 294, 58, 46);
        this.falseSlot = new Phaser.Geom.Rectangle(571, 351, 58, 46);

        let index = 0;
        this.questionSlot = new Array<Phaser.Geom.Rectangle>(20);
        this.questionAns = new Array<Phaser.GameObjects.Image>(20);

        for (let j = 0; j < 2; j++) {
            for (let i = 0; i < 10; i++) {
                this.questionSlot[index] = new Phaser.Geom.Rectangle(793 + 65 * j, 129 + 30 * i, 59, 29);
                this.questionAns[index] = this.add.image(838 + 5 + 65 * j, 144 + 29 * i, 'quiz-true').setScale(0.6).setVisible(false);

                // this.debug.fillRectShape(this.questionSlot[index]);
                index++;
            }
        }

        this.selection = this.add.image(0, 0, 'quiz-true').setVisible(false);

        this.nextButton = new ImageButton(this, 650, 450,
            'button-next-inicio-idle', null,
            'button-next-inicio-hold', () => this.nextCallback());

        // back button
        new TextImageButton(this, 854, 488, 'button-idle', 'button-hover',
            () => this.backCallback());

        this.input.on('pointerdown', () => this.onDown());

        this.playFadeEnterAnimation();

        // initial state
        this.state = QuizState.GAME;
        this.loadQuestion(0);
    }

    private nextCallback() {
        this.sound.play('down-sound');
        this.questionAns[this.selected].setVisible(true);
        if (this.answers[this.selected] == CORRECT_ANS[this.selected]) {
            this.questionAns[this.selected].setTexture('quiz-true');
        } else {
            this.questionAns[this.selected].setTexture('quiz-false');
        }

        let finish = true;
        for (let i = 0; i < 20; i++) {
            if (!this.questionAns[i].visible || this.answers[i] != CORRECT_ANS[i]) {
                finish = false; break;
            }
        }

        if (finish) {
            this.sound.play('victory-sound');
            this.time.delayedCall(2000, this.loadFinish, [], this);
        }

        if (this.selected == 19) this.selected = -1;
        this.loadQuestion(this.selected + 1);
    }

    private onDown(): void {
        if (this.state == QuizState.GAME) {
            // check for question answer
            if (this.trueSlot.contains(
                this.input.mousePointer.x,
                this.input.mousePointer.y)) {
                this.markAnswer(true);
                return;
            }

            if (this.falseSlot.contains(
                this.input.mousePointer.x,
                this.input.mousePointer.y)) {
                this.markAnswer(false);
                return;
            }

            // check for question change
            for (let i = 0; i < 20; i++)
                if (this.questionSlot[i].contains(
                    this.input.mousePointer.x,
                    this.input.mousePointer.y)) {
                    this.sound.play('down-sound');
                    this.loadQuestion(i);
                    return;
                }
        }
    }

    private markAnswer(ans: boolean) {
        this.sound.play('mark-sound');
        this.selection.setVisible(true);
        this.answers[this.selected] = ans;
        if (ans) {
            this.selection.setPosition(599 + 10, 317 - 10);
        } else {
            this.selection.setPosition(599 + 10, 375 - 10);
        }
        this.nextButton.setVisible(true);
    }

    private loadQuestion(index: number) {
        this.nextButton.setVisible(false);
        this.selected = index;
        this.questionNumber.text = this.selected + 1 + ')';
        if (this.selected > 8) {
            this.questionNumber.x = 261 + 30;
        } else {
            this.questionNumber.x = 261 + 50;
        }

        this.image.setTexture('quiz-image-' + this.selected);

        switch (this.selected) {
            case 0: this.question.text = 'Debemos cruzar la calle por \nla mitad de la cuadra, \ncorriendo o escuchando \nmúsica con los auriculares.'; break;
            case 1: this.question.text = 'Usar casco es obligatorio \npara los conductores de las \nmotos pero no para \nacompañantes.'; break;
            case 2: this.question.text = 'Enchufar muchos artefactos \neléctricos en el mismo lugar \npuede provocar un incendio.'; break;
            case 3: this.question.text = 'No debemos correr con \nlápices o chupetines en \nla boca.'; break;
            case 4: this.question.text = 'Debemos abrir la heladera \ndescalzos y / o con las manos \nmojadas.'; break;
            case 5: this.question.text = 'Si tienen etiqueta, los \nproductos químicos pueden \nestar al alcance de los niños.'; break;
            case 6: this.question.text = 'Si hace mucho calor es mejor \nno usar elementos de \nprotección personal.'; break;
            case 7: this.question.text = 'Los ruidos fuertes y \npersistentes pueden \nperjudicar el oído y la voz.'; break;
            case 8: this.question.text = 'Cuando usamos la patineta no \nes necesario proteger ninguna \nparte de nuestro cuerpo.'; break;
            case 9: this.question.text = 'Correr carreras cuando el piso \nde la escuela está mojado no \ntiene ningún riesgo.'; break;
            case 10: this.question.text = 'Si vemos una situación de \nriesgo debemos acercarnos \npara saber de qué se trata.'; break;
            case 11: this.question.text = 'Guardar de manera ordenada \nlos útiles y herramientas \ndespués de usarlas ayuda \na prevenir accidentes.'; break;
            case 12: this.question.text = 'Si el semáforo peatonal me da \npaso no hace falta mirar \nhacia ambos lados al cruzar \nla calle.'; break;
            case 13: this.question.text = 'Mientras estemos atentos no \nimporta si dejamos cables \natravesados en los lugares \nde paso.'; break;
            case 14: this.question.text = 'Pararme arriba de los \nmuebles no tiene ningún \nriesgo.'; break;
            case 15: this.question.text = 'Todos los incendios se pueden \napagar con agua.'; break;
            case 16: this.question.text = 'El único riesgo de hamacarse \nen la silla es romperla.'; break;
            case 17: this.question.text = 'Si vemos cables colgados o \nsaliendo de algún lugar, \ndebemos avisar a un adulto \ny no tocarlos.'; break;
            case 18: this.question.text = 'Mirar sin protección la luz \nde una soldadura daña \nmucho la vista.'; break;
            case 19: this.question.text = 'Cuando alguien no se cuida \npuede poner en riesgo al otro.'; break;
        }

        this.selection.setVisible(false);
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
                    ["QuizScene"], this.scene);
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