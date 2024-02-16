function showLeadershipView() {
    //const cdnjs = "https://cdn.jsdelivr.net/npm/pdf-lib/dist/pdf-lib.min.js";

    alertMessage("this will show view for Leadership Summary");
    console.log("before alertMessage");
    showLeadershipView2();
    console.log("after alertMessage");
}


function showFullView() {

    alertMessage("this will Full View for Working Team")

    showFullView2()

}

function alertMessage(alertMessageText) {
    var result = SpreadsheetApp.getUi().alert(alertMessageText);
    // if(result === SpreadsheetApp.getUi().Button.OK) {
    //   //Take some action
    //   SpreadsheetApp.getActive().toast("About to take some action …");
    // }
}

function showLeadershipView2() {
    // Get the active spreadsheet
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

    // Get the active sheet
    var sheet = spreadsheet.getActiveSheet();

    // Get the named range "CaseStudyTable"
    var range = spreadsheet.getRangeByName("CaseStudyTable");
    var thing = range.getValues()[1][10];

    console.log("thing is row 1 column 10: " + thing);

    // Log the range values
    //console.log("range is the range: " + range.getValues());


    //console.log("range is the range: " + range.getValues());

    for (var i = 1; i < range.getValues().length; i++) {
        console.log("Here is value in column 10 of row " + i + ":  " + range.getValues()[i][9]);
        if (range.getValues()[i][9] !== "Leadership") {
            console.log("Leadership not found in row " + i);
            sheet.hideRows(range.getRow() + i);
        }

        // Get the index of the column with the header "Show Filter (Leadership, Full)"
        var leadershipFilterColumnIndex = range.getValues()[0].indexOf("Show Filter (Leadership, Full)") + 1;
        console.log("leadershipFilterColumnIndex: " + leadershipFilterColumnIndex);

        // Call the filterFunction to filter the named range based on the specified column
        //filterFunction(range, leadershipFilterColumnIndex, "Leadership");
    }
}


function showFullView2() {
  // Get the active spreadsheet
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

  // Get the active sheet
    const sheet = spreadsheet.getActiveSheet();


    // Get the named range "CaseStudyTable"
  var range = spreadsheet.getRangeByName("CaseStudyTable");
  var thing = range.getValues()[1][10];

  console.log("thing is row 1 column 10: " + thing);

  // Log the range values
  //console.log("range is the range: " + range.getValues());


  //console.log("range is the range: " + range.getValues());



  for (var i = 5; i < range.getValues().length; i++) {
    console.log("Here is value in column 10 of row " + i + ":  " + range.getValues()[i][9]);

      console.log("Leadership not found in row " + i);
      sheet.showRows(i);


    // Get the index of the column with the header "Show Filter (Leadership, Full)"
    var leadershipFilterColumnIndex = range.getValues()[0].indexOf("Show Filter (Leadership, Full)") + 1;
    console.log("leadershipFilterColumnIndex: " + leadershipFilterColumnIndex);

    // Call the filterFunction to filter the named range based on the specified column
    //filterFunction(range, leadershipFilterColumnIndex, "Leadership");
  }
}







