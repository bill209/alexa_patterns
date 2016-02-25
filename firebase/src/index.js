
/**
 * provides an example of the most simple process
 *
 * main speech threads:
 * what day is it
 *
 * Dialog model:
 *  User: what day is it
 *  Alexa: monday
 *  
 * note: the day is based on GMT, as the Date() routine is being run on node.js, which uses GMT. at this
 * time, amazon does not expose the user's local time or location to the developer.
 */

var APP_ID = undefined;//replace with 'amzn1.echo-sdk-ams.app.[your-unique-value-here]';
var DAYS_OF_WEEK = [ 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday' ];
var AlexaSkill = require('./AlexaSkill');


// setup firebase

var Firebase = require('firebase');
var fbRef = new Firebase('https://boiling-fire-3340.firebaseio.com/Alexa');
//fbRef.set("alexa over here");
var TEST_FB = "";


// setup patternSkill

var patternSkill = function () {
	AlexaSkill.call(this, APP_ID);
};

patternSkill.prototype = Object.create(AlexaSkill.prototype);
patternSkill.prototype.constructor = patternSkill;

// default intent
 
patternSkill.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
	handleWhatDayIsItIntent(response);
};

// intent handlers

patternSkill.prototype.intentHandlers = {
	"WhatDayIsItIntent": function (intent, session, response) {
		handleWhatDayIsItIntent(response);
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

function handleWhatDayIsItIntent(response) {

// Attach an asynchronous callback to read the data at our posts reference
fbRef.on("value", function(snapshot) {
  console.log("value: ",snapshot.val());
	var speechText = "";
	var d = new Date();
	
	// get day of week
	var day = DAYS_OF_WEEK[d.getDay()];	
	speechText = "------------------ " + snapshot.val() + " -----------------";

	var speechOutput = {
		speech: speechText,
		type: AlexaSkill.speechOutputType.PLAIN_TEXT
	};
	response.tellWithCard(speechOutput, "What Day Is It?", speechText);

}, function (errorObject) {
  console.log("The read failed: " + errorObject.code);
});





}

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
	// Create an instance of the  patternSkill.
	var skill = new patternSkill();
	skill.execute(event, context);
};
