const formidable = require('formidable');
const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
const { PDFDocument } = require('pdf-lib');

exports.handler = async (event, context) => {
  try {
    // Parse the incoming multipart/form-data
    const form = new formidable.IncomingForm({
      uploadDir: '/tmp', // Temporary directory (Netlify Functions use /tmp)
      keepExtensions: true,
    });

    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(event.body, (err, fields, files) => {
        if (err) reject(err);
        resolve({ fields, files });
      });
    });

    const clientName = fields.clientName;
    const uploadedFile = files.report;
    if (!uploadedFile) {
      throw new Error('No file uploaded');
    }

    const filePath = uploadedFile.path;
    const originalFilename = uploadedFile.name;

    // Generate unique code and QR code
    const uniqueCode = uuidv4().slice(0, 6).toUpperCase();
    const qrCodeUrl = `http://yourdomain.netlify.app/verify/${uniqueCode}`; // Update with your Netlify domain later
    const qrCodePath = `/tmp/${uniqueCode}-qrcode.png`;
    await QRCode.toFile(qrCodePath, qrCodeUrl);

    // Load and modify the PDF
    const pdfDoc = await PDFDocument.load(fs.readFileSync(filePath));
    const firstPage = pdfDoc.getPages()[0];
    const qrCodeImage = await pdfDoc.embedPng(fs.readFileSync(qrCodePath));

    const qrCodeWidth = 80;
    const qrCodeHeight = 80;
    const qrCodeX = 20;
    const qrCodeY = 50;

    firstPage.drawImage(qrCodeImage, {
      x: qrCodeX,
      y: qrCodeY,
      width: qrCodeWidth,
      height: qrCodeHeight,
    });

    firstPage.drawText(`Client: ${clientName} | Code: ${uniqueCode}`, {
      x: qrCodeX,
      y: qrCodeY - 15,
      size: 10,
    });

    // Save the updated PDF
    const updatedPdfBytes = await pdfDoc.save();
    const updatedPdfFilename = `processed-${Date.now()}-${originalFilename}`;
    const updatedPdfPath = `/tmp/${updatedPdfFilename}`;
    fs.writeFileSync(updatedPdfPath, updatedPdfBytes);

    // Read the processed file as a buffer to return it
    const fileBuffer = fs.readFileSync(updatedPdfPath);
    const base64File = fileBuffer.toString('base64');

    // Clean up temporary files
    fs.unlinkSync(filePath);
    fs.unlinkSync(qrCodePath);
    fs.unlinkSync(updatedPdfPath);

    // Return the processed file and QR code URL
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'File processed successfully!',
        downloadUrl: `data:application/pdf;base64,${base64File}`, // Return file as base64
        qrCodeUrl: qrCodeUrl,
      }),
    };
  } catch (err) {
    console.error('Error in upload function:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `An error occurred: ${err.message}` }),
    };
  }
};
