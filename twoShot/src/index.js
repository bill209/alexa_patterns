
/**
 * dad: an alexa app to tell you the day of the week (in greenwich london)
 *
 * main speech threads:
 * what day is August 15, 1952?
 * repeat thread after confirming another day is desired
 *
 * Dialog model:
 *  User: "Alexa, ask ozzi what day is August 15, 1952?"
 *  Alexa: "August 15, 1952 was a monday"
 *  Alexa: "Would you like another day?"
 *   
 * note: the reason we're using GMT is that node servers report the date as GMT, and local
 * timezones/time are not available to external developers
 */


var APP_ID = undefined;//replace with 'amzn1.echo-sdk-ams.app.[your-unique-value-here]';
var DAYS_OF_WEEK = [ 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday' ];

// The AlexaSkill prototype and helper functions
 
var AlexaSkill = require('./AlexaSkill');

// setup patternSkill

var patternSkill = function () {
	AlexaSkill.call(this, APP_ID);
};

patternSkill.prototype = Object.create(AlexaSkill.prototype);
patternSkill.prototype.constructor = patternSkill;

// default intent
 
patternSkill.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
	startDialog(session, response);
};

// intent handlers

patternSkill.prototype.intentHandlers = {
    "WhatDayIsIntent": function (intent, session, response) {
		handleWhatDayIsIntent(intent, session, response);
	},
	"WantAnotherDayIntent": function (intent, session, response) {
		wantAnotherDayIntent(intent, session, response);
	},

	"AMAZON.HelpIntent": function (intent, session, response) {
		var speechText = "If you are curious as to what day a certain day is " +
							"you may simply ask, what day is a given date";
		var speechOutput = {
			speech: speechText,
			type: AlexaSkill.speechOutputType.PLAIN_TEXT
		};
		var repromptOutput = {
			speech: speechText,
			type: AlexaSkill.speechOutputType.PLAIN_TEXT
		};
		// For the repromptText, play the speechOutput again
		response.ask(speechOutput, repromptOutput);
	},
	"AMAZON.StopIntent": function (intent, session, response) {
		var speechOutput = "Okey doke. Bye.";
		response.tell(speechOutput);
	},

	"AMAZON.CancelIntent": function (intent, session, response) {
		var speechOutput = "Okey doke. Bye.";
		response.tell(speechOutput);
	}
};

// start the dialog upon launch

function startDialog(session, response) {
    // If we wanted to initialize the session to have some attributes we could add those here.
    var cardTitle = "This Day App";
    var repromptText = "With the Day App, you can get the day of any given date. What date would you like the day for?";
    var speechText = "What date would you like the day for?";
    var cardOutput = "Day App: what date would you like the day for? ";

    var speechOutput = {
        speech: speechText,
        type: AlexaSkill.speechOutputType.PLAIN_TEXT
    };
    var repromptOutput = {
        speech: repromptText,
        type: AlexaSkill.speechOutputType.PLAIN_TEXT
    };
    response.askWithCard(speechOutput, repromptOutput, cardTitle, cardOutput);
}

// determine the day given a date

function handleWhatDayIsIntent(intent, session, response) {
	var speechText = "";
	var repromptText = "Would you like another day?";
    var cardOutput = "Day App: what date would you like the day for? ";
	var requestedDate = intent.slots.day;
	var d = "";
	var todayDate = new Date();
    
    // If the user provides a date, then use that, otherwise use the current day of the server
    if (requestedDate && requestedDate.value) {
        d = new Date(requestedDate.value);
    } else {
        d = new Date();
    }
    session.attributes.day = d.getDay();

    // this just makes a little more grammatical sense, depending if the requested day is in the past or future
    var tense = d > todayDate ? " is" : " was";

    // this converts the day into a better format to be spoken
    var mdy = getMonthDayYear(d);

    // get day of given date
    speechText = '<speak><p>' + mdy.date + tense + " a " + DAYS_OF_WEEK[session.attributes.day] + ".</p><p>Would you like another day?</p></speak>";

	var speechOutput = {
		speech: speechText,
		type: AlexaSkill.speechOutputType.SSML
	};
    var repromptOutput = {
        speech: repromptText,
        type: AlexaSkill.speechOutputType.PLAIN_TEXT
    };
    response.askWithCard(speechOutput, repromptOutput, "The Day App", cardOutput);
}

function wantAnotherDayIntent(intent, session, response) {
    var cardTitle = "This Day App";
    var repromptText = "With the Day App, you can get the day of any given date. What date would you like the day for?";
    var speechText = "What date would you like the day for?";
    var cardOutput = "Day App: what date would you like the day for? ";

    var speechOutput = {
        speech: speechText,
        type: AlexaSkill.speechOutputType.PLAIN_TEXT
    };
    var repromptOutput = {
        speech: repromptText,
        type: AlexaSkill.speechOutputType.PLAIN_TEXT
    };
    response.askWithCard(speechOutput, repromptOutput, cardTitle, cardOutput);
}

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
	// Create an instance of the  patternSkill.
	var skill = new patternSkill();
	skill.execute(event, context);
};

// this simply converts date object into readable form
function getMonthDayYear(d){
	var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

	var mdy = { 
			'month' : months[d.getMonth()],	
			'day'	: d.getDate(),
			'year'	: d.getFullYear()
	};

	mdy.date = mdy.month + mdy.day + ', ' + mdy.year;	// April 12 1992

	return mdy;
};

