//This file used to develop code reference for combining single page pdfs into a
//single pdf catalog book with a good file name and then possibly sending the file to an email address
// storing the resulting pdf in a folder in google drive
// order of pdf files is determined by the order indicated in the host spreadsheet of this script

/* Possible future features

1.  Send the resulting pdf to an email address--particularly the email address of the person who requested the pdf
2.  Log requests for pdf books in a spreadsheet

*/

/* Currently:
    File names are fnameLastname Month-Day-Year-Hour-Minute-Second.pdf
    GAS code is housed in a Google Sheet and is triggered by a button in the sheet
    The resulting pdf is stored in a folder in Google Drive
    The order of the pdf files is determined by the order indicated in the host spreadsheet of this script
    Application depends on these:
        1. Spreadsheet has a table with a range name that has the following columns:  "File Name", "Ordering".
            The header names of the rows are not required to be any specific name
            Rather the proper column indexes of those columns must be specified in the code assigned to the constants:
            PDF_Input_File_NAME_COLUMN_INDEX and CASE_STUDY_ORDERING_COLUMN_INDEX
        2. The folder with the source pdfs has the same name as the folder with the source pdfs in the host script

*/

async function mergePDFsToBook() {

    //uses pdf library as explained here:
    // https://stackoverflow.com/questions/67682461/how-to-merge-multiple-pdf-files-into-one-pdf-file-in-google-apps-script
    // and here: https://www.jsdelivr.com/package/npm/pdf-lib
    //  and here https://pdf-lib.js.org/docs/guides/quickstart
    const cdnjs = "https://cdn.jsdelivr.net/npm/pdf-lib/dist/pdf-lib.min.js";
    eval(UrlFetchApp.fetch(cdnjs).getContentText().replace(/setTimeout\(.*?,.*?(\d*?)\)/g, "Utilities.sleep($1);return t();"));

    //Set constants for the project
    const CASE_STUDY_ORDERING_COLUMN_INDEX = 3; //these are the order numbers of the case studies
    const PDF_INPUT_FILE_NAME_COLUMN_INDEX = 1; //these are the file names of the case studies

    const FOLDER_ID_SOURCE_PDFS = "1hdvC1S1zsGsu7yLnnlPXXTuoXiCtjfOn";  // Replace with your actual folder ID
    const folderofSourcePdfs = DriveApp.getFolderById(FOLDER_ID_SOURCE_PDFS);

    const OUTPUT_FOLDER_ID = "1jKPSmqbRtRXfZPLn-4QQbBVpGC7WhGJ7";  // Replace with your actual folder ID
    const outputFolder = DriveApp.getFolderById(OUTPUT_FOLDER_ID);

    const orderAndFileLocation = SpreadsheetApp.getActive().getRangeByName("pdfSourceTable").getValues()
        .map(col => {
            if (Number.isInteger(col[CASE_STUDY_ORDERING_COLUMN_INDEX]))
                return {
                    orderNumberFromColumn: col[CASE_STUDY_ORDERING_COLUMN_INDEX],
                    pdfFileNameFromColumn: col[PDF_INPUT_FILE_NAME_COLUMN_INDEX]
                }
        })
        .filter(value => value !== undefined)  // Filter out any undefined values in array
        .sort((a, b) => a.orderNumberFromColumn - b.orderNumberFromColumn);  // Sort array by order number (least to greatest)

    /* below transforms the orderAndFileLocation array into an array of Uint8Array objects, each representing the
    // binary content of the corresponding PDF file. This array can then be used further for
    processing or saving the PDF files.
    */
    let data = orderAndFileLocation
        .map(value => new Uint8Array(folderofSourcePdfs.getFilesByName(value.pdfFileNameFromColumn).next().getBlob().getBytes()));

    const pdfDoc = await PDFLib.PDFDocument.create(); // creates an empty PDF file (initially without content)

    for (let i = 0; i < data.length; i++) {
        const pdfData = await PDFLib.PDFDocument.load(data[i]); // Load the PDF data
        const pages = await pdfDoc.copyPages(pdfData, pdfData.getPageIndices()); // Copy the pages from the loaded PDF
        pages.forEach(page => pdfDoc.addPage(page)); // Add the copied pages to the new PDF
    }

    const bytes = await pdfDoc.save(); // Save the final merged PDF content

    const blob = Utilities.newBlob([... new Int8Array(bytes)], MimeType.PDF, createSerialFileName());
    /*
    Utilities.newBlob(...) is a Google Apps Script utility function that constructs a Blob object.
    Agruments are content, contentType, and name.
    content: Required. This argument takes an array of bytes representing the file's content.
    contentType: Optional. Specify the MIME type of the file data if known, such as MimeType.PDF,
    MimeType.JPEG, or others.
    name: Optional. Assign a filename to the Blob. If absent, a default filename will be generated.
    While convenient, consider providing meaningful filenames for clarity and organization.
    .setName(createSerialFileName()) sets the Blob's filename using a generated name
    from a function called createSerialFileName()
     */

    //sendEmailFunction(blob) //future feature

    outputFolder.createFile(blob);
}

function createSerialFileName(){

    //display current time
    let currentTime = new Date();
    console.log("logging current time:  "  + currentTime);

    let currentMonth = currentTime.getMonth()+1
    let currentDate = currentTime.getDate()
    let currentYear = currentTime.getFullYear()
    let currentHour = currentTime.getHours()
    let currentMinutes = currentTime.getMinutes()
    let currentSeconds = currentTime.getSeconds()

    //display user's language
    // let language = Session.getActiveUser().getLanguage();
    // console.log(language);

    //display user's username
    let username = Session.getActiveUser().getUsername();
    console.log("logging username:  "  +  username);
    //replace period in username with a hyphen
    let usernameStripped = username.replace(/[^a-zA-Z0-9]/g, '');
    console.log("logging usernameStripped:  "  + usernameStripped);

    return usernameStripped + " " + currentMonth + "-" + currentDate + "-" + currentYear + "-" + currentHour + "-" + currentMinutes + "-" + currentSeconds + ".pdf"
}

function alertMessage() {
    var result = SpreadsheetApp.getUi().alert("Alert message");
    if(result === SpreadsheetApp.getUi().Button.OK) {
        //Take some action
        SpreadsheetApp.getActive().toast("About to take some action …");
    }
}

function sendEmailFunction(fileBlob) {
//this function was confirmed on 2/11/24 to work

    var noBlob= fileBlob; //to satisfy compiler that fileBlob is used

    // let fileIdToSend = "1OGgtO2ZrcZBvhZIJYUljvBXtU7OYivoBCSQytQNnZBk"
    var file = DriveApp.getFileById("1OGgtO2ZrcZBvhZIJYUljvBXtU7OYivoBCSQytQNnZBk");
    var blob = file.getBlob();

    let userUsersEmail = Session.getActiveUser().getEmail();
    const parts = userUsersEmail.split('@');
    //const emailWithAlias = [parts[0], '+GAS-Test', '@', + parts[1]].join('');
    const emailWithAlias = (parts[0] + 'GAS-Test@' + parts[1]);

    MailApp.sendEmail({
        to: emailWithAlias,
        subject: "Practice Sending a File",
        body: "Attached is a file",
        attachments: [blob.setName(file.getName())]
    });
}
