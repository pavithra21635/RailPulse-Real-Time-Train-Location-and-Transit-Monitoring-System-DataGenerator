//Importing libraries
const mongoose = require('mongoose');
const authentication = require('./authentication')
const axios = require('axios');
const trainRoute = require('./trainRoute');
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
    
    // setInterval(generateAndSaveData, 30000);
    setInterval(() => generateAndSaveData('train1', 'route1'), 30000); // Train 1 with route 1
    setInterval(() => generateAndSaveData('train2', 'route2'), 30000);
    
}



//Train location data schema
////////////////////////
const trainLocationSchema = new mongoose.Schema({
    trainId: String,
    latitude: Number,
    longitude: Number,
    timestamp: Date,
});

// MongoDB model for Train Location Data
const TrainLocation = mongoose.model('TrainLocation', trainLocationSchema);


// // Initialize current waypoint index
// let currentWaypointIndex = 0;

let currentWaypointIndices = {
    train1: 0,
    train2: 0,
};






// Function to generate and send train location data
async function generateAndSaveData(trainId, routeKey) {
    const currentWaypointIndex = currentWaypointIndices[trainId];
    const waypoint = trainRoute[routeKey][currentWaypointIndex];
       
        const locationData = {
            trainId: trainId,
            latitude: waypoint.latitude,
            longitude: waypoint.longitude,
            timestamp: new Date()
        };

        console.log('Sending location data to database for ${trainId}:', locationData);

        // Save data to MongoDB
        const trainLocation = new TrainLocation(locationData);
        await trainLocation.save();
        console.log('Location data generation completed');

        // Move to the next waypoint
    currentWaypointIndices[trainId] = (currentWaypointIndices[trainId] + 1) % trainRoute[routeKey].length;
}


module.exports = {getSuccessToken};