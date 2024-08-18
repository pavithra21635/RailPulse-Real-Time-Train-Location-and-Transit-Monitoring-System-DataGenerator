//Importing libraries
const mongoose = require('mongoose');
const faker = require('faker');
const authentication = require('./authentication')
require('dotenv').config();

let authorizationToken;

//getting aut token
async function getSuccessToken(token){
    authorizationToken = token;
    await DataGeneration();

}

//starting data generation
async function DataGeneration(authorizationToken){
    await mongoose.connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true
    });
}

module.exports = {getSuccessToken};