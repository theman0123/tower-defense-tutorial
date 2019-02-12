import "phaser";

export default class PreloaderScene extends Phaser.Scene {
  constructor() {
    super("Preloader");
  }

  init() {
    this.readyCount = 0;
  }

  preload() {
    // time event for logo
    // TODO - update delayedCall to 3000
    this.timedEvent = this.time.delayedCall(2000, this.ready, [], this);
    this.createPreloader();
    this.loadAssets();
  }

  createPreloader() {
    this.width = this.cameras.main.width;
    this.height = this.cameras.main.height;
    // add logo image
    this.logo = this.add.image(this.width / 2, this.height / 2 - 100, "logo");

    // build loading bar and container
    this.progressBar = this.add.graphics();
    this.progressBox = this.add.graphics();

    // display progess bar
    this.progressBox.fillStyle(0x222222, 0.8);
    this.progressBox.fillRect(
      this.width / 2 - 160,
      this.height / 2 - 30,
      320,
      50,
    );

    // loading text
    this.loadingText = this.make.text({
      x: this.width / 2,
      y: this.height / 2 - 50,
      text: "Loading...",
      style: {
        font: "20px monospace",
        fill: "#ffffff",
      },
    });
    this.loadingText.setOrigin(0.5, 0.5);

    // percent text
    this.percentText = this.make.text({
      x: this.width / 2,
      y: this.height / 2 - 5,
      text: "0%",
      style: {
        font: "18px monospace",
        fill: "#ffffff",
      },
    });
    this.percentText.setOrigin(0.5, 0.5);
    // loading assets
    this.loadingAssetsText = this.make.text({
      x: this.width / 2,
      y: this.height / 2 + 50,
      text: "",
      style: {
        font: "18px monospace",
        fill: "#ffffff",
      },
    });
    this.loadingAssetsText.setOrigin(0.5, 0.5);

    // update progress bar
    this.load.on("progress", value => {
      this.percentText.setText(parseInt(value * 100) + "%");
      this.progressBar.clear();
      this.progressBar.fillStyle(0xfffff, 1);
      this.progressBar.fillRect(
        this.width / 2 - 150,
        this.height / 2 - 20,
        300 * value,
        30,
      );
    });

    // update file progress text
    this.load.on("fileprogress", file => {
      this.loadingAssetsText.setText(`Loading asset: ${file.key}`);
    });

    // remove progress bar when complete
    this.load.on("complete", () => {
      this.progressBox.destroy();
      this.progressBar.destroy();
      this.loadingAssetsText.destroy();
      this.loadingText.destroy();
      this.percentText.destroy();
      this.ready();
    });
  }

  loadAssets() {
    // load assets for game
    this.load.image("bullet", "assets/level/bulletDark2_outline.png");
    this.load.image("tower", "assets/level/tank_bigRed.png");
    this.load.image("enemy", "assets/level/tank_sand.png");
    this.load.image("base", "assets/level/tankBody_darkLarge_outline.png");
    this.load.image("title", "assets/ui/title.png");
    this.load.image("cursor", "assets/ui/cursor.png");
    this.load.image("blueButton1", "assets/ui/blue_button02.png");
    this.load.image("blueButton2", "assets/ui/blue_button03.png");

    // tilemap in JSON format
    this.load.tilemapTiledJSON("level1", "assets/level/level1.json");
    this.load.spritesheet(
      "terrainTiles_default",
      "assets/level/terrainTiles_default.png",
      { frameWidth: 64, frameHeight: 64 },
    );
  }

  ready() {
    this.readyCount++;
    if (this.readyCount === 2) {
      this.scene.start("Title");
    }
  }
}
