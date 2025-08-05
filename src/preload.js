class PreloadScene extends Phaser.Scene {
  constructor() { super('PreloadScene'); }

  init() {
    this.allMovies = [];
  }
  preload() {
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
    this.scene.start('MainScene', { allMovies: this.allMovies });
  }
}
