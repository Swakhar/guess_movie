class GameOverScene extends BaseScene {
  constructor() {
    super('GameOverScene');
  }

  async create(data) {
    this.scene.get('MainScene')?.shutdown();

    const { won, title, score, allMovies } = data;
    const centerX = this.scale.width / 2;

    // Base Y position (25% down from top) and line spacing (7% of height)
    const baseY = this.scale.height * 0.25;
    const lineSpacing = this.scale.height * 0.07;

    // Top message: You Won / You Lost
    this.resultText = this.add.text(centerX, baseY,
      won ? '🎉 You Won!' : '😢 You Lost!',
      {
        font: '36px Arial',
        fill: won ? '#4CAF50' : '#F44336',
        fontStyle: 'bold',
        backgroundColor: '#111',
        padding: { x: 20, y: 10 },
        borderRadius: 8
      }
    ).setOrigin(0.5);

    // Movie title
    this.movieText = this.add.text(centerX, baseY + lineSpacing,
      `🎬 Movie: ${title}`,
      {
        font: '24px Arial',
        fill: '#ffffff'
      }
    ).setOrigin(0.5);

    // Score display
    this.scoreText = this.add.text(centerX, baseY + lineSpacing * 2,
      `🏆 Score: ${score}`,
      {
        font: '24px Arial',
        fill: '#ffffff'
      }
    ).setOrigin(0.5);

    // Fetch high scores
    const highs = await this.fetchHighScores(score);

    // High Scores header
    this.highHeader = this.add.text(centerX, baseY + lineSpacing * 3,
      '🏅 High Scores:',
      {
        font: '22px Arial',
        fill: '#FFD700',
        fontStyle: 'bold'
      }
    ).setOrigin(0.5);

    // High score entries
    const startScoresY = baseY + lineSpacing * 4;
    this.scoreEntries = [];
    const playerName = localStorage.getItem('playerName');
    highs.slice(0, 5).forEach((entry, i) => {
      const isPlayer = entry.name === playerName;
      const entryText = this.add.text(
        centerX,
        startScoresY + i * lineSpacing,
        `${i + 1}. ${entry.name}: ${entry.score}`,
        {
          font: '20px Arial',
          fill: isPlayer ? '#00E676' : '#ffffff',
          fontStyle: isPlayer ? 'bold' : 'normal'
        }
      ).setOrigin(0.5);
      this.scoreEntries.push(entryText);
    });

    // Vertical space after the score list
    const afterListY = startScoresY + highs.slice(0, 5).length * lineSpacing + this.scale.height * 0.05;

    // Play Again button
    this.playAgainBtn = this.add.text(centerX, afterListY,
      '▶️ Play Again',
      {
        font: '22px Arial',
        backgroundColor: '#2196F3',
        color: '#fff',
        padding: { x: 20, y: 10 },
        borderRadius: 5
      }
    ).setOrigin(0.5).setInteractive().on('pointerdown', () => {
      this.scene.start('MainScene', { allMovies });
    });

    // Share button, below Play Again
    this.shareBtn = this.add.text(centerX, afterListY + lineSpacing,
      '🔗 Share',
      {
        font: '22px Arial',
        backgroundColor: '#4CAF50',
        color: '#fff',
        padding: { x: 20, y: 10 },
        borderRadius: 5
      }
    ).setOrigin(0.5).setInteractive().on('pointerdown', async () => {
      const shareData = {
        title: '🎬 Movie Master',
        text: 'Try to beat my score in Movie Master',
        url: window.location.href
      };
      if (navigator.share) {
        try {
          await navigator.share(shareData);
        } catch (_) {
          /* User cancelled share */
        }
      } else {
        try {
          await navigator.clipboard.writeText(shareData.url);
          this.shareBtn.setText('✅ Link Copied!');
          setTimeout(() => this.shareBtn.setText('🔗 Share'), 2000);
        } catch (_) {
          this.showNotice('Copy this link:\n' + shareData.url);
        }
      }
    });

    this.scale.on('resize', () => {
      const { width, height } = this.scale;
      const base = height * 0.25;
      const spacing = height * 0.07;
      this.resultText.setPosition(width / 2, base);
      this.movieText.setPosition(width / 2, base + spacing);
      this.scoreText.setPosition(width / 2, base + spacing * 2);
      this.highHeader.setPosition(width / 2, base + spacing * 3);
      this.scoreEntries.forEach((t, i) =>
        t.setPosition(width / 2, base + spacing * 4 + i * spacing)
      );
      const afterList = base + spacing * 4 + this.scoreEntries.length * spacing + height * 0.05;
      this.playAgainBtn.setPosition(width / 2, afterList);
      this.shareBtn.setPosition(width / 2, afterList + spacing);
    });
  }

  async fetchHighScores(score) {
    const sdk = window.CrazyGames?.SDK;
    if (sdk?.leaderboard) {
      await sdk.leaderboard.setScore('movie-quiz', score);
      sdk.leaderboard.show('movie-quiz');
      return [];
    }

    // Fallback for non-CrazyGames
    let name = localStorage.getItem('playerName');
    if (!name) {
      name = prompt("Enter your name:") || 'Player';
      localStorage.setItem('playerName', name);
    }

    await fetch('https://submitscore-waeruwnaja-uc.a.run.app', {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, score })
    });

    const res = await fetch('https://gethighscores-waeruwnaja-uc.a.run.app');
    return await res.json();
  }
}
