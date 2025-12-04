/******************************************************
 * 1. MOCK WHATSAPP FUNCTION (Testing Only)
 ******************************************************/
function sendWhatsAppMessageMock(phoneNumber, messageText) {
  const payload = {
    channel: "whatsapp",
    source: "sandbox",
    destination: phoneNumber,
    message: { type: "text", text: messageText }
  };

  Logger.log("MOCK WHATSAPP SEND → " + JSON.stringify(payload));
  return "Mock message prepared.";
}


/******************************************************
 * 2. GENERATE REGISTRATION ID
 ******************************************************/
function generateRegistrationID(rowNumber) {
  return "GSY2025-" + rowNumber.toString().padStart(6, '0');
}


/******************************************************
 * 3. HANDLE USER REGISTRATION FORM SUBMISSION
 ******************************************************/
function onFormSubmit(e) {

  const sheet = e.source.getActiveSheet();
  const row = e.range.getRow();

  const name  = sheet.getRange(row, 2).getValue();
  const phone = sheet.getRange(row, 7).getValue();
  const email = sheet.getRange(row, 8).getValue();

  const registrationID = generateRegistrationID(row);
  sheet.getRange(row, 15).setValue(registrationID);

  const msg =
    "Namaste " + name + " 🙏\n\n" +
    "Thank you for registering for *International Meditation Day – Dec 21, 2025*.\n\n" +
    "*Your Registration ID:* " + registrationID + "\n\n" +
    "We will send the event link and certificate soon.\n\n" +
    "Om Shanti 🙏";

  sendWhatsAppMessageMock("91" + phone, msg);

  sendConfirmationEmail(email, name, registrationID);
}


/******************************************************
 * 4. REGISTRATION CONFIRMATION EMAIL
 ******************************************************/
function sendConfirmationEmail(email, name, registrationID) {

  const subject = "Your Registration is Confirmed – International Meditation Day";

  const body =
    "Namaste " + name + " &#128591;,<br><br>" +
    "Thank you for registering for the <b>International Meditation Day – World Peace Meditation</b>.<br><br>" +
    "<b>Your Registration ID:</b> " + registrationID + "<br><br>" +
    "🧘‍♂️ Event Date: <b>21 December 2025</b><br>" +
    "⏰ Time: <b>11 AM – 11:30 AM IST</b><br><br>" +
    "Om Shanti &#128591;<br><br>" +
    "<i>Global School of Yoga</i>";

  GmailApp.sendEmail(email, subject, "", { htmlBody: body });
}


/******************************************************
 * 5. CUSTOM MENU
 ******************************************************/
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("World Peace Automation")
    .addItem("Verify Payment for Selected Row", "verifyPaymentForSelectedRow")
    .addItem("Mark Payment as NOT Verified", "markPaymentNotVerified")
    .addToUi();
}


/******************************************************
 * 6. VERIFY PAYMENT
 ******************************************************/
function verifyPaymentForSelectedRow() {

  const sheet = SpreadsheetApp.getActiveSheet();
  const row   = sheet.getActiveRange().getRow();

  const name  = sheet.getRange(row, 2).getValue();
  const email = sheet.getRange(row, 8).getValue();
  const phone = sheet.getRange(row, 7).getValue();

  const paymentID = sheet.getRange(row, 12).getValue();

  if (!paymentID || !paymentID.toString().startsWith("pay_")) {
    SpreadsheetApp.getUi().alert("Invalid Payment ID. Must start with 'pay_'.");
    return;
  }

  sheet.getRange(row, 16).setValue("YES");
  sheet.getRange(row, 19).setValue("Payment Verified Successfully");

  sendPaymentSuccessEmail(email, name);

  const msg =
    "Namaste " + name + " 🙏\n\n" +
    "Your ₹99 donation has been successfully received.\n" +
    "Your participation is confirmed.\n\n" +
    "Om Shanti 🙏";

  sendWhatsAppMessageMock("91" + phone, msg);

  SpreadsheetApp.getUi().alert("Payment Verified!");
}


