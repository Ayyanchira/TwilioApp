const http = require('http');
const express = require('express');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
var bodyParser = require('body-parser');
const app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:false}));

app.post('/sms', (request, response) => {
    const twiml = new MessagingResponse();
    // console.log(JSON.stringify(request,censor(req)));
    console.log('fetched message by my server with '+request.body.Body);
    twiml.message('The Robots are coming! Head for the hills!');

  response.writeHead(200, {'Content-Type': 'text/xml'});
  response.end(twiml.toString());
});

http.createServer(app).listen(1337, () => {
  console.log('Express server listening on port 1337');
});