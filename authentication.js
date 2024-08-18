//packages
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const http = require('http');
const dataGenerator = require('./DataGenerator');

//initialize app
const app = express();
//Port
const PORT = process.env.AUTH_SERVER_PORT || 8080;
const HOST = process.env.AUTH_SERVER_HOST || 'localhost';

app.use(bodyParser.json());