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
var symptomDescribed = false;
var symptomScaled = false;
var symptomScale = "";
var numberOfLoop = 0;
var symptom = ""
var dictSymptom = []; // create an empty array
var dictionarySymptom = {"1": "Headache","2":"Dizziness","3":"Nausea","4":"Fatigue","5":"Sadness"};
var dictionarySeverity = {"1": "mild","2":"mild","3":"moderate","4":"severe"};

app.post('/sms', (request, response) => {

    console.log('fetched message by my server with '+request.body.Body + ' and study enrolled is '+studyEnrolled);

if (request.body.Body == "STARTAPP" && studyEnrolled == false){
    studyEnrolled = true;
    var started = "Welcome to the study."
    sendMessage(started,response);
    var symptomQuestion = "Please indicate your symptom (1)Headache, (2)Dizziness, (3)Nausea, (4)Fatigue, (5)Sadness, (0)None";
    sendMessageWithoutHeader(request.body.From,symptomQuestion);
}
if (studyEnrolled == true){
    if(request.body.Body == "0" || request.body.Body == "1" || request.body.Body == "2" || request.body.Body == "3" || request.body.Body == "4" || request.body.Body == "5"){
        if (symptomDescribed == false){
            symptom = request.body.Body
            symptomDescribed = true;
            scaleMessage = "On a scale from 0 (none) to 4 (severe), how would you rate your "+dictionarySymptom[symptom] +" in the last 24 hours?"
            sendMessage(scaleMessage,response);
        }
        else if (symptomScaled == false){
            symptomScale = request.body.Body;
            symptomScaled = true;
            if (symptomScale == "0"){
                answer = "You do not have a"+dictionarySymptom.symptom;
            }else{
                answer = "You have a "+dictionarySeverity[symptomScale]+" "+dictionarySymptom.symptom;
            }
            sendMessage(answer,response);
            numberOfLoop = numberOfLoop + 1;
            if (numberOfLoop < 3){
                symptomDescribed = false;
                symptomScaled = false;
                var symptomQuestion = "Please indicate your symptom (1)Headache, (2)Dizziness, (3)Nausea, (4)Fatigue, (5)Sadness, (0)None";
                sendMessageWithoutHeader(request.body.From,symptomQuestion);
            }
            else{
                var greeting = "Thank you and see you soon";
                sendMessageWithoutHeader(request.body.From,greeting);
            }
        }
    }
}

});


function sendMessage(messageBody,responseObject){
    console.log('Send message is being called');
    const twiml = new MessagingResponse();
    twiml.message(messageBody);
    responseObject.writeHead(200, {'Content-Type': 'text/xml'});
    responseObject.end(twiml.toString());
}

function sendMessageWithoutHeader(from,messageBody){
    console.log('Send message is being called');
    // const twiml = new MessagingResponse();
    // twiml.message(messageBody);
    // responseObject.end(twiml.toString());
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