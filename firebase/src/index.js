
/**
 * provides an example of the most simple process
 *
 * main speech threads:
 * what day is it
 *
 * Dialog model:
 *  Alexa: you have 3 items in your todo list
 *  Alexa: would you like to add an item
 *  User: yes
 *  Alexa: what would you like to add?
 *  User: wash the dog
 *	Alexa: wash the dog added to the list
 *  Alexa: would you like to add anything else?
 *  User: no
 *  Alexa: would you like me to read the list to you?
 *  User: yes
 *  Alexa: one, bake a pie, two, clean the oven, three, wash the dog
 *  Alexa: would you like to add another item?
 *  User: no
 *  Alexa: okey doke, bye
 *  
 */

var APP_ID = undefined;//replace with 'amzn1.echo-sdk-ams.app.[your-unique-value-here]';
var AlexaSkill = require('./AlexaSkill');
var FB_URL = 'https://boiling-fire-3340.firebaseio.com/alexa/'

// setup firebase

var Firebase = require('firebase');

// setup patternSkill

var patternSkill = function () {
	AlexaSkill.call(this, APP_ID);
};

patternSkill.prototype = Object.create(AlexaSkill.prototype);
patternSkill.prototype.constructor = patternSkill;

// default intent
 
patternSkill.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
	//
};

// intent handlers

patternSkill.prototype.intentHandlers = {
	"ReadList": function (intent, session, response) {
		readList(intent, session, response);
	},

	"AddItem": function (intent, session, response) {
		addItem(intent, session, response);
	},

	"AMAZON.HelpIntent": function (intent, session, response) {
		var speechText = "Add an item by saying Add";
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

function readList(intent, session, response){
	var speechText = "Your list is empty. get busy buster.";

	fbGetList(function(todos){
		var speechText = "Your list is empty. get busy buster.";
		if(todos.length > 0){
			speechText = "Your list consists of the following " + todos.length + " items. ";
			for(i=0; i<todos.length; i++){
				speechText += todos[i] + ", ";
			}
		}
		var speechOutput = {
			speech: speechText,
			type: AlexaSkill.speechOutputType.PLAIN_TEXT
		};		
		response.tellWithCard(speechOutput, "todo list", speechText);
	})
}

function fbGetList(cback){

	var fbRef = new Firebase(FB_URL);
	var items = [];

	fbRef.once("value", function(snapshot) {
		snapshot.forEach(function(childSnapshot) {
			var key = childSnapshot.key();
			// childData will be the actual contents of the child
			var childData = childSnapshot.val();
			items.push(childData.item)
		});
		cback(items)
	});

}

function addItem(intent, session, response) {
	var speechOutput = {
		speech: "add an item",
		type: AlexaSkill.speechOutputType.PLAIN_TEXT
	};
	response.tell(speechOutput);
}

// firebase functions
// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
	// Create an instance of the  patternSkill.
	var skill = new patternSkill();
	skill.execute(event, context);
};
