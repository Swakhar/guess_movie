class BaseScene extends Phaser.Scene {
  constructor(key) {
    super(key);
  }

  showNotice(message) {
    const box = this.add.rectangle(this.scale.width / 2, this.scale.height / 2, 360, 100, 0x000000, 0.75)
      .setOrigin(0.5)
      .setDepth(1000);

    const text = this.add.text(this.scale.width / 2, this.scale.height / 2, message, {
      font: '18px Arial',
      color: '#fff',
      align: 'center',
      wordWrap: { width: 320 }
    }).setOrigin(0.5).setDepth(1001);

    this.time.delayedCall(2500, () => {
      box.destroy();
      text.destroy();
    });
  }
}
