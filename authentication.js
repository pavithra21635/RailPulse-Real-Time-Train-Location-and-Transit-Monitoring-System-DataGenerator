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

//defining objects for username,password and key
const databaseUsername = process.env.USERNAME;
const databasePassword = process.env.PASSWORD;
const key = 'SecretKey';

//authenticating user
function authenticateUser(username,password) {
    return new Promise((resolve,reject) => {
        if (username == databaseUsername && password == databasePassword){
            const token = jwt.sign({ username: username }, key);
            resolve(token);
        } else {
            reject(new Error('Invalid username or password'));
        }
    });
}

//starting authentication
function startAuthenticate(){
    app.listen(PORT, () => {
        console.log(`Authentication server is running on port ${PORT}`);
    });

    // Endpoint to start data generation
    app.get('/start', (req, res) => {
    console.log('Data generation triggered from front-end');
    start();
    });

    app.get('/stop', (req, res) => {
        console.log('Stop data generation triggered from front-end');
        dataGenerator.stopDataGeneration();
        res.status(200).send('Data generation stopped');
    });

    

}

function start()
{
    authenticateUser(databaseUsername, databasePassword)
    .then(token => {
        console.log('Authentication successful');
        dataGenerator.getSuccessToken(token);
    })
    .catch(error => {
        console.error('Authentication failed:', error.message);
 
    });
}




module.exports = {startAuthenticate};