/******************************************************
 * 7. PAYMENT SUCCESS EMAIL
 ******************************************************/
function sendPaymentSuccessEmail(email, name) {

  const subject = "Payment Received – International Meditation Day";

  const body =
    "Namaste " + name + " &#128591;,<br><br>" +
    "We have received your <b>₹99 donation</b> successfully.<br><br>" +
    "Your participation is now <b>confirmed</b>.<br><br>" +
    "Om Shanti &#128591;<br><br>" +
    "<i>Global School of Yoga</i>";

  GmailApp.sendEmail(email, subject, "", { htmlBody: body });
}


/******************************************************
 * 8. PAYMENT NOT VERIFIED
 ******************************************************/
function markPaymentNotVerified() {

  const sheet = SpreadsheetApp.getActiveSheet();
  const row = sheet.getActiveRange().getRow();

  sheet.getRange(row, 16).setValue("NO");  
  sheet.getRange(row, 19).setValue("Marked as NOT Verified");

  SpreadsheetApp.getUi().alert("Payment marked as NOT Verified.");
}


/******************************************************
 * 9. CERTIFICATE GENERATION (ONLY ONE FUNCTION!)
 ******************************************************/
function generateAndSendCertificate(name, email, regID) {

  const TEMPLATE_ID = "1J1Yf3jiY4IASa0GEdKGI-un7ergKFt6IqePstSduvu8";
  const FOLDER_ID   = "1xgYZ4NCN3vY-UyXYUzakDWSVlcThLkZI";

  const folder = DriveApp.getFolderById(FOLDER_ID);
  const copy = DriveApp.getFileById(TEMPLATE_ID)
    .makeCopy("Certificate_" + regID + "_" + name, folder);

  Logger.log("Copy created with ID: " + copy.getId());

  const doc = DocumentApp.openById(copy.getId());
  const body = doc.getBody();

  body.replaceText("{{NAME}}", name);

  Logger.log("Name replaced in certificate");

  doc.saveAndClose();

  const pdfBlob = copy.getAs("application/pdf");

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

  Logger.log("Certificate email sent to " + email);

  return true;
}


/******************************************************
 * 10. EVENT COMPLETION HANDLER
 ******************************************************/
function onEventCompletionFormSubmit(e) {

  Logger.log("Step 1: Trigger started");

  const regID = (e.namedValues["Registration ID"][0] || "").trim();
  Logger.log("RegID: " + regID);

  if (!regID) return;

  const ss = SpreadsheetApp.openById("1_jK5lOGSU6-wAdJdN4e8LtmPNZoW34lIcAry0aKmZpQ");
  const sheet = ss.getSheetByName("Form Responses 1");

  const lastRow = sheet.getLastRow();
  const ids = sheet.getRange(2, 15, lastRow - 1, 1).getValues();

  let foundRow = -1;
  for (let i = 0; i < ids.length; i++) {
    if ((ids[i][0] || "").toString().trim() === regID) {
      foundRow = i + 2;
      break;
    }
  }

  Logger.log("Found Row: " + foundRow);

  if (foundRow === -1) return;

  sheet.getRange(foundRow, 20).setValue("YES");
  sheet.getRange(foundRow, 21).setValue(new Date());

  const name  = sheet.getRange(foundRow, 2).getValue();
  const email = sheet.getRange(foundRow, 8).getValue();

  Logger.log("Name: " + name);
  Logger.log("Email: " + email);
  Logger.log("Generating certificate…");

  generateAndSendCertificate(name, email, regID);

  sheet.getRange(foundRow, 17).setValue("YES");
  sheet.getRange(foundRow, 18).setValue(new Date());
}
function testCertificate() {
  generateAndSendCertificate(
    "Premanandhan Narayanan",
    "premanandhan@gmail.com",
    "GSY2025-TEST01"
  );
}
