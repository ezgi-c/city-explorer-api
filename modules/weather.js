'use strict';

const axios = require('axios');

function getWeather(request, response) {
  const url = `https://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHER_API_KEY}&lat=${request.query.lat}&lon=${request.query.lon}&days=7&units=F`;
  // console.log(request.query.lat, request.query.lon);
  axios
    .get(url)
    .then(weatherResponse => {
      const forecastArray = weatherResponse.data.data.map(day => new Forecast(day));
      // console.log(weatherResponse.data);
      response.status(200).send(forecastArray);
    }).catch(err => {
      console.error(err);
      response.status(500).send(`server error: ${err}`);
    });
}


class Forecast {
  constructor(day){
    this.date = day.datetime;
    this.forecast = `Low of ${day.low_temp}℉, high of ${day.high_temp}℉ with ${day.weather.description.toLowerCase()}`;
    // console.log(day);
  }
}


module.exports = getWeather;
