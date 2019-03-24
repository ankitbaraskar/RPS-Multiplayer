var config = {
  apiKey: "AIzaSyDKE13DaVrVncWGu8zACzrjrmPWQIOkIeo",
  authDomain: "rps-multiplayer-d866d.firebaseapp.com",
  databaseURL: "https://rps-multiplayer-d866d.firebaseio.com",
  projectId: "rps-multiplayer-d866d",
  storageBucket: "rps-multiplayer-d866d.appspot.com",
  messagingSenderId: "932502713812"
};
firebase.initializeApp(config);

var database = firebase.database();

// push different connections and use for number of connections
var numberOfconnectionsRef = database.ref("/connections");

// check status of connection
var connectedRef = database.ref(".info/connected");


connectedRef.on("value", function(snapshot) {

  // If they are connected..
  if (snapshot.val()) {

    // remove on disconnect
    numberOfconnectionsRef.onDisconnect().remove();
    
    // Add user to the connections list.
    numberOfconnectionsRef.push(true);

  }
});


// function to display form
function displayInputFormWithSubmit(){
  var form = $("<form>");
  var label = $("<label>");
  var inputText = $("<input>");
  var inputSubmitButton = $("<input>");

  // <label for="input-name">Enter Name: </label>
  label.attr("for","input-name").text("Enter Name: ");
  // <input type="text" id="input-name">
  inputText.attr("type","text").attr("id","input-name");
  // <input type="submit" id="submit-name">
  inputSubmitButton.attr("type","submit").attr("id","submit-name");

  form.append(label).append(inputText).append(inputSubmitButton);
  $("#display-form").append(form);
}


