var accountSid = 'AC951998358fcf4cddaaa0c620ef5b6a94'; // Your Account SID from www.twilio.com/console
var authToken = '0936ea65648cfe0b9a5bcc78418b2ac1';   // Your Auth Token from www.twilio.com/console

var twilio = require('twilio');
var client = new twilio(accountSid, authToken);

client.messages.create({
    body: 'Hello from Joshua Salvador',
    to: '+19803121529',  // Text this number
    from: '+18642077505' // From a valid Twilio number
})
.then((message) => console.log(message.sid));

