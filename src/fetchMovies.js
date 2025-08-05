const fetch = require('node-fetch');
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();

const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3/discover/movie';
const TOTAL_PAGES = 500; // 500 x 20 = 10,000 movies
const DELAY_MS = 300;

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchAllMovies() {
  const allMovies = [];

  for (let page = 1; page <= TOTAL_PAGES; page++) {
    const url = `${BASE_URL}?sort_by=popularity.desc&page=${page}&api_key=${API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();

    const movies = data.results.filter(movie =>
      movie.poster_path &&
      movie.backdrop_path &&
      movie.overview &&
      movie.overview.trim().length > 0
    ).map(movie => ({
      title: movie.title.toUpperCase(),
      overview: movie.overview,
      poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      backdrop_url: `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`
    }));

    allMovies.push(...movies);
    console.log(`Fetched page ${page}, total: ${allMovies.length}`);
    await delay(DELAY_MS);
  }

  fs.writeFileSync('top_10000_movies.json', JSON.stringify(allMovies, null, 2));
  console.log('🎉 Saved top_10000_movies.json!');
}

fetchAllMovies();
