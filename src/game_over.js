class GameOverScene extends BaseScene {
  constructor() {
    super('GameOverScene');
  }

  async create(data) {
    this.scene.get('MainScene')?.shutdown();

    const { won, title, score, allMovies } = data;
    const centerX = this.scale.width / 2;
    const centerY = this.scale.height / 2;
    let offsetY = -120;

    this.add.text(centerX, centerY + offsetY, won ? '🎉 You Won!' : '😢 You Lost!', {
      font: '36px Arial',
      fill: won ? '#4CAF50' : '#F44336',
      fontStyle: 'bold',
      backgroundColor: '#111',
      padding: { x: 20, y: 10 },
      borderRadius: 8
    }).setOrigin(0.5);

    offsetY += 60;
    this.add.text(centerX, centerY + offsetY, `🎬 Movie: ${title}`, {
      font: '24px Arial',
      fill: '#ffffff'
    }).setOrigin(0.5);

    offsetY += 40;
    this.add.text(centerX, centerY + offsetY, `🏆 Score: ${score}`, {
      font: '24px Arial',
      fill: '#ffffff'
    }).setOrigin(0.5);

    // Fetch and show high scores right here
    offsetY += 40;
    const highs = await this.fetchHighScores(score);

    this.add.text(centerX, centerY + offsetY, '🏅 High Scores:', {
      font: '22px Arial', fill: '#FFD700', fontStyle: 'bold'
    }).setOrigin(0.5);

    offsetY += 30;
    const playerName = localStorage.getItem('playerName');
    highs.slice(0, 5).forEach((entry, i) => {
      const isPlayer = entry.name === playerName;
      this.add.text(centerX, centerY + offsetY + i * 30, `${i + 1}. ${entry.name}: ${entry.score}`, {
        font: '20px Arial',
        fill: isPlayer ? '#00E676' : '#ffffff',
        fontStyle: isPlayer ? 'bold' : 'normal'
      }).setOrigin(0.5);
    });

    offsetY += 180;
    this.add.text(centerX, centerY + offsetY, '▶️ Play Again', {
      font: '22px Arial',
      backgroundColor: '#2196F3',
      color: '#fff',
      padding: { x: 20, y: 10 },
      borderRadius: 5
    })
    .setOrigin(0.5)
    .setInteractive()
    .on('pointerdown', () => {
      this.scene.start('MainScene', { allMovies });
    });

    offsetY += 60;

    const shareBtn = this.add.text(centerX, centerY + offsetY, '🔗 Share', {
      font: '22px Arial',
      backgroundColor: '#4CAF50',
      color: '#fff',
      padding: { x: 20, y: 10 },
      borderRadius: 5
    })
    .setOrigin(0.5)
    .setInteractive()
    .on('pointerdown', async () => {
      const shareData = {
        title: '🎬 Movie Master',
        text: 'Try to beat my score in Movie Master',
        url: window.location.href
      };
      if (navigator.share) {
        try {
          await navigator.share(shareData);
        } catch (e) {
          // User cancelled share
        }
      } else {
        // Fallback: copy to clipboard
        try {
          await navigator.clipboard.writeText(shareData.url);
          shareBtn.setText('✅ Link Copied!');
          setTimeout(() => shareBtn.setText('🔗 Share'), 2000);
        } catch (e) {
          this.showNotice('Copy this link:\n' + shareData.url);
        }
      }
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
