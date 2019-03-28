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

    var getInputName;

    // display submit form only if connected
    displayInputFormWithSubmit();

    $("#submit-name").on("click", function (event) {

      event.preventDefault();

      getInputName = $("#input-name").val().trim();

      // remove on disconnect
      numberOfconnectionsRef.child(getInputName).onDisconnect().remove();

      // Add user to the connections list.
      numberOfconnectionsRef.update({
        [getInputName]:
        {
          choice: "true",
          wins: 0,
          losses: 0,
          ties: 0

        }

      });

      // hide form by making it empty
      $("#display-form").empty();
      // push RPS buttons to screen only once submit is clicked or entered
      makeButtonsForRPS();

      $(".choice-button-class").on("click", function () {

        var choiceFromButton = $(this).val();
        // console.log(choiceFromButton);

        numberOfconnectionsRef.child(getInputName).child("choice").set(choiceFromButton);

      });

      // var numberofplayers;
      numberOfconnectionsRef.limitToFirst(2).on("value", function (snapshot) {

        // var numberofplayers = snapshot.numChildren();
        // console.log(numberofplayers);

        var choiceFromPlayerOne;
        var choiceFromPlayerTwo;

        var playerOneKey;
        var playerTwoKey;

        var wins;
        var losses;
        var ties;

        displayScore(snapshot,getInputName);

        snapshot.forEach(function (childsnapshot) {
          if (getInputName == childsnapshot.key) {
            playerOneKey = childsnapshot.key;
            // console.log(playerOneKey)
            choiceFromPlayerOne = childsnapshot.child("choice").val();
            // console.log("playeronechoice " + choiceFromPlayerOne);
          }
          else {
            playerTwoKey = childsnapshot.key;
            choiceFromPlayerTwo = childsnapshot.child("choice").val();
            // console.log("playertwochoice " + choiceFromPlayerTwo);
          }
        });

        if (choiceFromPlayerOne != "true" && choiceFromPlayerTwo != "true") {


          // to cancel infinite loop
          numberOfconnectionsRef.child(playerOneKey).child("choice").set("true");
          numberOfconnectionsRef.child(playerTwoKey).child("choice").set("true");

          if (choiceFromPlayerOne && choiceFromPlayerTwo) {

            if ((choiceFromPlayerOne == "rock" && choiceFromPlayerTwo == "scissors")
              || (choiceFromPlayerOne == "paper" && choiceFromPlayerTwo == "rock")
              || (choiceFromPlayerOne == "scissors" && choiceFromPlayerTwo == "paper")) {


              snapshot.forEach(function (childsnapshot) {
                if (getInputName == childsnapshot.key) {
                  wins = childsnapshot.child("wins").val();
                  wins ++;
                  console.log(wins);
                  numberOfconnectionsRef.child(childsnapshot.key).child("wins").set(wins);
                  
                }
                else {
                  losses = childsnapshot.child("losses").val();
                  losses++;
                  numberOfconnectionsRef.child(childsnapshot.key).child("losses").set(losses);
                }
              });




              $("#display-choice").text("You Win!");
              setTimeout(removeDisplayChoiceAfterCoupleSeconds, 3000);
            }
            else if (choiceFromPlayerOne == choiceFromPlayerTwo) {


              snapshot.forEach(function (childsnapshot) {
                if (getInputName == childsnapshot.key) {
                  ties = childsnapshot.child("ties").val();
                  ties ++;
                  console.log(ties);
                  numberOfconnectionsRef.child(childsnapshot.key).child("ties").set(ties);
                  
                }
                else {
                  ties = childsnapshot.child("ties").val();
                  ties++;
                  numberOfconnectionsRef.child(childsnapshot.key).child("ties").set(ties);
                }
              });

              $("#display-choice").text("You Tied!");
              setTimeout(removeDisplayChoiceAfterCoupleSeconds, 3000);
            }
            else {
              $("#display-choice").text("You Lose!");
              setTimeout(removeDisplayChoiceAfterCoupleSeconds, 3000);
            }
          }

          // numberOfconnectionsRef.child(playerOneKey).child("choice").set("true");
          // numberOfconnectionsRef.child(playerTwoKey).child("choice").set("true");

        }


      });


    });



  }
});

// function to display rock, paper, scissors options
function makeButtonsForRPS() {
  $("#display-game").empty();
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
};

function doRPSforPlayerOne(choiceone, choicetwo) {

  if (choiceone && choicetwo) {

    if ((choiceone == "rock" && choicetwo == "scissors")
      || (choiceone == "paper" && choicetwo == "rock")
      || (choiceone == "scissors" && choicetwo == "paper")) {
      $("#display-choice").text("You Win!");
      setTimeout(removeDisplayChoiceAfterCoupleSeconds, 3000);
    }
    else if (choiceone == choicetwo) {
      $("#display-choice").text("You Tied!");
      setTimeout(removeDisplayChoiceAfterCoupleSeconds, 3000);
    }
    else {
      $("#display-choice").text("You Lose!");
      setTimeout(removeDisplayChoiceAfterCoupleSeconds, 3000);
    }
  }

};

function removeDisplayChoiceAfterCoupleSeconds() {
  $("#display-choice").empty();
}

function displayScore(snapshot,getInputName){


  var winsvar = snapshot.child(getInputName).child("wins").val();
  var lossesvar = snapshot.child(getInputName).child("losses").val();
  var tiesvar = snapshot.child(getInputName).child("ties").val();

  $("#title-id").text("Here's Your Score:");
  $("#display-wins").text("Wins: "+winsvar);
  $("#display-losses").text("Losses: "+lossesvar);
  $("#display-ties").text("Ties: "+tiesvar);
  
}
