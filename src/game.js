const config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  parent: 'phaser-game',
  dom: {
    createContainer: true
  },
  scene: [
    BackgroundScene,
    PreloadScene,
    BootScene,
    BaseScene,
    MainScene,
    GameOverScene
  ],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  audio: {
    disableWebAudio: false
  }
};

window.GameState = {
  score: 0,
  round: 1,
  coins: parseInt(localStorage.getItem('coins') || '100')
};

const game = new Phaser.Game(config);
