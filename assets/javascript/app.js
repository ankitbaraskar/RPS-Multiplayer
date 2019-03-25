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


connectedRef.on("value", function (snapshot) {

  // If they are connected..
  if (snapshot.val()) {


    // display submit form only if connected
    displayInputFormWithSubmit();

    $("#submit-name").on("click", function (event) {

      event.preventDefault();

      var getInputName = $("#input-name").val().trim();

      // remove on disconnect
      numberOfconnectionsRef.child(getInputName).onDisconnect().remove();

      // Add user to the connections list.
      numberOfconnectionsRef.update({
        [getInputName]:
        {
          choice: "true"

        }
      });

      // push RPS buttons to screen only once submit is clicked or entered
      makeButtonsForRPS();

      $(".choice-button-class").on("click", function () {

        var choiceFromButton = $(this).val();
        // console.log(choiceFromButton);

        numberOfconnectionsRef.child(getInputName).update({
          choice: choiceFromButton
        });


        database.ref("/connections/"+getInputName+"/choice").on("value",function(snapshot){

          var choiceFromSnapshot = snapshot.val();
          console.log (choiceFromSnapshot);

        });

      });


    });

  }
});

// function to display rock, paper, scissors options
function makeButtonsForRPS() {
  var choices = ["rock", "paper", "scissors"];
  for (let i = 0; i < choices.length; i++) {
    var buttons = $("<button>");
    buttons.attr("value", choices[i]).addClass("choice-button-class").text(choices[i]);
    $("#display-game").append(buttons);
  }
};


// function to display form
function displayInputFormWithSubmit() {
  var form = $("<form>");
  var label = $("<label>");
  var inputText = $("<input>");
  var inputSubmitButton = $("<input>");

  // <label for="input-name">Enter Name: </label>
  label.attr("for", "input-name").text("Enter Name: ");
  // <input type="text" id="input-name">
  inputText.attr("type", "text").attr("id", "input-name");
  // <input type="submit" id="submit-name">
  inputSubmitButton.attr("type", "submit").attr("id", "submit-name");

  form.append(label).append(inputText).append(inputSubmitButton);
  $("#display-form").append(form);
}


