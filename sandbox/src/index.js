
/**
 * dad: an alexa app to tell you the day of the week (in greenwich london)
 *
 */

/**
 * App ID for the skill
 */
var APP_ID = undefined;//replace with 'amzn1.echo-sdk-ams.app.[your-unique-value-here]'; 
var AlexaSkill = require('./AlexaSkill');
var sandboxSkill = function () {
	AlexaSkill.call(this, APP_ID);
};
sandboxSkill.prototype = Object.create(AlexaSkill.prototype);
sandboxSkill.prototype.constructor = sandboxSkill;

// default intent
 
sandboxSkill.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
	test(intent, session, response);
};

// intent handlers

sandboxSkill.prototype.intentHandlers = {
	"test": function (intent, session, response) {
		handleTest(intent, session, response);
	},
	"AMAZON.StopIntent": function (intent, session, response) {
		var speechOutput = "Bye.";
		response.tell(speechOutput);
	}
};

// figure out the day in greenwich, london and output it

function handleTest(intent, session, response) {
	var d = new Date();
	var x = [];
	x[0] = "<speak>There is a one second pause here <break time=\"1s\"/> then the speech continues.</speak>";
	x[1] = "<speak>today is <say-as interpret-as='date' format='md'>0323</say-as></speak>";
	x[2] = "<speak><say-as interpret-as='digits'>12345</say-as></speak>";
	var speechText = x[1];

	var speechOutput = {
		speech: speechText,
		type: AlexaSkill.speechOutputType.SSML
	};
	response.tellWithCard(speechOutput, "Playing in the sandbox.", speechText);
}

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
	// Create an instance of the  sandboxSkill.
	var skill = new sandboxSkill();
	skill.execute(event, context);
};
