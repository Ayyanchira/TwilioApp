var accountSid = 'AC951998358fcf4cddaaa0c620ef5b6a94'; // Your Account SID from www.twilio.com/console
var authToken = '0936ea65648cfe0b9a5bcc78418b2ac1';   // Your Auth Token from www.twilio.com/console
var twilio = require('twilio');
var client = new twilio(accountSid, authToken);




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
    sendMessageWithoutHeader(request.body.From,symptomQuestion,response);
}

});


function sendMessage(messageBody,responseObject){
    console.log('Send message is being called');
    const twiml = new MessagingResponse();
    twiml.message(messageBody);
    responseObject.writeHead(200, {'Content-Type': 'text/xml'});
    //responseObject.end(twiml.toString());
}

function sendMessageWithoutHeader(from,messageBody,responseObject){
    console.log('Send message is being called');
    const twiml = new MessagingResponse();
    twiml.message(messageBody);
    responseObject.end(twiml.toString());
    client.messages.create({
        body: messageBody,
        to: from,  // Text this number
        from: '+18642077505' // From a valid Twilio number
    })
    .then((message) => console.log(message.sid));
}

http.createServer(app).listen(1337, () => {
  console.log('Express server listening on port 1337');
});