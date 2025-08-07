class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  create(data) {
    const { allMovies } = data;
    const { width, height } = this.scale;

    this.cameras.main.fadeIn(500);

    this.add.text(width / 2, height / 2 - 80, 'Guess the Movie', {
      font: '40px Arial',
      color: '#ffffff'
    }).setOrigin(0.5);

    // Tap to start text
    const startText = this.add.text(width / 2, height / 2 + 40, 'Tap to Start', {
      font: '28px Arial',
      color: '#ffffff'
    }).setOrigin(0.5);

    this.tweens.add({
      targets: startText,
      alpha: { from: 1, to: 0.2 },
      duration: 800,
      yoyo: true,
      repeat: -1
    });

    // Start game on first tap
    this.input.once('pointerdown', () => {
      this.cameras.main.fadeOut(500);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start('MainScene', { allMovies: allMovies || [] });
      });
    });
  }
}
