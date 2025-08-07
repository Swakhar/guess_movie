class PreloadScene extends Phaser.Scene {
  constructor() { super('PreloadScene'); }

  init() {
    this.allMovies = [];
  }
  preload() {
    const loadingBar = this.add.graphics();
    // Listen for loading progress
      this.load.on('progress', (value) => {
        loadingBar.clear();
        loadingBar.fillStyle(0xffffff, 1); // white bar
        loadingBar.fillRect(
          this.cameras.main.width / 4,
          this.cameras.main.height / 2,
          this.cameras.main.width / 2 * value,
          20
        );
      });
    this.load.on('complete', () => {
      loadingBar.destroy();
    });
    this.input.setDefaultCursor('url(assets/cursor.png), pointer');
    this.load.audio('click', 'assets/click.mp3');
    this.load.audio('bgm', 'assets/bg-music.mp3');
    this.load.json('movies', 'assets/top_movies.json');
  }
  create() {
    // Music
    this.bgm = this.sound.add('bgm', { loop: true, volume: 0.4 });
    this.bgm.play();

    this.clickSound = this.sound.add('click');

    if (typeof CrazyGames !== 'undefined') {
      CrazyGames.SDK.game.loadingStart();
      CrazyGames.SDK.game.gameplayStart();
    }
    this.allMovies = this.cache.json.get('movies');
    this.scene.launch('BootScene', { allMovies: this.allMovies });
  }
}
