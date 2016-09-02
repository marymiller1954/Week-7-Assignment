$(document).ready(function(){

   



 var db = new Firebase("https://new-train-schedule.firebaseio.com");



    // Submit Button Click 
    $("#submitButton").on("click", function(){
       var trainName = $("#trainNameInput").val().trim();
       var destination = $("#destinationInput").val().trim();
       var firstTrain = $("#firstTrainTimeInput").val().trim();

       console.log(" first train input: ", firstTrain);
   //    var firstTrainconverted = moment($("#firstTrainTimeInput").val(), "hh:mm");
    //   console.log("first train converted : ",firstTrainconverted);

      var firstTrainconverted = moment($("#firstTrainTimeInput").val().trim(), "HH:mm").format("X");

      console.log("first train after moment conversion: ",firstTrainconverted);

       var frequency = $("#frequencyInput").val().trim();
  //     var frequency = moment($("#frequencyInput").val(), "hh:mm").format("X");
  console.log("frequency: ",frequency);
       var duration = $("#durationInput").val().trim();
  //    var duration = moment($("#durationInput").val(), "hh:mm").format("X");
       console.log("duration: ",duration);
  //     var firstTrain = moment("2016-09-16T06:00:00").format("hh:mm: a"); 
  //    console.log("first train input: ", firstTrainTimeInput);

var x = duration
var tempTime = moment.duration(x);
var y = tempTime.hours() + tempTime.minutes();

console.log("duration in hours: ", y);

var dateEntered = $('#txtEnteredDate').val();

if (!moment(firstTrain,'hh-mm').isValid()) {
  console.log('Invalid Start Time', firstTrain);
} else {
  console.log('Valid Start Time', firstTrain);
}

//var lastdeparture = moment("2016-09-16T06:00:00").format("hh:mm: a"); 

//var nextdeparture = moment(lastdeparture + duration).format("hh:mm: a"); 

//var nextdeparture = moment("2016-09-16T06:00:00").add(2, 'hours');
//var nextdeparture = (firstTrain + frequency);
//var nextdeparture = moment(firstTrain + frequency).format("hh:mm");
//console.log("next departure time: ",nextdeparture);
//var lastdeparture = nextdeparture;
//console.log("last departure: ", lastdeparture);
var b = moment.duration(120, 'minutes');
console.log(" var b duration: ",b);
var a = moment.duration(firstTrain, 'minutes');
console.log(" var a firstTrain: ",a);
a.add(b).minutes(); // 3
console.log("new a: ",a);



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
    console.log("childSnapshot: ", childSnapshot);

    var fireName = childSnapshot.val().trainName;
    var fireDestination = childSnapshot.val().destination;
    
    var fireFirstTrain = childSnapshot.val().firstTrain;
    console.log("fireFirstTrain: ",fireFirstTrain);
    var fireFrequency = childSnapshot.val().frequency;
    var fireduration = childSnapshot.val().duration;



    var time = fireFirstTrain 
    time = time.split(':');
    var hours = Number(time[0]);
    var minutes = Number(time[1]);
    var seconds = Number(time[2]);
    var timeValue = "" + ((hours >12) ? hours - 12 : hours); 
    timeValue += (minutes < 10) ? ":0" + minutes : ":" + minutes; 
    timeValue += (hours >= 12) ? "pm" : "am"; 

    var minutesAway = "";

    var nextArrival = "";


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

               var previousTrain = moment().subtract(nextTrain, "minutes").format("hh:mm");
               console.log("previous train left at: ",previousTrain);

               var a = moment(nextTrain);
              var b = moment(fireduration);
              console.log(" next train: ",nextTrain);
              console.log("fireduration: ",fireduration);
              var diffminutes = b.diff(a, 'minutes');
              console.log("diffminutes: ",diffminutes);



    console.log("firename: ",fireName);
    console.log("fireDestination: ",fireDestination);
    console.log("fireFrequency: ",fireFrequency);
    console.log("trip duration: ",fireduration);

    $("#trainTable > tbody").append("<tr class='active'><td>" + fireName + "</td><td>"  + fireDestination + "</td><td>" + fireFirstTrain + "</td><td>" + 
     "Every " + fireFrequency  + " Minutes" + "</td><td>" + fireduration + "</td><td>" + nextTrain + "</td><td>" + 
     tMinutesTillTrain + "</td><td>" + "</td></tr>");

  });




});




function startTime() {

    var currentTime = moment().format('HH:mm:ss');
    $('#time').html(currentTime);

    // run "startTime" on a timeout
    var t = setTimeout(startTime, 500);

}

// show the clock at page load
$(document).ready(function() {
  startTime();
});