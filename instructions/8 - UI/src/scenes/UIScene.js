import 'phaser';

export default class UIScene extends Phaser.Scene {
  constructor() {
    super({ key: 'UI', active: true });
  }

  init() {
    // grab reference to game scene
    this.gameScene = this.scene.get('Game');
  }

  create() {
    this.setupUIElements();
    this.setupEvents();
  }

  setupUIElements() {
    this.scoreText = this.add.text(5, 5, 'Score: 0', { fontSize: '16px', fill: '#fff' });
    this.healthText = this.add.text(10, 490, 'Base Health: 0', { fontSize: '16px', fill: '#fff' });
    this.turretsText = this.add.text(430, 5, 'Available Turrets: 0', { fontSize: '16px', fill: '#fff' });
    this.roundTimeText = this.add.text(180, 5, 'Round Start In: 10', { fontSize: '16px', fill: '#fff' });
    this.hideUIElements();
  }

  hideUIElements() {
    this.scoreText.alpha = 0;
    this.healthText.alpha = 0;
    this.turretsText.alpha = 0;
    this.roundTimeText.alpha = 0;
  }

  setupEvents() {
    this.gameScene.events.on('displayUI', function () {
      this.scoreText.alpha = 1;
      this.healthText.alpha = 1;
      this.turretsText.alpha = 1;
    }.bind(this));

    this.gameScene.events.on('updateScore', function (score) {
      this.scoreText.setText('Score: ' + score);
    }.bind(this));

    this.gameScene.events.on('updateHealth', function (health) {
      this.healthText.setText('Base Health: ' + health);
    }.bind(this));

    this.gameScene.events.on('updateTurrets', function (turrets) {
      this.turretsText.setText('Available Turrets: ' + turrets);
    }.bind(this));

    this.gameScene.events.on('hideUI', function () {
      this.hideUIElements();
    }.bind(this));

    this.gameScene.events.on('startRound', function () {
      this.roundTimeText.alpha = 1;
      var timedEvent = this.time.addEvent({
        delay: 1000,
        callbackScope: this,
        repeat: 9,
        callback: function () {
          this.roundTimeText.setText('Round Start In: ' + timedEvent.repeatCount);
          if (timedEvent.repeatCount === 0) {
            this.events.emit('roundReady');
            this.roundTimeText.alpha = 0;
          }
        }
      });
    }.bind(this));
  }
}
