import React, { useState } from 'react';
import { PDFDocument  } from 'pdf-lib';
import pdfTemplate from './templates/PDFResultado1.pdf';
import { Buffer } from 'buffer';

import LucidaGrandeBold from "./fonts/LucidaGrandeBold.ttf";
import LucidaGrande from "./fonts/LucidaGrande.ttf";


import fontkit from '@pdf-lib/fontkit';


function Certificate2({ user }) {
  const [pdfUrl, setPdfUrl] = useState(null);

  async function generateCertificate() {
        // Load the PDF template
    const existingPdfBytes = await fetch(pdfTemplate).then(res => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    //Embed fontkit
    pdfDoc.registerFontkit(fontkit);
    //Font

    const fontDataLucidaGrandeBold = await fetch(LucidaGrandeBold)
    .then((response) => response.arrayBuffer())
    .then((arrayBuffer) => Buffer.from(arrayBuffer))
    .then((buffer) => buffer.toString("base64"));

    const fontDataLucidaGrande = await fetch(LucidaGrande)
    .then((response) => response.arrayBuffer())
    .then((arrayBuffer) => Buffer.from(arrayBuffer))
    .then((buffer) => buffer.toString("base64"));

    const LucidaGrandeBoldFont = await pdfDoc.embedFont(fontDataLucidaGrandeBold);
    const LucidaGrandeFont = await pdfDoc.embedFont(fontDataLucidaGrande);
    // Get the first page of the PDF
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

    //widths
    const nameWidth = LucidaGrandeBoldFont.widthOfTextAtSize(user.name, 32);
    const levelWidth = LucidaGrandeBoldFont.widthOfTextAtSize(user.level, 24);
    const scoreWidth = LucidaGrandeBoldFont.widthOfTextAtSize(user.score + "/100", 24);
    const dateWidth = LucidaGrandeFont.widthOfTextAtSize(user.date, 16);
    //Heights
    const nameHeight = LucidaGrandeBoldFont.heightAtSize(32);
    const levelScoreHeight = LucidaGrandeBoldFont.heightAtSize(24);
    const dateHeight = LucidaGrandeFont.heightAtSize(16);
    // Define the position and size of the placeholders in the PDF template
    //General
    const placeholdersWidth = 524;

    //Name
    const namePlaceholderHeight = 45;
    const namePlaceholderBottom = 385+((namePlaceholderHeight-nameHeight)/2);
    //
    const levelPlaceholderHeight = 34;
    const levelPlaceholderBottom = 300+((levelPlaceholderHeight-levelScoreHeight)/2);

    const scorePlaceholderHeight = 34;
    const scorePlaceholderBottom = 252+((scorePlaceholderHeight-levelScoreHeight)/2);

    const datePlaceholderHeight = 22;
    const datePlaceholderBottom = 216+((datePlaceholderHeight-dateHeight)/2);

    // Convert the pixel distances to PDF coordinates
    const {width } = firstPage.getSize();

    // Add the dynamic data to the PDF template
    firstPage.drawText(user.name, { x:( width / 2 - nameWidth / 2)+6, y: namePlaceholderBottom, size: 32, font:LucidaGrandeBoldFont, width: placeholdersWidth, height: namePlaceholderHeight });
    firstPage.drawText(user.level, { x:width / 2 - levelWidth / 2, y: levelPlaceholderBottom, size: 24,font:LucidaGrandeBoldFont, width: placeholdersWidth, height: levelPlaceholderHeight });
    firstPage.drawText(user.score + "/100", { x: (width / 2 - scoreWidth / 2)+6, y: scorePlaceholderBottom, size: 24,font:LucidaGrandeBoldFont, width: placeholdersWidth, height: scorePlaceholderHeight });
    firstPage.drawText(user.date, { x: (width / 2 - dateWidth / 2)+6, y: datePlaceholderBottom, size: 16, font:LucidaGrandeFont, width: placeholdersWidth, height: datePlaceholderHeight });
    
    // Convert the modified PDF to a blob and create a URL for downloading it
    const modifiedPdfBytes = await pdfDoc.save();
    const url = URL.createObjectURL(new Blob([modifiedPdfBytes], { type: 'application/pdf' }));
    setPdfUrl(url);
  }

  return (
    <div>
      <h1>Certificate for {user.name}</h1>
      <button onClick={generateCertificate}>Generate Certificate</button>
      {pdfUrl && (
        <div>
          <iframe title="Certificate" src={pdfUrl} style={{ width: '100%', height: '500px' }}></iframe>
          <a href={pdfUrl} download={`${user.name}-certificate.pdf`}>
            Download Certificate
          </a>
        </div>
      )}
    </div>
  );
}

export default Certificate2;
