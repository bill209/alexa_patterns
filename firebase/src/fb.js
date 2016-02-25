var Firebase = require('firebase');
var fbRef = new Firebase('https://boiling-fire-3340.firebaseio.com/alexa/');

addItem('bake a pie');
addItem('clean the oven');


function readItems(){
	fbRef.on("value", function(snapshot) {
		console.log("value: ",snapshot.val());
		fb.off();
		process.exit(0);		
	}, function (e) {
		console.log("The read failed: " + e.code);
		fb.off();
		process.exit(1);
	});
}

function readItems2(){
	fbRef.once("value", function(snapshot) {
		// The callback function will get called twice, once for "fred" and once for "barney"
		snapshot.forEach(function(childSnapshot) {
			// key will be "fred" the first time and "barney" the second time
			var key = childSnapshot.key();
			console.log('key: ',key);
			// childData will be the actual contents of the child
			var childData = childSnapshot.val();
			console.log('childData: ', childData);
		});
	});
}	

function addItem(todo){
	console.log('addItem: ', todo);
	fbRef.push().set({ 'item': todo}, function(e){
		if(e) {
			console.log('The write failed: ', e.code);
			process.exit(1);
		} else {
			console.log(fbRef.key());
			process.exit(0);
		}
	});

}

