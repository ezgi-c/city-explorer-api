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
    const lat = request.query.lat;
    const lon = request.query.lon;
    console.log(request.query);
    console.log(lat, lon);
    const url = `https://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHER_API_KEY}&lat=${lat}&lon=${lon}`;
    let weatherResponse = await axios.get(url);
    console.log(weatherResponse.data);
    const forecast = new Forecast(lat, lon);
    const forecastArray = forecast.getForecast();
    let data  = weatherResponse.data.find(city => city.lat === lat && city.lon === lon);
    this.data = data;
    response.status(200).send(forecastArray);
  } catch(error) {
    console.log(error);
    // next can be used to pass an error to express for the error middleware to handle
    next(error);
  }
});

// app.get('/photo', async (request, response, next) => {
//   try {
//     // baseURL, endpoint, query, queryParameters
//     const url = `https://api.unsplash.com/search/photos?client_id=${process.env.UNSPLASH_ACCESS_KEY}&query=${request.query.searchQuery}`
//     const photoResponse = await axios.get(url);
//     console.log(photoResponse.data);
//     const photoArray = photoResponse.data.results.map(photo => new Photo(photo));
//     response.status(200).send(photoArray)
//   } catch(error) {
//     console.error(error);
//     next(error);
//   }
// });

// class Photo {
//   constructor(photo) {
//     this.img_url = photo.urls.regular;
//     this.photographer = photo.user.name;
//   }
// }

class Forecast {
  constructor(city){
    // find method to find the weather data of the city we searched for
    console.log(city);
    // console.log(data);
  }

  // a method that gets just the date and desc properties from our days in the data array
  getForecast() {
    return this.data.map(day => ({
      date: day.datetime,
      description: day.weather.description
    }));
  }
}

app.get('/fakeError', (request, response, next) => {
  try {
    const listThatDoesntExists = require('./listThatDoesntExists.js');
    response.send(listThatDoesntExists);
  } catch(error) {
    next(error.message);
  }
});

// error handling middleware MUST be the last app.use() defined in the server file
app.use((error, request, response, next) => {
  console.log(error);
  response.status(500).send(error);
});

// this line of code needs to be the LAST line in the file
// listen tells our app which port to listen on
// which port to serve our server on
app.listen(PORT, () => console.log(`listening on PORT ${PORT}`));
