function sendCertificateWhatsapp(phoneNumber, name, registrationId, certificateUrl) {

  var url = "https://api.gupshup.io/wa/api/v1/template/msg";

  var templateJSON = JSON.stringify({
    id: "2a51d731-a55e-4b88-bffb-42812be41c73",
    params: [ name, registrationId ]
  });

  var messageJSON = JSON.stringify({
    document: {
      link: certificateUrl,
      filename: "Certificate_" + registrationId + ".pdf"
    },
    type: "document"
  });

  var payload =
    "channel=whatsapp" +
    "&source=919384016800" +
    "&destination=" + phoneNumber +
    "&src.name=certificate_delivery_utility" +
    "&template=" + encodeURIComponent(templateJSON) +
    "&message=" + encodeURIComponent(messageJSON);

  var options = {
    method: "post",
    contentType: "application/x-www-form-urlencoded",
    headers: { 
      "apikey": "sk_82e35144d3334a908a3bcf95518c9c42"
    },
    payload: payload,
    muteHttpExceptions: true
  };

  var response = UrlFetchApp.fetch(url, options);
  return response.getContentText();
}


function testSendCertificateWhatsapp() {

  var name = "Premanandhan Narayanan";
  var regId = "GSY2025-000002";
  var phoneNumber = "919884486609";

  try {
    var certUrl = getCertificateUrl(regId, name);
    Logger.log("PDF Certificate URL: " + certUrl);

    var response = sendCertificateWhatsapp(phoneNumber, name, regId, certUrl);
    Logger.log("WhatsApp API Response: " + response);

  } catch (e) {
    Logger.log("ERROR in testSendCertificateWhatsapp: " + e.message);
  }
}

function getCertificateUrl(registrationId, name) {
  var folderName = "Meditation Certificates 2025";
  var folder = DriveApp.getFoldersByName(folderName);

  if (!folder.hasNext()) {
    throw new Error("Folder '" + folderName + "' not found.");
  }

  var folderObj = folder.next();
  var files = folderObj.getFiles();

  registrationId = registrationId.toLowerCase().trim();
  name = name.toLowerCase().trim();

  var pdfFile = null;
  var docFile = null;

  while (files.hasNext()) {
    var file = files.next();
    var fname = file.getName().toLowerCase().trim();
    var mime = file.getMimeType();

    // Match by filename pattern
    var isMatch =
      fname.startsWith("certificate_") &&
      fname.includes(registrationId) &&
      fname.includes(name);

    if (isMatch && mime === MimeType.PDF) {
      pdfFile = file; // First priority: Use existing PDF
      break;
    }

    if (isMatch && mime !== MimeType.PDF) {
      docFile = file; // Backup: Google Docs version
    }
  }

  // If PDF already exists → RETURN it
  if (pdfFile) {
    Logger.log("Using existing PDF: " + pdfFile.getName());
    pdfFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    return pdfFile.getUrl();
  }

  // Otherwise convert Google Doc → PDF
  if (!docFile) {
    throw new Error("Certificate file NOT FOUND for " + name);
  }

  Logger.log("Converting DOC to PDF: " + docFile.getName());

  // Convert doc → PDF
  var pdfBlob = docFile.getBlob().getAs("application/pdf");

  var pdfFileName = docFile.getName().replace(/\.docx$/i, "") + ".pdf";

  var newPdf = folderObj.createFile(pdfBlob).setName(pdfFileName);
  newPdf.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

  return newPdf.getUrl();
}

