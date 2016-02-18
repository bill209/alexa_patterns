
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
var http = require('http');
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
	quoter(response);
};

// intent handlers

patternSkill.prototype.intentHandlers = {
	"QOD": function (intent, session, response) {
		quoter(response);
	},
	"Author": function (intent, session, response) {
		author(response);
	},
	"AMAZON.HelpIntent": function (intent, session, response) {
		var speechText = "Quote of the day";
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

function quoter(response) {
	var speechText = "";

	getQOD(function(res){

		if(res.quote != ""){
			speechText = res.quote;
		} else {
			speechText = "Sorry but there was an issue with that request.";
		}

		var speechOutput = {
			speech: speechText,
			type: AlexaSkill.speechOutputType.PLAIN_TEXT
		};
		response.tellWithCard(speechOutput, "Quote of the Day", speechText);

	})
}

function author(response) {
	var speechText = "";

	getQOD(function(res){

		if(res.quote != ""){
			speechText = res.author;
		} else {
			speechText = "Sorry but there was an issue with that request.";
		}

		var speechOutput = {
			speech: speechText,
			type: AlexaSkill.speechOutputType.PLAIN_TEXT
		};
		response.tellWithCard(speechOutput, "Quote of the Day Author", speechText);

	})
}

function getQOD(cback){
	var url = 'http://quotesondesign.com/api/3.0/api-3.0.json';

	http.get(url, function(res) {
		var body = '';

		res.on('data', function (chunk) {
			body += chunk;
		});

		res.on('end', function () {
//			var stringResult = parseJson(body);
			cback(JSON.parse(body));
		});
	}).on('error', function (e) {
		console.log("Got error: ", e);
		cback(JSON.parse(e));		
	});


}

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
	// Create an instance of the  patternSkill.
	var skill = new patternSkill();
	skill.execute(event, context);
};
