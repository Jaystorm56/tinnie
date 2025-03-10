const multipart = require('parse-multipart-data');
const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
const { PDFDocument } = require('pdf-lib');

exports.handler = async (event, context) => {
  console.log('Function invoked with event:', event);

  try {
    const bodyBuffer = event.isBase64Encoded
      ? Buffer.from(event.body, 'base64')
      : Buffer.from(event.body);

    const boundary = event.headers['content-type'].split('boundary=')[1];
    const parts = multipart.parse(bodyBuffer, boundary);

    let clientName = '';
    let fileData = null;
    let originalFilename = 'uploaded.pdf';

    for (const part of parts) {
      if (part.name === 'clientName') {
        clientName = part.data.toString();
      } else if (part.name === 'report') {
        fileData = part.data;
        originalFilename = part.filename || 'uploaded.pdf';
      }
    }

    if (!fileData) {
      throw new Error('No file uploaded');
    }

    const filePath = `/tmp/uploaded-${Date.now()}.pdf`;
    fs.writeFileSync(filePath, fileData);

    const uniqueCode = uuidv4().slice(0, 6).toUpperCase();
    // Include clientName in the QR code URL
    const qrCodeUrl = `https://pdf-upload-site.netlify.app/.netlify/functions/verify?code=${uniqueCode}&client=${encodeURIComponent(clientName)}`;
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

    firstPage.drawText(`Code: ${uniqueCode}`, {
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
        'Access-Control-Allow-Origin': '*',
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