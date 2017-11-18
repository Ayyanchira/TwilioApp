const http = require('http');
const express = require('express');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
var bodyParser = require('body-parser');
const app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:false}));
var studyEnrolled = false;
app.post('/sms', (request, response) => {

    console.log('fetched message by my server with '+request.body.Body + ' and study enrolled is '+studyEnrolled);

if (request.body.Body == "STARTAPP" && studyEnrolled == false){
    studyEnrolled = true;
    var started = "Welcome to the study."
    sendMessage(started,response);
    var symptomQuestion = "Please indicate your symptom (1)Headache, (2)Dizziness, (3)Nausea, (4)Fatigue, (5)Sadness, (0)None";
    sendMessageWithoutHeader(symptomQuestion,response);
}


  
});


function sendMessage(messageBody,responseObject){
    console.log('Send message is being called');
    const twiml = new MessagingResponse();
    twiml.message(messageBody);
    responseObject.writeHead(200, {'Content-Type': 'text/xml'});
    responseObject.end(twiml.toString());
}

function sendMessageWithoutHeader(messageBody,responseObject){
    console.log('Send message is being called');
    const twiml = new MessagingResponse();
    twiml.message(messageBody);
    responseObject.end(twiml.toString());
}

http.createServer(app).listen(1337, () => {
  console.log('Express server listening on port 1337');
});