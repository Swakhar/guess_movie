class MainScene extends Phaser.Scene {
  constructor() {
    super('MainScene');
    this.letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('');
  }

  init(data) {
    this.data = data;
    this.movies = this.data.allMovies;
    this.maxWrong = 6;
    this.guessed = [];
    this.wrong = 0;
    this.timeLeft = 120;
  }

  preload() {
    // Choose easier (shorter) titles for early rounds
    const easyMovies = this.movies.filter(m => m.title.length <= 10);
    const mediumMovies = this.movies.filter(m => m.title.length <= 15);
    const hardMovies = this.movies;

    if (GameState.round <= 5) {
      this.movie = Phaser.Utils.Array.GetRandom(easyMovies);
    } else if (GameState.round <= 15) {
      this.movie = Phaser.Utils.Array.GetRandom(mediumMovies);
    } else {
      this.movie = Phaser.Utils.Array.GetRandom(hardMovies);
    }
    console.log('chosen', this.movie);
    this.title = this.movie.title;
    this.load.image(this.title , this.movie.backdrop_url);
  }

  create() {
    this.sound.pauseOnBlur = true;
    this.sound.resumeOnFocus = true;
    this.spendCoins(10);

    // 🖼️ Movie Poster
    const poster = this.add.image(this.scale.width / 2, 150, this.title);
    poster.setScale(Math.min(300 / poster.width, 300 / poster.height));
    poster.setAlpha(0);
    this.tweens.add({
      targets: poster,
      alpha: 1,
      duration: 600,
      ease: 'Power2'
    });

    this.maskedText = this.add.text(this.scale.width / 2, 300, this.getMasked(), {
      font: '36px Courier',
      fill: '#ffffff'
    }).setOrigin(0.5);

    // 🧮 HUD (Coins, Strikes, Timer)
    this.createTopBar();

    // ⌨️ Keyboard
    this.createKeyboard();

    // ✏️ Solve Input (and Reveal button)
    this.createSolveInput();

    // Add reward button
    this.addRewardButton();
  }

  createTopBar() {
    this.add.rectangle(this.scale.width / 2, 10, this.scale.width, 50, 0x000000, 0.4).setOrigin(0.5);

    this.coinsText = this.add.text(30, 20, `🪙 ${GameState.coins}`, {
      font: '20px Arial',
      fill: '#fff'
    });

    this.strikesText = this.add.text(this.scale.width / 2 - 50, 20, `❌ ${this.wrong}/${this.maxWrong}`, {
      font: '20px Arial',
      fill: '#ff4444'
    });

    this.timerText = this.add.text(this.scale.width - 100 - 50, 26, `⏱ ${this.timeLeft}s`, {
      font: '20px Arial',
      fill: '#ff4444'
    });

    this.timerEvent = this.time.addEvent({
      delay: 1000,
      callback: this.updateTimer,
      callbackScope: this,
      loop: true
    });
  }

  getMasked() {
    return this.title.split('').map(ch=>{
      if (ch === ' ') return ' ';
      return this.guessed.includes(ch) ? ch : '_';
    }).join(' ');
  }

  createKeyboard() {
    const spacing = 45;
    const startX = this.scale.width / 2 - (spacing * 6);
    const startY = 400;
    const rowLength = 13;

    this.letters.forEach((letter, i) => {
      const x = startX + (i % rowLength) * spacing;
      const y = startY + Math.floor(i / rowLength) * spacing;

      const key = this.add.text(x, y, letter, {
        font: '20px Arial',
        backgroundColor: '#f0f0f0',
        color: '#000',
        padding: 10
      }).setOrigin(0.5).setInteractive();

      key.on('pointerover', () => key.setStyle({ backgroundColor: '#ddd' }));
      key.on('pointerout', () => key.setStyle({ backgroundColor: '#f0f0f0' }));

      key.on('pointerdown', () => {
        this.clickSound?.play();
        key.disableInteractive();
        key.setAlpha(0.5);
        this.handleLetter(letter);
      });
    });

    const revealBtn = this.add.text(this.scale.width / 2, this.scale.height - 120, '💡 Reveal (-10)', {
      font: '22px Arial',
      backgroundColor: '#ffcc00',
      color: '#000',
      padding: 10,
      fontStyle: 'bold'
    })
    .setOrigin(0.5)
    .setInteractive();

    revealBtn.setShadow(2, 2, '#333', 2, true, true);

    revealBtn.on('pointerover', () => {
      revealBtn.setStyle({ backgroundColor: '#ffee00' });
    });
    revealBtn.on('pointerout', () => {
      revealBtn.setStyle({ backgroundColor: '#ffcc00' });
    });

    revealBtn.on('pointerdown', () => {
      this.clickSound?.play();
      this.revealRandomLetter();
    });
  }

  handleLetter(letter) {
    if (this.guessed.includes(letter)) return;
    this.guessed.push(letter);

    if (this.title.includes(letter)) {
      this.maskedText.setText(this.getMasked());
      if (!this.getMasked().includes('_')) {
        this.win();
      }
    } else {
      this.wrong++;
      this.strikesText.setText(`❌ ${this.wrong}/${this.maxWrong}`);

      // 🌀 Shake animation
      this.tweens.add({
        targets: this.maskedText,
        x: this.maskedText.x + 10,
        duration: 50,
        yoyo: true,
        repeat: 3
      });

      if (this.wrong === 3) {
        this.revealRandomLetter();
      }
      if (this.wrong >= this.maxWrong) {
        this.lose();
      }
    }
  }

  createSolveInput() {
    const wrapper = document.createElement('div');
    wrapper.id = 'solveWrapper';
    wrapper.style.position = 'absolute';
    wrapper.style.left = '50%';
    wrapper.style.bottom = '20px';  // ✅ bottom instead of top
    wrapper.style.transform = 'translateX(-50%)';
    wrapper.style.display = 'flex';
    wrapper.style.gap = '10px';
    wrapper.style.alignItems = 'center';
    wrapper.style.zIndex = 1000;

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Guess the movie name';
    input.id = 'solveInput';
    input.style.fontSize = window.innerWidth < 500 ? '14px' : '18px';
    input.style.padding = '10px';
    input.style.borderRadius = '6px';
    input.style.border = '2px solid #ccc';
    input.style.width = '260px';

    const solveBtn = document.createElement('button');
    solveBtn.innerText = 'Solve';
    solveBtn.style.padding = '10px 15px';
    solveBtn.style.fontSize = '16px';
    solveBtn.style.backgroundColor = '#28a745';
    solveBtn.style.color = 'white';
    solveBtn.style.border = 'none';
    solveBtn.style.borderRadius = '5px';
    solveBtn.style.cursor = 'pointer';

    solveBtn.onclick = () => {
      this.clickSound?.play();
      const guess = input.value.trim().toUpperCase();
      if (guess === this.title.toUpperCase()) {
        this.win();
      } else {
        this.wrong = this.maxWrong;
        this.strikesText.setText(`❌ ${this.wrong}/${this.maxWrong}`);
        this.lose();
      }
    };

    wrapper.appendChild(input);
    wrapper.appendChild(solveBtn);
    document.body.appendChild(wrapper);
  }

  addRewardButton() {
    this.rewardBtn = this.add.text(this.scale.width - 20, 20, '🎥', {
      font: '24px Arial',
      backgroundColor: '#fff',
      color: '#222',
      padding: 10
    }).setOrigin(1, 0).setInteractive();

    this.rewardBtn.on('pointerdown', () => {
      if (typeof CrazyGames !== 'undefined' && CrazyGames?.SDK?.rewardedAd) {
        this.scene.pause();
        this.sound.mute = true;

        CrazyGames.SDK.rewardedAd.show({
          onAdFinished: () => {
            this.addCoins(50);
            this.resumeGame();
          },
          onAdSkipped: () => this.resumeGame(),
          onAdError: () => this.resumeGame()
        });
      }
    });
  }

  resumeGame() {
    this.sound.mute = false;
    this.scene.resume();
  }

  updateTimer() {
    this.timeLeft--;
    this.timerText.setText(`⏱ ${this.timeLeft}s`);

    if (this.timeLeft <= 0) {
      this.timerEvent.remove();
      this.scene.start('GameOverScene', {
        won: false,
        title: this.title,
        allMovies: this.movies
      });
    }
  }

  revealRandomLetter() {
    if (!this.spendCoins(10)) {
      alert("Not enough coins to reveal a letter!");
      return;
    } else {
      this.coinsText.setText(`🪙 ${GameState.coins}`)
    }
    const hiddenLetters = this.title
      .split('')
      .filter(ch => ch !== ' ' && !this.guessed.includes(ch));

    if (hiddenLetters.length === 0) return;

    const randomLetter = Phaser.Utils.Array.GetRandom(hiddenLetters);
    this.guessed.push(randomLetter);
    this.maskedText.setText(this.getMasked());
  }

  addCoins(amount) {
    GameState.coins += amount;
    localStorage.setItem('coins', GameState.coins);
  }

  spendCoins(amount) {
    if (GameState.coins >= amount) {
      GameState.coins -= amount;
      localStorage.setItem('coins', GameState.coins);
      return true;
    } else {
      return false;
    }
  }

  shutdown() {
    const wrapper = document.getElementById('solveWrapper');
    if (wrapper) {
      document.body.removeChild(wrapper);
    }
  }

  win() {
    GameState.score += 10;
    this.addCoins(20);
    GameState.round++;
    this.tweens.add({
      targets: this.maskedText,
      scale: 1.5,
      duration: 300,
      ease: 'Bounce.easeOut',
      yoyo: true,
      onComplete: () => {
        this.scene.start('GameOverScene', {
          won: true, title: this.title, allMovies: this.movies, score: GameState.score
        });
      }
    });
  }

  lose() {
    if (typeof CrazyGames !== 'undefined') {
      this.scene.pause();
      this.sound.mute = true;

      CrazyGames.SDK.ad.requestAd('midgame', {
        onAdFinished: () => this.resumeGame(),
        onAdError: () => this.resumeGame(),
        onAdSkipped: () => this.resumeGame()
      });
    }
    this.scene.start('GameOverScene', {
      won: false, title: this.title, allMovies: this.movies, score: GameState.score
    }); 
  }
}
