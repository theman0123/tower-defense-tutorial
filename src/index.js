import "phaser";
import config from "./config/config";
import GameScene from "./scenes/GameScene";
import BootScene from "./scenes/BootScene";
import PreloaderScene from "./scenes/PreloaderScene";
import UIScene from "./scenes/UIScene";
import TitleScene from "./scenes/TitleScene";

class Game extends Phaser.Game {
  constructor() {
    super(config);

    this.scene.add("Boot", BootScene);
    this.scene.add("Preloader", PreloaderScene);
    this.scene.add("Game", GameScene);
    this.scene.add("UI", UIScene);
    this.scene.add("Title", TitleScene);
    this.scene.start("Boot");
  }
}

window.onload = function() {
  window.game = new Game();
  resize();
  window.addEventListener("resize", resize, false);
};

function resize() {
  let canvas = document.querySelector("canvas");
  let windowWidth = window.innerWidth;
  let windowHeight = window.innerHeight;
  let windowRatio = windowWidth / windowHeight;
  let gameRatio = config.width / config.height;
  if (windowRatio < gameRatio) {
    canvas.style.width = windowWidth + "px";
    canvas.style.height = windowWidth / gameRatio + "px";
  } else {
    canvas.style.width = windowHeight * gameRatio + "px";
    canvas.style.height = windowHeight + "px";
  }
}
