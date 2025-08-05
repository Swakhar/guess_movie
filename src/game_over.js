class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOverScene');
  }

  create(data) {
    // ✅ Clean up solve input from MainScene
    this.scene.get('MainScene')?.shutdown();

    const { won, title, score, allMovies } = data;

    this.add.text(400, 100, won ? 'You Won!' : 'You Lost!', {
      font: '32px Arial', color: won ? '#0f0' : '#f00'
    }).setOrigin(0.5);

    this.add.text(400, 150, `Movie: ${title}`, {
      font: '24px Arial'
    }).setOrigin(0.5);

    this.add.text(400, 200, `Score: ${score}`, {
      font: '24px Arial'
    }).setOrigin(0.5);

    this.saveHighScore(score);

    this.add.text(400, 480, 'Click to Play Again', {
      font: '20px Arial', backgroundColor: '#ddd', color: '#000', padding: 10
    })
    .setOrigin(0.5)
    .setInteractive()
    .on('pointerdown', () => {
      this.scene.start('MainScene', { allMovies });
    });

    this.add.text(400, 550, '🔄 Reset Data', {
      font: '16px Arial',
      color: '#ff0000',
      backgroundColor: '#fff',
      padding: 6
    })
    .setOrigin(0.5)
    .setInteractive()
    .on('pointerdown', () => {
      localStorage.removeItem('highScores');
      localStorage.removeItem('playerName');
      localStorage.removeItem('coins'); // if you're storing coins
      alert("Game data reset. Reloading...");
      location.reload();
    });
  }

  async saveHighScore(score) {
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
    const highs = await res.json();

    this.add.text(400, 260, 'High Scores:', {
      font: '24px Arial', underline: true
    }).setOrigin(0.5);

    highs.forEach((entry, i) => {
      this.add.text(400, 290 + i * 30, `${i + 1}. ${entry.name}: ${entry.score}`, {
        font: '20px Arial'
      }).setOrigin(0.5);
    });
  }
}
