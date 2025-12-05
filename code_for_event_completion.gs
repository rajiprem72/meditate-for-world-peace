/******************************************************
 * EVENT COMPLETION – Trigger Handler
 ******************************************************/
function onEventCompletionFormSubmit(e) {

  Logger.log("Step 1: Trigger started");

  const regID = (e.namedValues["Registration ID"][0] || "").trim();
  Logger.log("RegID: " + regID);

  if (!regID) {
    Logger.log("Empty Registration ID in Event Completion form.");
    return;
  }

  // MAIN registration sheet ID
  const REG_SHEET_ID = "1_jK5lOGSU6-wAdJdN4e8LtmPNZoW34lIcAry0aKmZpQ";
  const regSS = SpreadsheetApp.openById(REG_SHEET_ID);
  const regSheet = regSS.getSheetByName("Form Responses 1");

  if (!regSheet) {
    Logger.log("Main registration sheet NOT FOUND.");
    return;
  }

  // Locate Registration ID (col 15)
  const last = regSheet.getLastRow();
  const values = regSheet.getRange(2, 15, last - 1, 1).getValues();

  let row = -1;
  for (let i = 0; i < values.length; i++) {
    if ((values[i][0] || "").toString().trim() === regID) {
      row = i + 2;
      break;
    }
  }

  if (row === -1) {
    Logger.log("Registration ID NOT FOUND: " + regID);
    return;
  }

  Logger.log("Found Row: " + row);

  // Update Event Completed + Timestamp
  regSheet.getRange(row, 20).setValue("YES");
  regSheet.getRange(row, 21).setValue(new Date());

  // Fetch Name & Email
  const name  = regSheet.getRange(row, 2).getValue();
  const email = regSheet.getRange(row, 8).getValue();

  Logger.log("Name: " + name);
  Logger.log("Email: " + email);
  Logger.log("Generating certificate…");

  // Send certificate email
  generateAndSendCertificate(name, email, regID);

  // Update certificate sent columns
  regSheet.getRange(row, 17).setValue("YES");
  regSheet.getRange(row, 18).setValue(new Date());

  Logger.log("Certificate email sent successfully.");
}

/******************************************************
 * Certificate Email (Simple)
 ******************************************************/
function sendCertificateEmail(email, name, regID) {
  if (!email) return;

  const subject = "Your Participation Certificate – International Meditation Day";

  const body =
    "Namaste " + name + " 🙏,<br><br>" +
    "You have successfully completed the <b>International Meditation Day</b> meditation session.<br><br>" +
    "Registration ID: <b>" + regID + "</b><br><br>" +
    "Om Shanti 🙏<br><br>" +
    "<i>Global School of Yoga</i>";

  GmailApp.sendEmail(email, subject, "", { htmlBody: body });
}

/******************************************************
 * Create Trigger Automatically
 ******************************************************/
function createEventCompletionTrigger() {
  const all = ScriptApp.getProjectTriggers();
  all.forEach(t => {
    if (t.getHandlerFunction() === "onEventCompletionFormSubmit") {
      ScriptApp.deleteTrigger(t);
    }
  });

  ScriptApp.newTrigger("onEventCompletionFormSubmit")
    .forSpreadsheet(SpreadsheetApp.getActive())
    .onFormSubmit()
    .create();

  Logger.log("Trigger created successfully");
}
/******************************************************
 * GENERATE CERTIFICATE + SEND EMAIL
 ******************************************************/
function generateAndSendCertificate(name, email, regID) {

  Logger.log("Step 2: Starting certificate generation");

  const TEMPLATE_ID = "1J1Yf3jiY4IASa0GEdKGI-un7ergKFt6IqePstSduvu8"; // Google Docs template
  const FOLDER_ID   = "1xgYZ4NCN3vY-UyXYUzakDWSVlcThLkZI";            // Certificate folder

  const folder = DriveApp.getFolderById(FOLDER_ID);

  // 1. Make a copy of the template
  const copy = DriveApp.getFileById(TEMPLATE_ID)
    .makeCopy(`Certificate_${regID}_${name}`, folder);

  Logger.log("Template copied: " + copy.getId());

  // 2. Open document
  const doc = DocumentApp.openById(copy.getId());
  const body = doc.getBody();

  // 3. Replace placeholder
  body.replaceText("{{NAME}}", name);
  Logger.log("Name replaced");

  doc.saveAndClose();

  // 4. Convert to PDF
  const pdfBlob = copy.getAs("application/pdf");
  Logger.log("PDF created");

  // 5. Email certificate
  const subject = "Your Certificate – International Meditation Day";
  const message =
    "Namaste " + name + " &#128591;,<br><br>" +
    "Thank you for participating in the <b>International Meditation Day – World Record Meditation Event</b>.<br><br>" +
    "Please find your certificate attached.<br><br>" +
    "Om Shanti &#128591;<br><br>" +
    "<i>Global School of Yoga</i>";

  GmailApp.sendEmail(email, subject, "", {
    htmlBody: message,
    attachments: [pdfBlob]
  });

  Logger.log("Certificate email sent to: " + email);

  return true;
}

