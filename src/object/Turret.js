import "phaser";

export default class Turret extends Phaser.GameObjects.Image {
  constructor(scene, x, y, map) {
    super(scene, x, y, "tower");

    this.scene = scene;
    this.map = map;
    this.nextTic = 0;
    // add turret to scene/game
    this.scene.add.existing(this);
    this.setScale(-0.8);
  }

  update(time, delta) {
    if (time > this.nextTic) {
      this.fire();
      this.nextTic = time + 1000;
    }
  }

  place(x, y) {
    // 64 is tile size, 32 'centers'
    this.y = y * 64 + 32;
    this.x = x * 64 + 32;
    this.map[y][x] = 1;
  }

  fire() {
    let enemy = this.scene.getEnemy(this.x, this.y, 100);
    if (enemy) {
      let angle = Phaser.Math.Angle.Between(this.x, this.y, enemy.x, enemy.y);
      this.scene.addBullet(this.x, this.y, angle);
      this.angle = (angle + Math.PI / 2) * Phaser.Math.RAD_TO_DEG;
    }
  }
}
