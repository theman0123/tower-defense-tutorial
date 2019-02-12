export default {
  type: Phaser.AUTO,
  parent: "tower-defense",
  width: 640,
  height: 512,
  pixelArt: true,
  roundPixels: true,
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
      gravity: { y: 0 }
    }
  }
};
