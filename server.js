'use strict';

// requires are similar to imports
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const getWeather = require('./modules/weather');
const getMovies = require('./modules/movies');
const notFound = require('./modules/notFound');

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

app.get('/weather', getWeather);

app.get('/movies', getMovies);

// if you land on an endpoint not defined
app.use('*', notFound );

app.use((error, request, response, next) => {
  response.status(500).send(error);
});

app.listen(PORT, () => console.log(`listening on PORT ${PORT}`));
