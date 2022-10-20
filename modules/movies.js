'use strict';

const axios = require('axios');

const cache = require('./cache.js');

function getMovies(request, response) {
  const searchQuery = request.query.searchQuery;
  const key = 'movies-' + searchQuery;
  if (cache[key] && (Date.now() - cache[key].timestamp < 2,628000000)) { // 1 month in milliseconds
    console.log('getting info from cache (cache hit): ', key);
    response.status(200).send(cache[key]);
  } else {
    console.log('getting new API data from axios (cache miss) ', key);
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIES_API_KEY}&query=${searchQuery}`;
    axios
      .get(url)
      .then(movieResponse => {
        const moviesArray = movieResponse.data.results.map(movie => new Movie(movie));
        // console.log(movieResponse.data);
        cache[key] = moviesArray;
        cache[key].timestamp = Date.now();
        console.log(cache[key].timestamp);
        console.log('putting the new data in cache: ', cache);
        response.status(200).send(moviesArray);
      }).catch(err => {
        console.error(err);
        response.status(500).send(`server error: ${err}`);
      });
  }
}

class Movie {
  constructor(movie){
    this.title = movie.original_title;
    this.overview = movie.overview;
    this.average_votes = movie.vote_average;
    this.total_votes = movie.vote_count;
    this.poster_path = movie.poster_path;
    this.image_url = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
    this.popularity = movie.popularity;
    this.released_on = movie.release_date;
    // console.log(movie);
  }
}


module.exports = getMovies;
