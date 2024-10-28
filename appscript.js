function doGet(e){
    return handleResponse(e);
  }
  
  //  Enter sheet name where data is to be written below
          var SHEET_NAME = "Sheet1";
  
  var SCRIPT_PROP = PropertiesService.getScriptProperties(); // new property service
  
  function handleResponse(e) {
    var lock = LockService.getPublicLock();
    lock.waitLock(30000);  // wait 30 seconds before conceding defeat.
    
    try {
      var doc = SpreadsheetApp.openById(SCRIPT_PROP.getProperty("key"));
      var sheet = doc.getSheetByName(SHEET_NAME);

      
      var headRow = e.parameter.header_row || 1;
      var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
      var nextRow = sheet.getLastRow()+1; // get next row
      var row = []; 
      for (i in headers){
        if (headers[i] == "Timestamp"){ // special case if you include a 'Timestamp' column
          row.push(new Date());
        } else { // else use header name to get data
          row.push(e.parameter[headers[i]]);
        }
      }
      sheet.getRange(nextRow, 1, 1, row.length).setValues([row]);
      return ContentService
            .createTextOutput(JSON.stringify({"result":"success", "row": nextRow}))
            .setMimeType(ContentService.MimeType.JSON);
    } catch(e){
      Logger.log("Error: " + e.message);
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
      Logger.log(doc.getId())
  }
