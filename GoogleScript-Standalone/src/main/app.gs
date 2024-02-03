function gatherUserInformation() {
    let email = Session.getActiveUser().getEmail();
    console.log(email);

    //display local time
    let timeZone = Session.getScriptTimeZone();
    console.log(timeZone);

    //display current time
    let currentTime = new Date();
    console.log(currentTime);

    //display user's language
    // let language = Session.getActiveUser().getLanguage();
    // console.log(language);

    //display user's username
    let username = Session.getActiveUser().getUsername();
    console.log(username);

    //display location of this script
    let scriptId = ScriptApp.getScriptId();
    let file = DriveApp.getFileById(scriptId);
    let folders = file.getParents();
    while (folders.hasNext()) {
        let folder = folders.next();
        console.log(folder.getName());
    }

    //create a new folder named "GAS Gerated Files" inside of folder with id of 1OWh3ZgM7_-KrMyvW_D2dZJz-hUVwCzWR, but only if it doesn't already exist

    // Get the parent folder by its ID
    let parentFolder = DriveApp.getFolderById('1OWh3ZgM7_-KrMyvW_D2dZJz-hUVwCzWR');

    // Check if the "GAS Generated Files" folder already exists
    let newFolderName = 'GAS Generated Files';
    let existingFolders = parentFolder.getFoldersByName(newFolderName);

    // If the folder doesn't exist, create it
    if (!existingFolders.hasNext()) {
        parentFolder.createFolder(newFolderName);
    }

    //Note that folder parentFolder also has folder in it named "GAS Source Files" which will house the source files for the project such as spreadhseet and pdf files
    let sourceFolder = parentFolder.getFoldersByName('GAS Source Files').next();
    console.log(sourceFolder.getName());

    //display contents of sourceFolder
    let files = sourceFolder.getFiles();
    let filesArray = [];
    while (files.hasNext()) {
        filesArray.push(files.next());
    }

// Iterate over the array with a for loop
    if (filesArray.length === 0) {
        console.log('No files found.');
    } else {
        for (let i = 0; i < filesArray.length; i++) {
            let file = filesArray[i];
            let ordinalNumber = i + 1;
            console.log("File " + ordinalNumber + ": " + file.getName());
        }
    }


    // This works in a Spreadsheet: function onOpen(e) { SpreadsheetApp.getUi().alert('Hello')}
    //
    // This works in a Document: function onOpen(e) { DocumentApp.getUi().alert('Hello'); }



       // throw new Error("File does not exist");

    console.log("this is a test");

    // call function displayEmail
    // displayEmail();





}
// function displayEmail() {
//     let htmlOutput = HtmlService.createHtmlOutput('<p>User Email: ' + "someText" + '</p>')
//         .setWidth(300)
//         .setHeight(80);
//     ScriptApp.newTrigger('showDialog')
//         .forSpreadsheet(SpreadsheetApp.getActiveSpreadsheet())
//         .onOpen()
//         .create();
// }