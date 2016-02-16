
/**
 * dad: an alexa app to tell you the day of the week (in greenwich london)
 *
 * main speech threads:
 * what day is it
 *
 * Dialog model:
 *  User: "Alexa, ask ozzi what day is it"
 *  Alexa: "monday"
 *  
 * note: the reason we're using GMT is that node servers report the date as GMT, and local
 * timezones/time are not available to external developers
 */

/**
 * App ID for the skill
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
	handleTellMeADadJokeIntent(session, response);
};

// intent handlers

patternSkill.prototype.intentHandlers = {
	"WhatDayIsItIntent": function (intent, session, response) {
		handleWhatDayIsItIntent(session, response);
	},

	"AMAZON.HelpIntent": function (intent, session, response) {
		var speechText = "There are simply times when you need to know the day in Greenwich London. " +
							"You may simply ask, what day is it";
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
		var speechOutput = "Bye.";
		response.tell(speechOutput);
	},

	"AMAZON.CancelIntent": function (intent, session, response) {
		var speechOutput = "Bye.";
		response.tell(speechOutput);
	}
};

// figure out the day in greenwich, london and output it

function handleWhatDayIsItIntent(session, response) {
	var speechText = "";

	// get local date from GMT 
	var GMToffset = new Date().getTimezoneOffset();		// this is in minutes (timezone)
	var MS_PER_MINUTE = 60000;							// ms in a minute

	var d = new Date();
	var localDate = new Date(d - GMToffset * MS_PER_MINUTE);

	session.attributes.day = DAYS_OF_WEEK[localDate.getDay()];	
	speechText = "it is " + session.attributes.day + " in Greenwich, London";

	var speechOutput = {
		speech: speechText,
		type: AlexaSkill.speechOutputType.PLAIN_TEXT
	};
	response.tellWithCard(speechOutput, "What Day Is It?", speechText);
}

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
	// Create an instance of the  patternSkill.
	var skill = new patternSkill();
	skill.execute(event, context);
};
