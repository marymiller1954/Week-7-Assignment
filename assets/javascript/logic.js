$(document).ready(function(){

   

//identify the database

 var db = new Firebase("https://train-scheduler-7a07d.firebaseio.com");



    // Submit Button Click to gather the added train information
    $("#submitButton").on("click", function(){
       var trainName = $("#trainNameInput").val().trim();
       var destination = $("#destinationInput").val().trim();
       var firstTrain = $("#firstTrainTimeInput").val().trim();
       var frequency = $("#frequencyInput").val().trim();
       var duration = $("#durationInput").val().trim();

  // Trying to work out how to know which time was the last departure; thinking the last departure time would need to be added to the database  
  // got really lost getting the next departure and arrivalin certain scenarios such as when the previous train has already arrived but the next train hasn't started yet
  //also when adding duration into the equation the results for next arrive time and minutes away don't make sense    
  //        var frequency = moment($("#frequencyInput").val(), "hh:mm").format("X");
//          var lastdeparture = firstTrain;
//          console.log("frequency: ",frequency);
//          var nextdeparture = moment(lastdeparture).add(frequency, "minutes").format("hh:mm");



//console.log("next departure time: ",nextdeparture);
//var lastdeparture = nextdeparture;
//console.log("last departure: ", lastdeparture);



          console.log("pushing to firebase!");
                //Firebase pushes
                db.push({
                  trainName: trainName,
                  destination: destination,
                  firstTrain: firstTrain,
                  frequency: frequency,
                  duration:  duration,
           //       lastdeparture: lastdeparture,
          //        nextdeparture: nextdeparture

      })

      //Empty input boxes after submit
      $("#trainNameInput").val("");
      $("#destinationInput").val("");
      $("#firstTrainTimeInput").val("");
      $("#frequencyInput").val("");
      $("#durationInput").val("");
      //No clue ; )
      return false;

    });

  //data pushed to firebase.
  db.on("child_added", function(childSnapshot) {

    //Firebase Variables
    var fireName = childSnapshot.val().trainName;
    var fireDestination = childSnapshot.val().destination;    
    var fireFirstTrain = childSnapshot.val().firstTrain;
    var fireFrequency = childSnapshot.val().frequency;
    var fireduration = childSnapshot.val().duration;





    var firstTimeConverted = moment(fireFirstTrain,"hh:mm").subtract(1, "years");
    console.log("first time converted: ", firstTimeConverted);
    var currentTime = moment();
    console.log("current time is:  ",currentTime);
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("diffTime: ", diffTime);
    var tRemainder = diffTime % fireFrequency; 
    console.log("tRemainder: ", tRemainder);
    var tMinutesTillTrain = fireFrequency - tRemainder;
    console.log("Minutes till next train:", tMinutesTillTrain);
    var nextTrain = moment().add(tMinutesTillTrain, "minutes").format("hh:mm");
    var arrivalTime = currentTime;
    var arrivalTime2 = moment(currentTime).add(tMinutesTillTrain, 'minutes').format("hh:mm");


// trying to correct arrival time to account for times greater than an hour away

if (tMinutesTillTrain >  59) {
  tMinutesTillTrain = tMinutesTillTrain + 60;
  var arrivalTime = moment().format('HH:mm:ss');
  var arrivalTime2 = moment(arrivalTime.clone).add(1, 'hours').format("hh:mm");
  console.log("next Arrival is greater than one hour away: ",arrivalTime2);
}
    else {
      var arrivalTime2 = moment(currentTime.clone).add(0, 'hours').format("hh:mm");
        console.log("next Arrival is less than one hour away: ",arrivalTime2);
    }


// write to the HTML 

    $("#trainTable > tbody").append("<tr class='active'><td>" + fireName + "</td><td>"  + fireDestination + "</td><td>" +  
     "Every " + fireFrequency  + " Minutes" + "</td><td>" + nextTrain + "</td><td>" + 
     tMinutesTillTrain + "</td><td>" + "</td></tr>");

  });



});




function startTime() {

    var currentTime = moment().format('HH:mm:ss');
    $('#time').html(currentTime);
    // run "current time" on a timeout
    var t = setTimeout(startTime, 500);

}

// show the clock at page load
$(document).ready(function() {
  startTime();
});  //document ready