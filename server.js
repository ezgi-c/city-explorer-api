'use strict';

// requires are similar to imports
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const weatherData = require('./data/weather.json'); // dummy data

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
app.get('/weather', (req, res, next) => {
  try {
    // grab the searchQuery from the request day 
    // const lat = req.query.lat;
    // const lon = req.query.lon;
    // const searchQuery = req.query.searchQuery;
    // OR
    const {lat, lon, searchQuery} = req.query;
    const forecast = new Forecast(searchQuery);
    const forecastArray = forecast.getForecast();
    res.status(200).send(forecastArray);
  } catch(error) {
    // next can be used to pass an error to express for the error middleware to handle
    next(error.message);
  }
});

class Forecast {
  constructor(citySearchedFor){
    // find method to find the weather data of the city we searched for
    console.log(citySearchedFor);
    let { data } = weatherData.find(city => city.city_name.toLowerCase() === citySearchedFor.toLowerCase());
    // console.log(data);
    this.data = data;
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
