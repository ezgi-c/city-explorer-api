'use strict';

// requires are similar to imports
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const axios = require('axios');

// const weatherData = require('./data/weather.json'); // dummy data

// create an instance of an Express server
const app = express();

// middleware - tells our express app to use cors
app.use(cors());

// set our PORT variable to tell our Express app where to serve our server
// PORT is NOT bananas! It must be named exactly this, because Heroku looks for a variable named PORT
const PORT = process.env.PORT || 3002;

// define the "home" route aka endpoint
app.get('/', (request, response) => {
  response.send('testing, testing...is this thing on?');
});

// define an endpoint that gets the weather data and returns it to React
app.get('/weather', async (request, response, next) => {
  try {
    const url = `https://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHER_API_KEY}&lat=${request.query.lat}&lon=${request.query.lon}`;
    console.log(request.query.lat, request.query.lon);
    const weatherResponse = await axios.get(url);
    console.log(weatherResponse.data);
    const forecastArray = weatherResponse.data.data.map(day => new Forecast(day));
    response.status(200).send(forecastArray);
  } catch(error) {
    console.error(error);
    next(error);
  }
});

class Forecast {
  constructor(day){
    this.date = day.datetime;
    this.forecast = day.weather.description;
    console.log(day);
  }
}

app.use((error, request, response, next) => {
  response.status(500).send(error);
});

app.listen(PORT, () => console.log(`listening on PORT ${PORT}`));
