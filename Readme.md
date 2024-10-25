# Test Drive

Test Drive is a startup that provides maps to the best driving roads. This repository contains the source code for the Test Drive landing page, which includes a form that submits data to a Google Sheet using Google Apps Script.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Introduction

Test Drive aims to help users discover and explore amazing roads. This project includes a landing page with a signup form that collects user information and stores it in a Google Sheet.

## Features

- Responsive landing page
- Signup form
- Integration with Google Sheets using Google Apps Script
- Form validation and error handling

## Installation

1. Clone the repository:
	```sh
	git clone https://github.com/viictoo/test-drive.git
	cd test-drive
	```

2. Open the project in your preferred code editor (e.g., Vim).

3. Ensure you have a web server to serve the HTML files (e.g., using Live Server extension in VS Code).

## Usage

1. Open `index.html` in your web browser to view the landing page.

2. Fill out the signup form and submit it. The form data will be sent to a Google Sheet.

## Configuration

### Linking Form to Google Sheets

1. **Create a Google Sheet**:
	- Go to [Google Sheets](https://sheets.google.com) and create a new sheet.
	- Add the first column the names for each form field you will be collecting and make sure that the name in the cell in the spreadsheet is match with the name of the form input. (case-sensitive)

2. **Create a Google Apps Script**:
	- In the Google Sheet, go to `Extensions` > `Apps Script`.
	- Replace the default code with the following script:
	  ```javascript
      
        function doGet(e){
            return handleResponse(e);
        }
            //  Enter sheet name where data is to be written below
            var SHEET_NAME = "Sheet1";
            var SCRIPT_PROP = PropertiesService.getScriptProperties(); // new property service
            
        function handleResponse(e) {
            // this prevents concurrent access overwritting data
            var lock = LockService.getPublicLock();
            lock.waitLock(30000);  // wait 30 seconds before conceding defeat.
            
            try {
                // next set where we write the data - you could write to multiple/alternate destinations
                var doc = SpreadsheetApp.openById(SCRIPT_PROP.getProperty("key"));
                var sheet = doc.getSheetByName(SHEET_NAME);
                
                // we'll assume header is in row 1 but you can override with header_row in GET/POST data
                var headRow = e.parameter.header_row || 1;
                var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
                var nextRow = sheet.getLastRow()+1; // get next row
                var row = []; 
                // loop through the header columns
                for (i in headers){
                    if (headers[i] == "Timestamp"){ // special case if you include a 'Timestamp' column
                    row.push(new Date());
                    } else { // else use header name to get data
                    row.push(e.parameter[headers[i]]);
                    }
                }
                // more efficient to set values as [][] array than individually
                sheet.getRange(nextRow, 1, 1, row.length).setValues([row]);
                // return json success results
                return ContentService
                        .createTextOutput(JSON.stringify({"result":"success", "row": nextRow}))
                        .setMimeType(ContentService.MimeType.JSON);
            } catch(e){
                // if error return this
                return ContentService
                        .createTextOutput(JSON.stringify({"result":"error", "error": e}))
                        .setMimeType(ContentService.MimeType.JSON);
            } finally { //release lock
                lock.releaseLock();
            }
        }
        
        function setup() {
            var doc = SpreadsheetApp.getActiveSpreadsheet();
            SCRIPT_PROP.setProperty("key", doc.getId());
        }
	  ```
	- Replace `'SHEET_NAME'` with your actual Sheet Name.
	- Save the script and give it an appropriate name.
	- Then select function Setup and click Run to give appropriate permissions.
	- Deploy the project as a web app:
	  - Click on `Deploy` > `New deployment`.
	  - Select `Web app`.
	  - Set the appropriate access permissions (e.g., "Anyone").
	  - Deploy the web app and note the provided URL.

3. **Update the Form Submission URL**:
	- In your `script.js` file, update the `url` variable with the URL of your deployed Google Apps Script web app:
	  ```javascript
	  var url = 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec';
	  ```

4. **Form Submission Handling**:
	- The form submission is handled using jQuery's `$.ajax` method. The form data is serialized and sent to the Google Apps Script web app.
	- The `script.js` file contains the following code to handle form submission:
	  ```javascript
	  $(document).ready(function() {
		var $form = $('form#signup-form');
		var url = 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec';

		$form.on('submit', function(e) {
		  e.preventDefault();

		  const el = $(this);
		  const submitButton = $(el).find('#submit-button');

		  var jqxhr = $.ajax({
			url: url,
			method: "GET",
			data: $form.serialize(),
			beforeSend: function() {
			  submitButton.attr('disabled', true);
			  submitButton.text('sending....');
			},
			success: function(data) {
			  swal("Thank you for your feedback!", "", "success");
			  submitButton.attr('disabled', false);
			  submitButton.text('Submit');
			},
			error: function(jqXHR, textStatus, errorThrown) {
			  console.error("Error: " + textStatus, errorThrown);
			  alert("There was an error submitting your data. Please try again.");
			  submitButton.attr('disabled', false);
			  submitButton.text('Submit');
			}
		  });
		});
	  });
	  ```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

For any inquiries, please contact us at [contact@me.com](mailto:provicml@gmail.com).

