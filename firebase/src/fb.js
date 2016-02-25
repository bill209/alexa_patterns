var Firebase = require('firebase');
var fbRef = new Firebase('https://boiling-fire-3340.firebaseio.com/Alexa');
//fbRef.set("alexa over here");

// Attach an asynchronous callback to read the data at our posts reference
fbRef.on("value", function(snapshot) {
  console.log("value: ",snapshot.val());
}, function (errorObject) {
  console.log("The read failed: " + errorObject.code);
});
