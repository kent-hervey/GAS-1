# PDF Book Creator from Multiple PDFs

This Google Apps Script tool merges multiple PDF files into a single document based on their order in a Google Sheet.

## Functionality

* Output file names are fnameLastname Month-Day-Year-Hour-Minute-Second.pdf
* GAS code is housed in a Google Sheet and is triggered by a button in the sheet
* The resulting pdf is stored in a folder in Google Drive
* The order of the pdf files is determined by the order indicated in the host spreadsheet of this script

## Application Dependencies

1. **Spreadsheet:**
    * Table with a named range containing two columns: 1) PDF file names and 2) Case Study ordering.
    * These columns are found by code using their index in the sheet, thus particular header names are not required.
    * Specify correct column indexes in the script constants `PDF_Input_File_NAME_COLUMN_INDEX` and `CASE_STUDY_ORDERING_COLUMN_INDEX`.
2. **Source PDF Folder:**
    * Shares the same name as the destination folder specified in the script.

## Requirements for Use

* Google Apps Script account.
* Access to the Google Sheet containing the data and button.
* Permissions to create and manage files in Google Drive.

  const CASE_STUDY_ORDERING_COLUMN_INDEX = 3; //these are the order numbers of the case studies
  const PDF_INPUT_FILE_NAME_COLUMN_INDEX = 1; //these are the file names of the case studies

  const FOLDER_ID_SOURCE_PDFS = "1hdvC1S1zsGsu7yLnnlPXXTuoXiCtjfOn";  // Replace with your actual folder ID
  const folderofSourcePdfs = DriveApp.getFolderById(FOLDER_ID_SOURCE_PDFS);

  const OUTPUT_FOLDER_ID = "1jKPSmqbRtRXfZPLn-4QQbBVpGC7WhGJ7";  // Replace with your actual folder ID
  const outputFolder = DriveApp.getFolderById(OUTPUT_FOLDER_ID);

  const RANGE_NAME_LIST_PDF_FILES = "pdfSourceTable";

## Getting Started

1. Open the **host Google Sheet**.
2. Click the **button** to trigger the merge process.
3. The merged PDF will be saved to the **specified folder** in Google Drive.
