class BackgroundScene extends Phaser.Scene {
  constructor() {
    super('BackgroundScene');
  }
  preload() {
    if (!this.textures.exists('bg')) {
      this.load.image('bg', 'assets/bg.jpg');
    }
  }
  create() {
    this.bg = this.add.image(this.scale.width / 2, this.scale.height / 2, 'bg');
    this.bg.setDisplaySize(this.scale.width, this.scale.height);
    this.bg.setDepth(-1000);
    this.scale.on('resize', this.resize, this);
    this.scene.launch('PreloadScene');
  }
  resize(gameSize) {
    const width = gameSize.width;
    const height = gameSize.height;
    this.bg.setPosition(width / 2, height / 2);
    this.bg.setDisplaySize(width, height);
  }
}
