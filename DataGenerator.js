//Importing libraries
const mongoose = require('mongoose');
const authentication = require('./authentication')
const axios = require('axios');
require('dotenv').config();

let authorizationToken;

//getting aut token
async function getSuccessToken(token){
    authorizationToken = token;
    await DataGeneration();

}

//
//starting data generation
async function DataGeneration(authorizationToken){
    await mongoose.connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true
    });

    //////////////////////
    setInterval(generateAndSendData, 30000);
    ////////////////////
}

// MongoDB schema for Train Location Data
const trainLocationSchema = new mongoose.Schema({
    trainId: String,
    latitude: Number,
    longitude: Number,
    timestamp: Date,
});

// MongoDB model for Train Location Data
const TrainLocation = mongoose.model('TrainLocation', trainLocationSchema);

// Train IDs for two different trains
const trains = [
    { trainId: 'Train1', route: 'Colombo to Kandy' },
    { trainId: 'Train2', route: 'Galle to Colombo' }
];

// Function to generate random GPS coordinates within a specific range
function getRandomCoordinates(baseLat, baseLng, radius = 0.1) {
    const randomOffset = () => (Math.random() - 0.5) * radius * 2;
    return {
        latitude: baseLat + randomOffset(),
        longitude: baseLng + randomOffset()
    };
}

// Base coordinates for each train's route
const trainBaseCoordinates = {
    'Train1': { latitude: 6.9271, longitude: 79.8612 }, // Colombo
    'Train2': { latitude: 6.0535, longitude: 80.2210 }  // Galle
};

// Function to generate and send train location data
async function generateAndSendData() {
    for (const train of trains) {
        const { latitude, longitude } = getRandomCoordinates(trainBaseCoordinates[train.trainId].latitude, trainBaseCoordinates[train.trainId].longitude);
        const locationData = {
            trainId: train.trainId,
            latitude,
            longitude,
            timestamp: new Date()
        };

        // Save data to MongoDB
        const trainLocation = new TrainLocation(locationData);
        await trainLocation.save();
        console.log('Weather data generation completed');

        
    }
}

module.exports = {getSuccessToken};