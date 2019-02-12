import "phaser";

export default class UIScene extends Phaser.Scene {
  constructor() {
    // active: true, means this scene is always running
    super({ key: "UI", active: true });
  }

  init() {
    // get reference to game scene
    this.gameScene = this.scene.get("Game");
  }

  create() {
    this.setupUIElements();
    this.setupEvents();
  }

  hideUIElements() {
    this.scoreText.alpha = 0;
    this.healthText.alpha = 0;
    this.turretsText.alpha = 0;
    this.roundTimeText.alpha = 0;
    this.enemiesText.alpha = 0;
    this.levelText.alpha = 0;
  }

  setupEvents() {
    this.gameScene.events.on("displayUI", () => {
      this.scoreText.alpha = 1;
      this.healthText.alpha = 1;
      this.turretsText.alpha = 1;
      this.enemiesText.alpha = 1;
    });
    this.gameScene.events.on("updateEnemies", enemies => {
      this.enemiesText.setText(`Enemies Remaining: ${enemies}`);
    });
    this.gameScene.events.on("updateScore", score => {
      this.scoreText.setText(`Score: ${score}`);
    });
    this.gameScene.events.on("updateHealth", health => {
      this.healthText.setText(`Base Health: ${health}`);
    });
    this.gameScene.events.on("hideUI", this.hideUIElements.bind(this));
    this.gameScene.events.on("updateTurrets", availableTurrets => {
      this.turretsText.setText(`Available Turrets: ${availableTurrets}`);
    });
    this.gameScene.events.on("startRound", level => {
      // display round/level
      this.levelText.setText(`Level: ${level}`);
      this.levelText.alpha = 1;

      // fade level/round text
      this.add.tween({
        targets: this.levelText,
        ease: "Sine.easeInOut",
        duration: 1000,
        delay: 2000,
        alpha: {
          getStart: function() {
            return 1;
          },
          getEnd: function() {
            return 0;
          },
        },
        onComplete: function() {
          this.roundTimeText.setText(`Round Starts In: 10`);
          this.roundTimeText.alpha = 1;
          this.timedEvent = this.time.addEvent({
            delay: 1000,
            callbackScope: this,
            repeat: 9,
            callback: function() {
              this.roundTimeText.setText(
                `Round Starts In: ${this.timedEvent.repeatCount}`,
              );
              if (this.timedEvent.repeatCount <= 0) {
                this.events.emit("roundReady");
                this.roundTimeText.alpha = 0;
              }
            },
          });
        }.bind(this),
      });
    });
  }

  setupUIElements() {
    this.scoreText = this.add.text(5, 5, "Score: 0", {
      fontSize: "16px",
      fill: "#fff",
    });
    this.healthText = this.add.text(10, 490, "Base Health: 0", {
      fontSize: "16px",
      fill: "#fff",
    });
    this.turretsText = this.add.text(430, 5, "Available Turrets: 0", {
      fontSize: "16px",
      fill: "#fff",
    });
    this.roundTimeText = this.add.text(180, 5, "Round Starts In: 10", {
      fontSize: "16px",
      fill: "#fff",
    });
    this.enemiesText = this.add.text(10, 470, "Enemies Remaining: 0", {
      fontSize: "16px",
      fill: "#fff",
    });
    this.levelText = this.add.text(0, 0, "Level: 0", {
      fontSize: "40px",
      fill: "#fff",
    });
    // center level text
    this.width = this.cameras.main.width;
    this.height = this.cameras.main.height;

    Phaser.Display.Align.In.Center(
      this.levelText,
      this.add.zone(this.width / 2, this.height / 2, this.width, this.height),
    );

    this.hideUIElements();
  }
}
