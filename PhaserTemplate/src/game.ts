/// <reference path='./phaser.d.ts'/>

import { LoadScene } from './scenes/load-scene';
import { MenuScene } from './scenes/menu-scene';

// minigames
import { LupaScene } from './scenes/lupa-scene';
import { HotspotScene } from './scenes/hotspot-scene';
import { DressScene } from './scenes/dress-scene';
import { SequenceScene } from './scenes/sequence-scene';
import { SoupScene } from './scenes/soup-scene';
import { QuizScene } from './scenes/quiz-scene';

const config: GameConfig = {
  type: Phaser.AUTO,
  width: 960,
  height: 540,
  scene: [LoadScene, MenuScene, LupaScene, HotspotScene,
    DressScene, SequenceScene, SoupScene, QuizScene],
  parent: 'gameContent',
  banner: true,
  title: 'SRT'
}

// exports both game var and starting function so it 
// can be used outside of the script
export var SRTGame: Phaser.Game;

export function run() {
  SRTGame = new Phaser.Game(config);
}

// cordova 
// document.addEventListener('deviceready', function () {
//   // can also be setted to portrait, portrait-primary
//   // portrait-secondary, landscape-primary and landscape-secondary
//   screen.orientation.lock('landscape');

//   run();
//   window.addEventListener('resize', resize);
//   resize();
// });

// plain web
window.onload = () => {
  run();
  // window.addEventListener('resize', resize);
  // resize();
};

// resize and positionate game in the center of the screen
function resize() {
  var canvas = SRTGame.canvas,
    width = window.innerWidth,
    height = window.innerHeight;

  var wratio = width / height,
    ratio = canvas.width / canvas.height;

  if (wratio < ratio) {
    var canvasHeight = width / ratio;

    canvas.style.width = width + 'px';
    canvas.style.height = canvasHeight + 'px';

    var marginTop = (height - canvasHeight) * 0.5;

    canvas.style.marginTop = marginTop + 'px';
    canvas.style.marginLeft = '0px';
  } else {
    var canvasWidth = height * ratio;

    canvas.style.width = canvasWidth + 'px';
    canvas.style.height = height + 'px';

    var marginLeft = (width - canvasWidth) * 0.5;

    canvas.style.marginLeft = marginLeft + 'px';
    canvas.style.marginTop = '0px';
  }
}