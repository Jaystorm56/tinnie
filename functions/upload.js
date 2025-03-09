const formidable = require('formidable');
const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
const { PDFDocument } = require('pdf-lib');

exports.handler = async (event, context) => {
  console.log('Function invoked with event:', event);

  try {
    // Check if the body is base64-encoded (Netlify does this for binary data)
    let bodyBuffer = event.body;
    if (event.isBase64Encoded) {
      bodyBuffer = Buffer.from(event.body, 'base64');
    } else {
      bodyBuffer = Buffer.from(event.body);
    }

    console.log('Parsing form data');
    const form = new formidable.IncomingForm({
      uploadDir: '/tmp',
      keepExtensions: true,
      maxFileSize: 2 * 1024 * 1024, // Limit to 2MB
    });

    // Parse the buffer manually
    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(bodyBuffer, (err, fields, files) => {
        if (err) {
          console.error('Form parsing error:', err);
          reject(err);
        } else {
          resolve({ fields, files });
        }
      });
    });

    console.log('Fields:', fields);
    console.log('Files:', files);

    const clientName = fields.clientName;
    const uploadedFile = files.report;
    if (!uploadedFile || !uploadedFile.path) {
      throw new Error('No file uploaded or file path missing');
    }

    const filePath = uploadedFile.path;
    const originalFilename = uploadedFile.name || 'uploaded.pdf';
    console.log('File path:', filePath);

    const uniqueCode = uuidv4().slice(0, 6).toUpperCase();
    const qrCodeUrl = `https://pdf-upload-site.netlify.app/verify/${uniqueCode}`; // Use your Netlify domain
    const qrCodePath = `/tmp/${uniqueCode}-qrcode.png`;
    console.log('Generating QR code at:', qrCodePath);
    await QRCode.toFile(qrCodePath, qrCodeUrl);

    console.log('Loading PDF');
    const pdfDoc = await PDFDocument.load(fs.readFileSync(filePath));
    const firstPage = pdfDoc.getPages()[0];
    console.log('Embedding QR code');
    const qrCodeImage = await pdfDoc.embedPng(fs.readFileSync(qrCodePath));

    firstPage.drawImage(qrCodeImage, {
      x: 20,
      y: 50,
      width: 80,
      height: 80,
    });

    firstPage.drawText(`Client: ${clientName} | Code: ${uniqueCode}`, {
      x: 20,
      y: 35,
      size: 10,
    });

    console.log('Saving PDF');
    const updatedPdfBytes = await pdfDoc.save();
    const updatedPdfFilename = `processed-${Date.now()}-${originalFilename}`;
    const updatedPdfPath = `/tmp/${updatedPdfFilename}`;
    fs.writeFileSync(updatedPdfPath, updatedPdfBytes);

    const fileBuffer = fs.readFileSync(updatedPdfPath);
    const base64File = fileBuffer.toString('base64');

    console.log('Cleaning up files');
    fs.unlinkSync(filePath);
    fs.unlinkSync(qrCodePath);
    fs.unlinkSync(updatedPdfPath);

    console.log('Returning response');
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // Ensure CORS works
      },
      body: JSON.stringify({
        message: 'File processed successfully!',
        downloadUrl: `data:application/pdf;base64,${base64File}`,
        qrCodeUrl: qrCodeUrl,
      }),
    };
  } catch (err) {
    console.error('Error in function:', err);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: `An error occurred: ${err.message}` }),
    };
  }
};