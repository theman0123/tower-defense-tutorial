import "phaser";

export default class TitleScene extends Phaser.Scene {
  constructor() {
    super("Title");
  }

  create() {
    this.createTitle();
    this.createPlayButton();
  }

  centerObject(gameObject, offset = 0) {
    this.width = this.cameras.main.width;
    this.height = this.cameras.main.height;

    gameObject.x = this.width / 2;
    gameObject.y = this.width / 2 - offset * 100;
  }

  createPlayButton() {
    // play button
    this.gameButton = this.add.sprite(0, 0, "blueButton1").setInteractive();
    this.centerObject(this.gameButton, -1);

    this.gameText = this.add.text(0, 0, "Play", {
      fontSize: "32px",
      fill: "#fff",
    });
    Phaser.Display.Align.In.Center(this.gameText, this.gameButton);

    this.gameButton.on("pointerdown", () => {
      this.scene.start("Game");
    });
    this.gameButton.on("pointerover", () => {
      this.gameButton.setTexture("blueButton2");
    });
    this.gameButton.on("pointerout", () => {
      this.gameButton.setTexture("blueButton1");
    });
  }

  createTitle() {
    // title image
    this.titleImage = this.add.image(0, 0, "title");
    this.centerObject(this.titleImage, 1);
  }
}
