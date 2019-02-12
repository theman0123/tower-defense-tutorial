import "phaser";
import map from "../config/map";
import levelConfig from "../config/levelConfig";
import Enemy from "../object/Enemy";
import Turret from "../object/Turret";
import Bullet from "../object/Bullet";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super("Game");
  }
  init() {
    this.availableTurrets = levelConfig.initial.numOfTurrets;
    this.baseHealth = levelConfig.initial.baseHealth;
    this.level = 1;
    this.map = map;
    this.nextEnemy = 0;
    this.remainingEnemies =
      levelConfig.initial.numOfEnemies +
      this.level * levelConfig.incremental.numOfEnemies;
    this.roundStarted = false;
    this.score = 0;

    // get UI ready
    this.events.emit("displayUI");
    this.events.emit("updateHealth", this.baseHealth);
    this.events.emit("updateScore", this.score);
    this.events.emit("updateTurrets", this.availableTurrets);
    this.events.emit("updateEnemies", this.remainingEnemies);
    // reference UI scene
    this.UIScene = this.scene.get("UI");
  }

  addBullet(x, y, angle) {
    let bullet = this.bullets.getFirstDead();
    if (!bullet) {
      bullet = new Bullet(this, 0, 0);
      this.bullets.add(bullet);
    }
    bullet.fire(x, y, angle);
  }

  canPlaceTurret(x, y) {
    return this.map[y][x] === 0 && this.availableTurrets > 0;
  }

  create() {
    // begin round counter
    this.events.emit("startRound", this.level);
    // begin round
    this.UIScene.events.on("roundReady", () => {
      this.roundStarted = true;
    });
    this.createMap();
    this.createPath();
    this.createCursor();
    this.createGroups();
  }

  createCursor() {
    this.cursor = this.add.image(32, 32, "cursor");
    this.cursor.setScale(2);
    this.cursor.alpha = 0;

    this.input.on("pointermove", pointer => {
      // note: tiles are 64 x 64
      let y = Math.floor(pointer.y / 64);
      let x = Math.floor(pointer.x / 64);
      if (this.canPlaceTurret(x, y)) {
        this.cursor.setPosition(x * 64 + 32, y * 64 + 32);
        this.cursor.alpha = 0.8;
      } else {
        this.cursor.alpha = 0;
      }
    });
  }

  createGroups() {
    // enemies // -> why physics here but not with 'this.turrets'
    this.enemies = this.physics.add.group({
      classType: Enemy,
      runChildUpdate: true,
    });
    // handle turrets
    this.turrets = this.add.group({ classType: Turret, runChildUpdate: true });
    // bullets
    this.bullets = this.physics.add.group({
      classType: Bullet,
      runChildUpdate: true,
    });

    this.physics.add.overlap(
      this.enemies,
      this.bullets,
      this.damageEnemy.bind(this),
    );
    this.input.on("pointerdown", this.placeTurret.bind(this));
  }

  createMap() {
    // create map
    this.bgMap = this.make.tilemap({ key: "level1" });
    // add tileset image
    this.tiles = this.bgMap.addTilesetImage("terrainTiles_default");
    // create background layer
    this.backgroundLayer = this.bgMap.createStaticLayer(
      "Background",
      this.tiles,
      0,
      0,
    );
    // add tower
    this.add.image(480, 480, "base");
  }

  createPath() {
    this.graphics = this.add.graphics();
    this.path = this.add.path(96, -32);
    this.path.lineTo(96, 164);
    this.path.lineTo(480, 164);
    this.path.lineTo(480, 544);

    // to help debug and create lines
    // this.graphics.lineStyle(3, 0xffffff, 1);
    // this.path.draw(this.graphics);
  }

  damageEnemy(enemy, bullet) {
    if (enemy.active === true && bullet.active === true) {
      bullet.setActive(false);
      bullet.setVisible(false);

      // decrease enemy health
      enemy.receiveDamage(levelConfig.initial.bulletDamage);
    }
  }

  getEnemy(x, y, distance) {
    let enemyUnits = this.enemies.getChildren();
    for (let i = 0; i < enemyUnits.length; i++) {
      if (
        enemyUnits[i].active &&
        Phaser.Math.Distance.Between(x, y, enemyUnits[i].x, enemyUnits[i].y)
      ) {
        return enemyUnits[i];
      }
    }
    return false;
  }

  increaseLevel() {
    // stop round
    this.roundStart = false;
    // increment level
    this.level++;
    // increment number of turrets
    this.updateTurrets(levelConfig.incremental.numOfTurrets);
    // increment number of enemies
    this.updateEnemies(
      levelConfig.initial.numOfEnemies +
        this.level * levelConfig.incremental.numOfEnemies,
    );
    // start new round/level
    this.events.emit("startRound", this.level);
  }

  placeTurret(pointer) {
    // note: tiles are 64 x 64
    let y = Math.floor(pointer.y / 64);
    let x = Math.floor(pointer.x / 64);

    if (this.canPlaceTurret(x, y)) {
      let turret = this.turrets.getFirstDead();
      if (!turret) {
        turret = new Turret(this, x, y, this.map);
        this.turrets.add(turret);
      }
      turret.setActive(true);
      turret.setVisible(true);
      turret.place(x, y);
      // limit # of placed turrets
      this.updateTurrets(-1);
    }
  }

  update(time, delta) {
    // new enemy?

    if (
      time > this.nextEnemy &&
      this.roundStarted &&
      this.enemies.countActive(true) < this.remainingEnemies
    ) {
      let enemy = this.enemies.getFirstDead();
      if (!enemy) {
        enemy = new Enemy(this, 0, 0, this.path);
        this.enemies.add(enemy);
      }
      if (enemy) {
        enemy.setActive(true);
        enemy.setVisible(true);

        // set position @ start
        enemy.startOnPath(this.level);
        this.nextEnemy = time + 2000;
      }
    }
  }

  updateEnemies(numberOfEnemies) {
    this.remainingEnemies += numberOfEnemies;
    this.events.emit("updateEnemies", this.remainingEnemies);
    if (this.remainingEnemies <= 0) {
      this.increaseLevel();
    }
  }

  updateHealth(health) {
    this.baseHealth -= health;
    this.events.emit("updateHealth", this.baseHealth);

    if (this.baseHealth <= 0) {
      this.events.emit("hideUI");
      this.scene.start("Title");
    }
  }

  updateScore(score) {
    this.score += score;
    this.events.emit("updateScore", this.score);
  }

  updateTurrets(numberOfTurrets) {
    this.availableTurrets += numberOfTurrets;
    this.events.emit("updateTurrets", this.availableTurrets);
  }
}
