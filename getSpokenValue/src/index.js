
/**
 * dad: an alexa app to repeat anything the user says (max words > 9)
 *
 * Dialog model:
 *  User: "Alexa, ask parrot it was the best of times
 *  Alexa: "it was the best of times"
 * 
 * author: bill rowland
 * git: https://github.com/bill209 
 */

var APP_ID = undefined;//replace with 'amzn1.echo-sdk-ams.app.[your-unique-value-here]';

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
 	session.attributes.msgText = "nothing here, move along.";
	mainIntent(intent, session, response);
};

// intent handlers

patternSkill.prototype.intentHandlers = {
	"MainIntent": function (intent, session, response) {
		mainIntent(intent, session, response);
	},

	"AMAZON.HelpIntent": function (intent, session, response) {
		var speechOutput = {
			speech: session.attributes.msgText,
			type: AlexaSkill.speechOutputType.PLAIN_TEXT
		};
		var repromptOutput = {
			speech: session.attributes.msgText,
			type: AlexaSkill.speechOutputType.PLAIN_TEXT
		};
		// For the repromptText, play the speechOutput again
		response.ask(speechOutput, repromptOutput);
	},
	"AMAZON.StopIntent": function (intent, session, response) {
		response.tell(session.attributes.msgText);
	},

	"AMAZON.CancelIntent": function (intent, session, response) {
		response.tell(session.attributes.msgText);
	}
};

// just repeat whatever was spoken

function mainIntent(intent, session, response) {
	var interpretedValue = intent.slots.randomWords.value;
	var speechText = interpretedValue;

	var speechOutput = {
		speech: speechText,
		type: AlexaSkill.speechOutputType.PLAIN_TEXT
	};

	response.tellWithCard(speechOutput, "get spoken value", intent.slots.randomWords.value);
}

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
	// Create an instance of the  patternSkill.
	var skill = new patternSkill();
	skill.execute(event, context);
};
