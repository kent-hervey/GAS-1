//This file used to develop good code for combining single page pdfs into a
//single pdf catalog book with a good file name and then possibly sending the file to an email address
// storing the resulting pdf in a folder in google drive
// order of pdf files is determined by the order indicated in the host spreadsheet of this script


//File names can be FNameLname-MM/DD/YYYY-HH/MM/SS

//Whenever a file is created, need to log that to a spreadsheet for Leadership use showing which case studies were booked, and what order, and who requested




// function mergePDFs() {
//   // Get the folder ID containing the PDFs
//   var folderId = "1USbLrg8NC5BHrVq0nk8rwL4goZ3wiCae";  // Replace with your actual folder ID
//   var folder = DriveApp.getFolderById(folderId);

//   // Get the sheet containing the list of PDFs and their order
//   var sheet = SpreadsheetApp.getActiveSheet();

//   // Create an empty PDF file (initially without content)
//   var mergedPDF = DriveApp.createFile(Utilities.newBlob("", "application/pdf"), "Merged PDF.pdf");

//   // Access the newly created PDF's content as a PdfDocument
//   var pdfContent = mergedPDF.getBlob().getDataAsString();
//   var pdfDoc = PdfService.createPdf(pdfContent);

//   // ... (Code to merge PDFs into the pdfDoc object using PdfService methods) ...

//   // Save the final merged PDF content
//   mergedPDF.setContent(pdfDoc.getAs(MimeType.PDF));
// }

async function mergePDFsToBook() {
    //uses pdf library as explained here:
    // https://stackoverflow.com/questions/67682461/how-to-merge-multiple-pdf-files-into-one-pdf-file-in-google-apps-script
    // and here: https://www.jsdelivr.com/package/npm/pdf-lib
    //  and here https://pdf-lib.js.org/docs/guides/quickstart
    const cdnjs = "https://cdn.jsdelivr.net/npm/pdf-lib/dist/pdf-lib.min.js";
    eval(UrlFetchApp.fetch(cdnjs).getContentText().replace(/setTimeout\(.*?,.*?(\d*?)\)/g, "Utilities.sleep($1);return t();"));


    //Set constants for the project
    const CASE_STUDY_ORDERING_COLUMN_INDEX = 3;
    const PDF_Input_File_NAME_COLUMN_INDEX = 1; //these are the file names

    const folderIdSourcePdfs = "1hdvC1S1zsGsu7yLnnlPXXTuoXiCtjfOn";  // Replace with your actual folder ID
    const folderofSourcePdfs = DriveApp.getFolderById(folderIdSourcePdfs);

    const outputFolderId = "1jKPSmqbRtRXfZPLn-4QQbBVpGC7WhGJ7";  // Replace with your actual folder ID
    const outputFolder = DriveApp.getFolderById(outputFolderId);

    // const rangeByNamePdfTable = SpreadsheetApp.getActive().getRangeByName("pdfSourceTable");
    // var values = rangeByNamePdfTable.getValues();

    //var rowAndColumnValuesinTable = SpreadsheetApp.getActive().getRangeByName("pdfSourceTable").getValues();

    const orderAndFileLocation = SpreadsheetApp.getActive().getRangeByName("pdfSourceTable").getValues()
        .map(study => {
            if (Number.isInteger(study[CASE_STUDY_ORDERING_COLUMN_INDEX]))
                return {
                    orderNumber: study[CASE_STUDY_ORDERING_COLUMN_INDEX],
                    pdfFileName: study[PDF_Input_File_NAME_COLUMN_INDEX]
                }
        })
        .filter(value => value != undefined)  // Filter out any undefined values in array

        .sort((a, b) => a.orderNumber - b.orderNumber);  // Sort array by order number (least to greatest)

    /* below transforms the orderAndFileLocation array into an array of Uint8Array objects, each representing the
    // binary content of the corresponding PDF file. This array can then be used further for
    processing or saving the PDF files.
    */
    let data = orderAndFileLocation
        .map(value => new Uint8Array(folderofSourcePdfs.getFilesByName(value.pdfFileName).next().getBlob().getBytes()));

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

    //sendEmailFunction(blob)

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

    let fileIdToSend = "1OGgtO2ZrcZBvhZIJYUljvBXtU7OYivoBCSQytQNnZBk"

    var file = DriveApp.getFileById("1OGgtO2ZrcZBvhZIJYUljvBXtU7OYivoBCSQytQNnZBk");
    var blob = file.getBlob();
    blob= fileBlob;
    let userUsersEmail = Session.getActiveUser().getEmail();
    const parts = userUsersEmail.split('@');

    // Construct new email with tester
    const emailWithAlias = [parts[0], '+GAS-Test', '@', domain].join('');

    MailApp.sendEmail({
        to: emailWithAlias,
        subject: "Practice Sending a File",
        body: "Attached is a file",
        attachments: [blob.setName(file.getName())]
    });
}
