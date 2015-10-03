
var config = require('./config');
var nodemailer = require('nodemailer');
console.log({service: config.mailer.service || 'Gmail',
    auth: {
        user: config.mailer.auth.user,
        pass: config.mailer.auth.pass
    }});
var transporter = nodemailer.createTransport({
    service: config.mailer.service || 'Gmail',
    auth: {
        user: config.mailer.auth.user,
        pass: config.mailer.auth.pass
    }
});

function send (message, to, subject, cb) {
	var mailObject = {
		to:to,
		from:config.mailer.from,
		replyTo:config.mailer.replyTo,
		cc:config.mailer.cc,
		bcc:config.mailer.bcc,
		subject:subject,
		html:message
	}
	console.log(mailObject);
	transporter.sendMail(mailObject, function(error, info){
	    if(error){
	        console.log("Message not sent: " + error);
	        return cb(error);
	    } else {
	    	console.log('Message sent: ' + info.response);
	    	cb(info);
	    }
	});
}

module.exports =  {
	sendEmailVerificationMail: function(userObj, cb) {
		var messageBody = "<html>"
							+ "<body>"
								+"<p>Hello " + userObj.fname + " " + userObj.lname + ", </p>"
								+"<p>Please cleack here to verify your email id <a href='"+config.appUrl + "/users/verify-email/" + userObj.emailVerificationCode + "'>click</a></p>"
							+ "</body>"
						+ "</html>";
		return send(messageBody, userObj.email, "Verify Email |" + config.appName, cb);

	}
}