# 🎬 Guess the Movie

A fun browser game where you guess the movie title from a poster!

---

## 🚀 Setup & Run Locally

1. **Clone the repository:**
   ```sh
   git clone https://github.com/yourusername/guess_movie.git
   cd guess_movie
   ```

2. **Install a local server (if you don't have one):**
   - Using [http-server](https://www.npmjs.com/package/http-server):
     ```sh
     npm install -g http-server
     ```

3. **Start the server:**
   ```sh
   http-server .
   ```
   Or use any other static server (like Python's `python3 -m http.server`).

4. **Open your browser:**
   - Go to [http://localhost:8080](http://localhost:8080) (or the port shown in your terminal).

---

## 🎮 How to Play

- **Goal:** Guess the movie title from the poster before you run out of strikes or time!
- **How to Play:**
  1. Tap/click letters to guess the movie title.
  2. Use the "Reveal" button (costs coins) to show a letter.
  3. Earn coins by watching rewarded ads (if available).
  4. Win by guessing all letters before you run out of strikes or time.
  5. Compete for a high score on the leaderboard!

- **Game Over:**
  - See your score and the correct movie.
  - Play again or share your result with friends!

---

## 🏆 Leaderboard

- On CrazyGames, your score is submitted to the CrazyGames leaderboard.
- On other platforms, a fallback leaderboard is used.

---

## 📱 Mobile & Desktop Friendly

- The game scales to any screen size.
- All buttons are touch/click friendly.

---

## ⚠️ Requirements

- Modern browser (Chrome, Firefox, Edge, Safari).
- No installation needed.

---

## 🖼️ Assets & Licensing

- All images and sounds used must be licensed for commercial use.
- Replace the included assets with your own if needed.

---

## 🛠️ Development Notes

- Built with [Phaser 3](https://phaser.io/).
- Scenes: Background, Preload, Boot, Main, GameOver.
- Uses local JSON for movie data.
- Leaderboard supports CrazyGames SDK and fallback API.

---

## 🤝 Contributing

Pull requests and suggestions are welcome!

---

## 📧 Contact

For questions or support, open an issue or contact