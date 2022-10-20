'use strict';

const axios = require('axios');

const cache = require('./cache.js');

function getWeather(request, response) {
  const {lat,lon}=request.query;
  const key = 'weather-' + lat + lon;

  // check if the key is in the cache
  if (cache[key] && (Date.now() - cache[key].timestamp < 345600000)) { // 4 days in milliseconds
    console.log('getting info from cache (cache hit): ', key);
    response.status(200).send(cache[key]);
  } else {
    console.log('getting new API data from axios (cache miss) ', key);
    const url = `https://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHER_API_KEY}&lat=${lat}&lon=${lon}&days=7&units=F`;
    axios
      .get(url)
      // console.log(weatherResponse.data);
      .then(weatherResponse => {
        const forecastArray = weatherResponse.data.data.map(day => new Forecast(day));
        // create a new property on the cache that is the search term
        // the value is going to be the new forecastArray we just created
        cache[key] = forecastArray;
        cache[key].timestamp = Date.now();
        console.log(cache[key].timestamp);
        console.log('putting the new data in cache: ', cache);
        response.status(200).send(forecastArray);
      }).catch(err => {
        console.error(err);
        response.status(500).send(`server error: ${err}`);
      });
  }
}

class Forecast {
  constructor(day){
    this.date = day.datetime;
    this.forecast = `Low of ${day.low_temp}℉, high of ${day.high_temp}℉ with ${day.weather.description.toLowerCase()}`;
    // console.log(day);
  }
}


module.exports = getWeather;
