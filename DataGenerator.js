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

    // Define all trains and routes
    const trains = [
        { trainId: 'Colombo to kandy', routeKey: 'route1' },
        { trainId: 'Colombo to negombo', routeKey: 'route2' },
        { trainId: 'Colombo to awissawella', routeKey: 'route3' },
        { trainId: 'Colombo to puttalam', routeKey: 'route4' },
        { trainId: 'Colombo to Galle', routeKey: 'route5' },
        { trainId: 'Colombo to Polgahawela', routeKey: 'route6' },
        { trainId: 'Colombo to Padukka', routeKey: 'route7' },
        { trainId: 'Colombo to Mahawa', routeKey: 'route8' },
        { trainId: 'Colombo to Anuradhapura', routeKey: 'route9' },
        { trainId: 'Colombo to kurunegala', routeKey: 'route10' },
    ];
    
    // setInterval(generateAndSaveData, 30000);
    setInterval(() => {
        trains.forEach(train => generateAndSaveData(train.trainId, train.routeKey));
    }, 30000);
    
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

let currentWaypointIndices = {
    'Colombo to kandy': 0,
    'Colombo to negombo': 0,
    'Colombo to awissawella': 0, 
    'Colombo to puttalam': 0, 
    'Colombo to Galle': 0, 
    'Colombo to Polgahawela': 0, 
    'Colombo to Padukka': 0,
    'Colombo to Mahawa': 0,
    'Colombo to Anuradhapura': 0,
    'Colombo to kurunegala': 0
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