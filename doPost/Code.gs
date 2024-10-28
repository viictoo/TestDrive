function doTest() {
    // Simulate a POST request and call doPost
    var mockEvent = {
        parameter: {
            "Name": "Test Data content",
            "Email": "Test Data content",
            "Company": "Test Company"
            // Test Missing Message
        }
    };

    console.log(mockEvent)
    var result = doPost(mockEvent);

    // Log the result for inspection
    Logger.log(result);
}


function doPost(e) {
    return handleResponse(e);
}

// Enter sheet name where data is to be written below
var SHEET_NAME = "Sheet1";

var SCRIPT_PROP = PropertiesService.getScriptProperties(); // new property service

function handleResponse(e) {
    // Lock service to prevent concurrent access overwriting data
    var lock = LockService.getPublicLock();
    lock.waitLock(30000);  // wait 30 seconds before conceding defeat.

    try {
        var doc = SpreadsheetApp.openById(SCRIPT_PROP.getProperty("key"));
        var sheet = doc.getSheetByName(SHEET_NAME);

        // We'll assume header is in row 1 but you can override with header_row in POST data
        var headRow = 1;
        var headers = sheet.getRange(headRow, 1, 1, sheet.getLastColumn()).getValues()[0];
        var nextRow = sheet.getLastRow() + 1; // get next row
        var row = []; 
        
        // Loop through the header columns
      var postData = e.parameter ? e.parameter : {};

        function getValueOrNone(json, key, defaultValue) {
            return json.hasOwnProperty(key) ? json[key] : defaultValue;
        }

        // Loop through the header columns
        for (var i in headers) {
            if (headers[i] == "Timestamp") { // special case for 'Timestamp' column
                row.push(new Date());
            } else { // Use the utility function to get values
                row.push(getValueOrNone(postData, headers[i], ""));
            }
        }

        // More efficient to set values as [][] array than individually
        sheet.getRange(nextRow, 1, 1, row.length).setValues([row]);
        
        // Return JSON success results
        return ContentService
            .createTextOutput(JSON.stringify({"result": "success", "row": nextRow}))
            .setMimeType(ContentService.MimeType.JSON);
    } catch (error) {
        Logger.log("Error: " + error.message);
        // If error, return this
        return ContentService
            .createTextOutput(JSON.stringify({"result": "error", "error": error.message}))
            .setMimeType(ContentService.MimeType.JSON);
    } finally { // Release lock
        lock.releaseLock();
    }
}

