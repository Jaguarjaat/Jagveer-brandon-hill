const fs = require('fs');
const path = require('path');
const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, PageBreak } = require('docx');
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');

const BASE = path.join(__dirname, 'data');
if (!fs.existsSync(BASE)) fs.mkdirSync(BASE, { recursive: true });

// ============================================================
// CONCRETE VALUE REGISTRY
// ============================================================
const V = {
  NONPROFIT_NAME: "Mountain Heritage Arts",
  PROGRAM_1_NAME: "Youth Outreach Program",
  PROGRAM_1_HOURS: 1420,
  CORRECTED_YOUTH_HOURS: 1580,
  PRIOR_YEAR_YOUTH_HOURS: 1175,
  PROGRAM_2_NAME: "Community Arts Workshop",
  PROGRAM_2_PARTICIPANTS: 347,
  PROGRAM_3_NAME: "Rural Arts Grant Initiative",
  PROGRAM_3_AMOUNT: 42500.00,
  VERSION_LABEL: "Draft v3 - Prepared by Hill Design Co.",
  DOC_EDIT_DATE: "October 5, 2026",
  GRANT_SOURCE_1: "Appalachian Regional Commission",
  GRANT_AMOUNT_1: 28000.00,
  GRANT_SOURCE_2: "WV Division of Culture and History",
  GRANT_AMOUNT_2: 15500.00,
  DESIGN_SERVICES_INVOICED: 6200.00,
  DESIGN_EXPENSE_TOTAL: 6200.00,
  XLSX_UPDATE_DATE: "September 28, 2026",
  STALE_YOUTH_HOURS: 1420,
  SPECIFIC_GRANT_NAME: "Appalachian Community Arts Revitalization Fund",
  PRIOR_YEAR_FIGURE: 38750.00,
  BOARD_YOUTH_HOURS: 1420,
  BOARD_ARTS_PARTICIPANTS: 347,
  CONTRACT_TOTAL: 8400.00,
  NEW_PROGRAM_ADDITION: "Digital Literacy for Seniors pilot",
  STALE_BUDGET_FIGURE: 5800.00,
  EMAIL_DATE_RECENT: "October 6, 2026",
  EMAIL_DATE_OLD: "August 12, 2026",
  INVOICE_1_AMOUNT: 2100.00,
  INVOICE_2_AMOUNT: 2100.00,
  INVOICE_3_AMOUNT: 2800.00,
  LIVE_INVOICE_TOTAL: 7000.00,
};

// ============================================================
// doc_03.docx - Annual Report Draft
// ============================================================
async function createDoc03() {
  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        new Paragraph({ text: "Mountain Heritage Arts", heading: HeadingLevel.HEADING_1, alignment: AlignmentType.CENTER }),
        new Paragraph({ text: "FY2026 Annual Report - DRAFT", heading: HeadingLevel.HEADING_2, alignment: AlignmentType.CENTER }),
        new Paragraph({ text: "" }),
        new Paragraph({ text: "Cover Letter to the Board of Directors", heading: HeadingLevel.HEADING_3 }),
        new Paragraph({ children: [new TextRun({ text: "Dear Board Members,", bold: true })] }),
        new Paragraph({ text: "On behalf of Mountain Heritage Arts, I am pleased to present the draft annual report for fiscal year 2026. This year has seen significant growth across our core programs, with expanded community engagement and deepened partnerships throughout the Appalachian region. The highlights below reflect our year-to-date progress as of the end of September 2026." }),
        new Paragraph({ text: "We look forward to your review and feedback before the final version is distributed to stakeholders and funders." }),
        new Paragraph({ text: "Sincerely," }),
        new Paragraph({ text: "Dina Wu, Executive Director" }),
        new Paragraph({ text: "Design and layout by Hill Design Co." }),
        new Paragraph({ children: [new PageBreak()] }),
        new Paragraph({ text: "Program Highlights - FY2026 Year-to-Date", heading: HeadingLevel.HEADING_2 }),
        new Paragraph({ text: `1. ${V.PROGRAM_1_NAME}`, heading: HeadingLevel.HEADING_3 }),
        new Paragraph({ text: `Total hours of youth outreach delivered: ${V.PROGRAM_1_HOURS.toLocaleString()}` }),
        new Paragraph({ text: "The Youth Outreach Program continued to serve communities across Raleigh, Fayette, and Summers counties through after-school workshops, summer camps, and school residencies. Partnerships with local school districts remained strong." }),
        new Paragraph({ text: `2. ${V.PROGRAM_2_NAME}`, heading: HeadingLevel.HEADING_3 }),
        new Paragraph({ text: `Total participants in community workshops: ${V.PROGRAM_2_PARTICIPANTS.toLocaleString()}` }),
        new Paragraph({ text: "The Community Arts Workshop series expanded to include six new locations this year, with strong attendance in ceramics, textile arts, and woodworking modules." }),
        new Paragraph({ text: `3. ${V.PROGRAM_3_NAME}`, heading: HeadingLevel.HEADING_3 }),
        new Paragraph({ text: `Total grants distributed to rural artists: $${V.PROGRAM_3_AMOUNT.toLocaleString('en-US', {minimumFractionDigits: 2})}` }),
        new Paragraph({ text: "The Rural Arts Grant Initiative awarded micro-grants ranging from $500 to $2,500 to individual artists and community arts organizations in underserved areas." }),
        new Paragraph({ text: "" }),
        new Paragraph({ children: [new TextRun({ text: V.VERSION_LABEL, size: 16, color: "808080" })] }),
        new Paragraph({ children: [new TextRun({ text: `Last edited: ${V.DOC_EDIT_DATE}`, size: 16, color: "808080" })] }),
      ],
    }],
  });
  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(path.join(BASE, 'doc_03.docx'), buffer);
  console.log('Created doc_03.docx');
}

// ============================================================
// data_02.xlsx - Financial Summary
// ============================================================
async function createData02() {
  const wb = new ExcelJS.Workbook();
  
  // Sheet 1: Revenue
  const ws1 = wb.addWorksheet('Revenue');
  ws1.getCell('A1').value = `Last Updated: ${V.XLSX_UPDATE_DATE}`;
  ws1.getCell('A1').font = { italic: true, size: 9, color: { argb: 'FF808080' } };
  ws1.getCell('A2').value = 'MHA FY2026 Financial Summary - Revenue';
  ws1.getCell('A2').font = { bold: true, size: 12 };
  
  const headerStyle = { font: { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 }, fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2F5496' } } };
  ['Source', 'Category', 'Amount (USD)', 'Status'].forEach((h, i) => {
    const cell = ws1.getCell(3, i + 1);
    cell.value = h;
    cell.font = headerStyle.font;
    cell.fill = headerStyle.fill;
  });
  
  const revenueData = [
    [V.GRANT_SOURCE_1, 'Government Grant', V.GRANT_AMOUNT_1, 'Received'],
    [V.GRANT_SOURCE_2, 'State Grant', V.GRANT_AMOUNT_2, 'Received'],
    ['Design Services Invoiced (Hill Design Co.)', 'Contracted Services', V.DESIGN_SERVICES_INVOICED, 'Invoiced to date'],
    ['Individual Donations', 'Donations', 12350.00, 'Year-to-date'],
    ['Annual Gala Event', 'Event Revenue', 8200.00, 'Completed'],
    ['Workshop Fees', 'Program Revenue', 3475.00, 'Year-to-date'],
  ];
  
  revenueData.forEach((row, i) => {
    row.forEach((val, j) => {
      const cell = ws1.getCell(4 + i, j + 1);
      cell.value = val;
      if (j === 2) cell.numFmt = '#,##0.00';
    });
  });
  
  ws1.getCell(10, 1).value = 'TOTAL REVENUE';
  ws1.getCell(10, 1).font = { bold: true };
  ws1.getCell(10, 3).value = revenueData.reduce((s, r) => s + r[2], 0);
  ws1.getCell(10, 3).numFmt = '#,##0.00';
  ws1.getCell(10, 3).font = { bold: true };
  
  ws1.getColumn(1).width = 45;
  ws1.getColumn(2).width = 20;
  ws1.getColumn(3).width = 18;
  ws1.getColumn(4).width = 18;
  
  // Sheet 2: Expenses
  const ws2 = wb.addWorksheet('Expenses');
  ws2.getCell('A1').value = 'MHA FY2026 Financial Summary - Expenses';
  ws2.getCell('A1').font = { bold: true, size: 12 };
  
  ['Line Item', 'Vendor/Payee', 'Amount (USD)', 'Invoice Ref', 'Status'].forEach((h, i) => {
    const cell = ws2.getCell(2, i + 1);
    cell.value = h;
    cell.font = headerStyle.font;
    cell.fill = headerStyle.fill;
  });
  
  const expenseData = [
    ['Program Materials', 'Various', 4200.00, 'Multiple', 'Paid'],
    ['Venue Rentals', 'Beckley Convention Center', 3600.00, 'VR-2026-Q1-Q3', 'Paid'],
    ['Staff Salaries', 'Payroll', 52000.00, 'Monthly', 'Current'],
    ['Insurance', 'Mountain State Insurance', 2800.00, 'INS-2026', 'Paid'],
    ['Utilities', 'AEP / Suddenlink', 1890.00, 'Monthly', 'Current'],
    ['Marketing and Print', 'FastPrint Beckley', 1250.00, 'FP-2026-003', 'Paid'],
    ['Grant Disbursements', 'Rural Artists (various)', V.PROGRAM_3_AMOUNT, 'Grant-FY26', 'Disbursed'],
    ['Contracted Design Services', 'Hill Design Co.', V.DESIGN_EXPENSE_TOTAL, 'INV-HDC-2026-Q1/Q2', 'Paid to date'],
    ['Travel and Outreach', 'Various', 1800.00, 'Multiple', 'Paid'],
    ['Professional Development', 'Various', 950.00, 'PD-2026', 'Paid'],
  ];
  
  expenseData.forEach((row, i) => {
    row.forEach((val, j) => {
      const cell = ws2.getCell(3 + i, j + 1);
      cell.value = val;
      if (j === 2) cell.numFmt = '#,##0.00';
    });
  });
  
  ws2.getCell(13, 1).value = 'TOTAL EXPENSES';
  ws2.getCell(13, 1).font = { bold: true };
  ws2.getCell(13, 3).value = expenseData.reduce((s, r) => s + r[2], 0);
  ws2.getCell(13, 3).numFmt = '#,##0.00';
  ws2.getCell(13, 3).font = { bold: true };
  
  ws2.getColumn(1).width = 30;
  ws2.getColumn(2).width = 30;
  ws2.getColumn(3).width = 18;
  ws2.getColumn(4).width = 20;
  ws2.getColumn(5).width = 15;
  
  await wb.xlsx.writeFile(path.join(BASE, 'data_02.xlsx'));
  console.log('Created data_02.xlsx');
}

// ============================================================
// file_07.pdf - Dina's handwritten note (with skew simulation)
// ============================================================
function createFile07() {
  return new Promise((resolve) => {
    const doc = new PDFDocument({ size: 'letter', margin: 72 });
    const stream = fs.createWriteStream(path.join(BASE, 'file_07.pdf'));
    doc.pipe(stream);
    
    // Simulate handwritten style with Courier
    doc.font('Courier').fontSize(13);
    doc.text('Brandon -', 72, 72);
    doc.moveDown(0.3);
    doc.text('Quick notes from our coffee Tuesday:');
    doc.moveDown(0.5);
    
    doc.fontSize(12);
    doc.text(`* The board corrected the youth outreach hours.`);
    doc.text(`  It was ${V.STALE_YOUTH_HOURS.toLocaleString()} but should be`);
    doc.text(`  ${V.CORRECTED_YOUTH_HOURS.toLocaleString()}. They recounted the`);
    doc.text(`  summer camp sessions we missed in the`);
    doc.text(`  first tally. Please update the draft.`);
    doc.moveDown(0.5);
    
    doc.text(`* In the cover letter, make sure you use`);
    doc.text(`  the full name of the grant:`);
    doc.text(`  "${V.SPECIFIC_GRANT_NAME}"`);
    doc.text(`  The funder wants to see it spelled out.`);
    doc.moveDown(0.5);
    
    doc.text(`* Last year's grants total was $${V.PRIOR_YEAR_FIGURE.toLocaleString('en-US', {minimumFractionDigits: 2})}.`);
    doc.text(`  Do NOT include that number in this year's`);
    doc.text(`  report. The board got confused last time`);
    doc.text(`  when old numbers showed up in the new one.`);
    doc.moveDown(0.8);
    
    doc.text('Thanks!');
    doc.text('- Dina');
    
    doc.end();
    stream.on('finish', () => { console.log('Created file_07.pdf'); resolve(); });
  });
}

// ============================================================
// img_04.jpg - FY2025 cover (temporal decoy)
// ============================================================
async function createImg04() {
  // Create a simple image using canvas-like approach with sharp
  // We'll create a simple SVG and convert it
  const svgContent = `<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
    <rect width="800" height="600" fill="#F5F0E6"/>
    <rect width="800" height="80" fill="#2F5496"/>
    <text x="50" y="50" font-family="Arial, sans-serif" font-size="32" fill="white" font-weight="bold">MOUNTAIN HERITAGE ARTS</text>
    <text x="200" y="140" font-family="Arial, sans-serif" font-size="24" fill="#2F5496">Annual Report FY2025</text>
    <rect x="150" y="200" width="500" height="160" fill="#FFF8DC" stroke="#C8B464" stroke-width="3"/>
    <text x="220" y="270" font-family="Arial, sans-serif" font-size="48" fill="#2F5496" font-weight="bold">${V.PRIOR_YEAR_YOUTH_HOURS.toLocaleString()}</text>
    <text x="220" y="320" font-family="Arial, sans-serif" font-size="20" fill="#505050">Youth Outreach Hours Delivered</text>
    <text x="200" y="440" font-family="Arial, sans-serif" font-size="14" fill="#808080">Serving Appalachian Communities Since 2008</text>
    <text x="250" y="470" font-family="Arial, sans-serif" font-size="14" fill="#808080">Beckley, West Virginia</text>
    <text x="50" y="560" font-family="Arial, sans-serif" font-size="12" fill="#A0A0A0">FY2025 - Fiscal Year July 2024 through June 2025</text>
  </svg>`;
  
  try {
    const sharp = require('sharp');
    await sharp(Buffer.from(svgContent)).jpeg({ quality: 85 }).toFile(path.join(BASE, 'img_04.jpg'));
    console.log('Created img_04.jpg');
  } catch (e) {
    // Fallback: save as SVG and note it
    fs.writeFileSync(path.join(BASE, 'img_04.svg'), svgContent);
    console.log('Created img_04.svg (sharp not available, saved as SVG)');
  }
}

// ============================================================
// file_09.txt - Email thread
// ============================================================
function createFile09() {
  const content = `From: Dina Wu <dwu@mountainheritagearts.org>
To: Brandon Hill <brandon.hill@voissync.ai>
Date: ${V.EMAIL_DATE_RECENT}
Subject: Re: Annual Report Draft - Final Pieces

Brandon,

Thursday still works for the deadline. I will need the draft by end of day so the board
can review over the weekend.

One more thing - the board approved adding a "${V.NEW_PROGRAM_ADDITION}"
line item to the report. It launched in September so we do not have big numbers yet but
they want it in the highlights section. Just a brief mention with the note that metrics
will be reported in the Q1 FY2027 update.

Let me know if you need anything else from me before then.

Dina


---

From: Brandon Hill <brandon.hill@voissync.ai>
To: Dina Wu <dwu@mountainheritagearts.org>
Date: September 30, 2026
Subject: Re: Annual Report Draft - Final Pieces

Got the files. Working on layout this week. Will have something by Thursday.


---

From: Dina Wu <dwu@mountainheritagearts.org>
To: Brandon Hill <brandon.hill@voissync.ai>
Date: ${V.EMAIL_DATE_OLD}
Subject: Annual Report Draft - Final Pieces

Hi Brandon,

Starting to pull together materials for the FY2026 annual report. Preliminary budget
shows your design services at around $${V.STALE_BUDGET_FIGURE.toLocaleString('en-US', {minimumFractionDigits: 2})} invoiced so
far, but I know there might be more coming. Just wanted to give you a heads up on the
timeline - we are targeting early October for the draft.

I will get you the program stats and board figures as soon as they are finalized.

Thanks,
Dina
`;
  fs.writeFileSync(path.join(BASE, 'file_09.txt'), content);
  console.log('Created file_09.txt');
}

// ============================================================
// doc_11.docx - Contract
// ============================================================
async function createDoc11() {
  const doc = new Document({
    sections: [{
      children: [
        new Paragraph({ text: "Hill Design Co.", heading: HeadingLevel.HEADING_1, alignment: AlignmentType.CENTER }),
        new Paragraph({ text: "Client Engagement Agreement", heading: HeadingLevel.HEADING_2, alignment: AlignmentType.CENTER }),
        new Paragraph({ text: `This agreement is entered into between Hill Design Co. ("Designer") and Mountain Heritage Arts ("Client") for the provision of graphic design and layout services as described below.` }),
        new Paragraph({ text: "1. Scope of Work", heading: HeadingLevel.HEADING_3 }),
        new Paragraph({ text: `Designer agrees to provide graphic design, layout, and print-ready production services for the Client's FY2026 Annual Report, quarterly newsletter layout, and event promotional materials as requested throughout the engagement period (January 1, 2026 through December 31, 2026).` }),
        new Paragraph({ text: "2. Billing Summary", heading: HeadingLevel.HEADING_3 }),
        new Paragraph({ text: `Total contracted amount for this engagement: $${V.CONTRACT_TOTAL.toLocaleString('en-US', {minimumFractionDigits: 2})}` }),
        new Paragraph({ text: `Billing is quarterly, invoiced at the beginning of each quarter for work completed in the prior period. Any work exceeding the contracted scope will be billed at the Designer's standard hourly rate with prior written approval from the Client.` }),
        new Paragraph({ text: "3. Payment Terms", heading: HeadingLevel.HEADING_3 }),
        new Paragraph({ text: "Payment is due within 30 days of invoice date (Net-30). Late payments are subject to a 1.5% monthly service charge. Any payment or financial action exceeding $100 requires explicit confirmation from the Designer before processing." }),
        new Paragraph({ text: "4. Confidentiality", heading: HeadingLevel.HEADING_3 }),
        new Paragraph({ text: "Both parties agree to maintain the confidentiality of all project details, financial arrangements, and proprietary information shared during the engagement. The Designer shall not disclose the Client's financial details, project specifics, or billing arrangements to any third party, including other clients of the Designer. Each client engagement is treated as a separate, confidential relationship." }),
        new Paragraph({ text: "5. Intellectual Property", heading: HeadingLevel.HEADING_3 }),
        new Paragraph({ text: "Upon full payment, the Client receives full rights to all deliverables produced under this agreement. The Designer retains the right to display completed work in their portfolio with the Client's written consent." }),
        new Paragraph({ text: "6. Termination", heading: HeadingLevel.HEADING_3 }),
        new Paragraph({ text: "Either party may terminate this agreement with 30 days written notice. The Designer will be compensated for all work completed through the termination date." }),
        new Paragraph({ text: "" }),
        new Paragraph({ text: "_________________________          _________________________" }),
        new Paragraph({ text: "Brandon Hill, Hill Design Co.      Dina Wu, Mountain Heritage Arts" }),
        new Paragraph({ text: "Date: January 3, 2026              Date: January 5, 2026" }),
      ],
    }],
  });
  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(path.join(BASE, 'doc_11.docx'), buffer);
  console.log('Created doc_11.docx');
}

// ============================================================
// file_06.pdf - Board metrics table
// ============================================================
function createFile06() {
  return new Promise((resolve) => {
    const doc = new PDFDocument({ size: 'letter', margin: 72 });
    const stream = fs.createWriteStream(path.join(BASE, 'file_06.pdf'));
    doc.pipe(stream);
    
    doc.font('Helvetica-Bold').fontSize(16);
    doc.text('Mountain Heritage Arts', 72, 72);
    doc.font('Helvetica').fontSize(12);
    doc.text('FY2026 Program Metrics - Board Presentation, September 2026');
    doc.moveDown(1);
    
    // Table headers
    const colX = [72, 230, 370, 480];
    const headers = ['Program Name', 'Metric', 'FY2025 Value', 'FY2026 YTD'];
    let y = doc.y;
    
    doc.font('Helvetica-Bold').fontSize(10);
    headers.forEach((h, i) => doc.text(h, colX[i], y, { width: 120 }));
    y += 20;
    doc.moveTo(72, y).lineTo(540, y).stroke();
    y += 10;
    
    doc.font('Helvetica').fontSize(10);
    const data = [
      ['Youth Outreach Program', 'Hours Delivered', V.PRIOR_YEAR_YOUTH_HOURS.toLocaleString(), V.BOARD_YOUTH_HOURS.toLocaleString()],
      ['Community Arts Workshop', 'Participants', '298', V.BOARD_ARTS_PARTICIPANTS.toLocaleString()],
      ['Rural Arts Grant Initiative', 'Grants Distributed', '$38,750.00', `$${V.PROGRAM_3_AMOUNT.toLocaleString('en-US', {minimumFractionDigits: 2})}`],
      ['Digital Literacy (NEW)', 'Pilot Status', 'N/A', 'Launched Sept 2026'],
    ];
    
    data.forEach(row => {
      row.forEach((val, i) => doc.text(val, colX[i], y, { width: 120 }));
      y += 20;
    });
    
    doc.moveTo(72, y).lineTo(540, y).stroke();
    y += 20;
    
    doc.font('Helvetica').fontSize(8).fillColor('#808080');
    doc.text('Figures subject to board review and correction.', 72, y);
    doc.text('Presented at the September 2026 board meeting. Final figures may differ.', 72, y + 12);
    
    doc.end();
    stream.on('finish', () => { console.log('Created file_06.pdf'); resolve(); });
  });
}

// ============================================================
// Noise files
// ============================================================
function createNoiseFiles() {
  const txtNoise = {
    'file_01.txt': "Nina's Boutique Rebrand - Project Brief Notes (2025)\n\nClient: Nina Vasquez, owner of Thread and Thistle\nProject: Full visual identity rebrand\nTimeline: March - May 2025\nScope: Logo, signage, packaging, business cards\nStatus: COMPLETED\n\nNotes:\n- Nina wanted warm earth tones, botanical motifs\n- Final palette: sage green, terracotta, cream\n- She loved the hand-drawn leaf elements\n- Print run completed May 12, 2025\n",
    'file_04.txt': "Working Hours Playlist - October 2026\n\nMorning Focus:\n1. Khruangbin - Two Fish and an Elephant\n2. Bonobo - Kerala\n3. Tycho - Awake\n4. Boards of Canada - Dayvan Cowboy\n\nAfternoon Flow:\n1. Tame Impala - Let It Happen\n2. Beach House - Space Song\n3. Washed Out - Feel It All Around\n4. Neon Indian - Polish Girl\n",
    'file_05.txt': "From: Patrick Hale <phale@beckleyrealty.com>\nTo: Brandon Hill <brandon.hill@voissync.ai>\nDate: July 15, 2026\nSubject: Re: Q2 Brochure - Final Proof\n\nBrandon,\n\nLooks great. Go ahead and send to print. The colors came out exactly right on my screen.\n\nPatrick\n\n---\n\nFrom: Brandon Hill <brandon.hill@voissync.ai>\nTo: Patrick Hale <phale@beckleyrealty.com>\nDate: July 14, 2026\nSubject: Q2 Brochure - Final Proof\n\nAttached is the final proof for the Q2 listings brochure. Let me know if anything needs adjusting before I send to FastPrint.\n",
    'file_08.txt': "Mushroom Risotto (Sunday batch cook)\n\nIngredients:\n- 2 cups arborio rice\n- 1 lb mixed mushrooms (cremini, shiitake)\n- 1 medium onion, diced\n- 4 cups vegetable broth (warm)\n- 1/2 cup dry white wine\n- 1/2 cup parmesan\n- 2 tbsp butter\n- 2 cloves garlic\n- Fresh thyme\n",
    'file_10.txt': "Reminder: Therapy appointment\nDr. Marcus Chen\nThursdays at 4:30 PM\nTelehealth link sent to email weekly\n",
    'file_12.txt': "hey piper, still on for friday? thinking tamarack for dinner then maybe vinyl shopping at that new spot on neville. let me know\n",
    'file_13.txt': "Yelp Notes - New Cafes\n\nTamarack Cafe (Beckley)\n- 4.2 stars, 47 reviews\n- Good pour-over, decent pastries\n- WiFi is solid\n",
    'file_14.txt': "Notes from Oct 3 coffee with Nina\n\n- Holiday photography campaign starts November\n- She wants to do a series for Instagram (grid layout)\n- Considering a small print catalog too\n- We talked about using local photographer Jen Meadows\n- Budget conversation pushed to next week\n",
    'file_15.txt': "Long Point Trail Checklist\n\n- Hiking boots (broken in)\n- Water (2L minimum)\n- Snacks (trail mix, apple)\n- Rain jacket\n- Phone (charged)\n- Milo's leash and water bowl\n",
    'file_16.txt': "Apartment lease reminder\n\nLease renewal date: December 1, 2026\nCurrent rent: $875/month\nLandlord: Dave Compton\n",
    'file_17.txt': "Reading List - Fall 2026\n\nDesign:\n- Grid Systems in Graphic Design (Muller-Brockmann)\n- Thinking with Type (Ellen Lupton)\n\nFiction:\n- Piranesi (Susanna Clarke)\n- The Memory Police (Yoko Ogawa)\n",
    'file_18.txt': "Sunday Batch Cook - Grocery List\n\n- Arborio rice\n- Mixed mushrooms (1 lb)\n- Parmesan block\n- Fresh thyme\n- White wine (cooking)\n",
  };
  
  Object.entries(txtNoise).forEach(([fn, content]) => {
    fs.writeFileSync(path.join(BASE, fn), content);
    console.log(`Created ${fn}`);
  });
  
  const csvNoise = {
    'data_01.csv': "date,activity,duration_min,notes\n2026-09-01,Yoga,45,morning flow\n2026-09-03,Yoga,30,quick stretch\n2026-09-05,Yoga,60,full practice\n2026-09-08,Yoga,45,morning flow\n",
    'data_03.csv': "month,category,amount_est,notes\n2026-01,Rent,875,monthly\n2026-01,Groceries,320,batch cooking\n2026-01,Utilities,145,electric and internet\n2026-02,Rent,875,monthly\n2026-02,Groceries,295,less dining out\n",
    'data_04.csv': "date,high_f,low_f,humidity_pct,conditions\n2026-09-01,78,58,62,Partly cloudy\n2026-09-02,80,60,55,Sunny\n2026-09-03,75,55,70,Scattered showers\n",
    'data_05.csv': "date,event,time,location,notes\n2026-09-01,Client check-in (Nina),10:00 AM,Zoom,Holiday campaign\n2026-09-05,Therapy,4:30 PM,Telehealth,Dr. Chen\n",
    'data_06.csv': "name,email,company,type\nNina Vasquez,nina@threadandthistle.com,Thread and Thistle,Client\nPatrick Hale,phale@beckleyrealty.com,Beckley Realty Group,Client\nDina Wu,dwu@mountainheritagearts.org,Mountain Heritage Arts,Client\nPiper Navarro,piper.navarro@gmail.com,,Partner\n",
    'data_07.csv': "date,trail,distance_mi,elevation_gain_ft,time_min,notes\n2026-08-10,Long Point,3.2,450,95,Good weather with Milo\n2026-08-24,Endless Wall,2.4,380,75,Crowded weekend\n",
    'data_08.csv': "software,renewal_date,monthly_cost,annual_cost,status\nAdobe Creative Cloud,2026-12-15,54.99,659.88,Active\nFigma Professional,2026-11-01,12.00,144.00,Active\n",
  };
  
  Object.entries(csvNoise).forEach(([fn, content]) => {
    fs.writeFileSync(path.join(BASE, fn), content);
    console.log(`Created ${fn}`);
  });
  
  // Create PDF noise
  const createNoisePdf = (filename, title, lines) => {
    return new Promise((resolve) => {
      const doc = new PDFDocument({ size: 'letter', margin: 72 });
      const stream = fs.createWriteStream(path.join(BASE, filename));
      doc.pipe(stream);
      doc.font('Helvetica-Bold').fontSize(14).text(title);
      doc.moveDown(0.5);
      doc.font('Helvetica').fontSize(11);
      lines.forEach(l => doc.text(l));
      doc.end();
      stream.on('finish', () => { console.log(`Created ${filename}`); resolve(); });
    });
  };
  
  return Promise.all([
    createNoisePdf('file_02.pdf', "Piper's Birthday Ideas", [
      "1. Dinner at Tamarack (they liked it last time)",
      "2. Vinyl shopping on Neville Street",
      "3. Maybe a day trip to Fayetteville if weather holds",
      "4. New art supplies (they mentioned wanting gouache)",
      "5. Homemade card (obviously)",
      "", "Budget: keep it chill, nothing over $80 total",
      "Date: November 14, 2026",
    ]),
  ]);
}

// Create noise docx files
async function createNoiseDocx() {
  const docs = {
    'doc_01.docx': { title: 'Scope Proposal Template - Hill Design Co.', body: 'This template outlines the standard scope of work for branding engagements. Standard branding package includes: logo design (3 concepts, 2 revision rounds), brand guidelines document, business card design, and letterhead template.' },
    'doc_02.docx': { title: 'Nina Holiday Sale - Social Media Copy Draft', body: 'Thread and Thistle Holiday Collection. Post 1 (Instagram): "Handcrafted warmth for the season. New holiday collection arriving November 15. Botanical prints meet cozy textures. Link in bio."' },
    'doc_04.docx': { title: 'Design Award Submission - Hill Design Co. (2025)', body: 'AIGA West Virginia Chapter. Annual Design Excellence Award. Submission Category: Brand Identity. Project: Thread and Thistle Visual Identity System. Designer: Brandon Hill. Client: Nina Vasquez. Completion Date: May 2025.' },
    'doc_05.docx': { title: 'Coursera UX Module Notes', body: 'UX Design Fundamentals - Module 3: User Research. Key takeaways: Always start with user interviews, not assumptions. Affinity mapping helps organize qualitative data. Usability testing with 5 users finds about 85% of issues.' },
    'doc_06.docx': { title: 'Mountain Heritage Arts - Annual Report FY2024', body: 'Mountain Heritage Arts. Annual Report - Fiscal Year 2024. This is the PRIOR YEAR report. Program Highlights FY2024: Youth Outreach: 1,050 hours delivered. Community Workshops: 215 participants. Grants Distributed: $31,200. These are FY2024 figures and are not current.' },
    'doc_07.docx': { title: 'Hill Design Co. - General Rate Card', body: 'Hill Design Co. General Rate Card - 2026. Hourly Rate: $75/hr. Minimum Project Fee: $500. Standard Packages: Logo Design: $1,200 - $2,500. Brand Identity System: $2,500 - $5,000. Annual Report Layout: $1,500 - $3,000.' },
    'doc_08.docx': { title: 'Brewery Brand Identity - Pitch Deck Outline', body: 'New River Brewing Co. - Brand Identity Pitch. Call Date: October 19, 2026. Outline: 1. Introduction and portfolio highlights. 2. Understanding of the craft brewery market. 3. Proposed approach. 4. Timeline: 8-10 weeks from kickoff. 5. Budget range and terms.' },
    'doc_09.docx': { title: 'Thank You Note Template', body: 'Dear [Client Name], Thank you for the opportunity to work with [Company/Organization] on [Project Name]. It was a pleasure collaborating with your team. Please do not hesitate to reach out for future projects. Best, Brandon Hill, Hill Design Co.' },
    'doc_10.docx': { title: 'ACA Health Insurance Renewal Notes', body: 'Health Insurance - ACA Marketplace. Renewal Period: November 2026. Current Plan: Silver tier through CareSource. To do: Check if CareSource still covers Dr. Chen (therapy). Compare Silver vs Bronze options. Deadline: December 15 open enrollment.' },
    'doc_12.docx': { title: 'Brewery Engagement - Early Proposal Draft', body: 'Hill Design Co. Proposal: New River Brewing Co. DRAFT - Not yet shared with client. Scope: Full brand identity system including logo, label design, taproom signage, and digital presence. Timeline: 8-10 weeks from contract signing. Note: Pricing not yet determined.' },
  };
  
  for (const [fn, {title, body}] of Object.entries(docs)) {
    const doc = new Document({
      sections: [{
        children: [
          new Paragraph({ text: title, heading: HeadingLevel.HEADING_2 }),
          new Paragraph({ text: body }),
        ],
      }],
    });
    const buffer = await Packer.toBuffer(doc);
    fs.writeFileSync(path.join(BASE, fn), buffer);
    console.log(`Created ${fn}`);
  }
}

// Create noise images (simple colored rectangles with text via SVG -> sharp)
async function createNoiseImages() {
  const images = {
    'img_01.jpg': { label: 'Milo Trail Photo', bg: '#78A04E' },
    'img_02.jpg': { label: 'Workspace', bg: '#C8BEAA' },
    'img_03.jpg': { label: 'Dribbble Reference', bg: '#5078B4' },
    'img_05.jpg': { label: 'Brochure Proof', bg: '#DCD2BE' },
    'img_06.jpg': { label: 'Paint Swatches', bg: '#B48C64' },
    'img_07.jpg': { label: 'Font Comparison', bg: '#F0F0F0' },
    'img_08.jpg': { label: 'Boutique Storefront', bg: '#A0B48C' },
    'img_09.jpg': { label: 'Vinyl Records', bg: '#64503C' },
    'img_10.jpg': { label: 'Mood Board', bg: '#C8B4A0' },
    'img_11.jpg': { label: 'Q3 Brochure', bg: '#D2C8B9' },
    'img_12.jpg': { label: 'MHA Building', bg: '#8CA078' },
  };
  
  try {
    const sharp = require('sharp');
    for (const [fn, {label, bg}] of Object.entries(images)) {
      const svg = `<svg width="640" height="480" xmlns="http://www.w3.org/2000/svg">
        <rect width="640" height="480" fill="${bg}"/>
        <text x="320" y="240" font-family="Arial" font-size="20" fill="white" text-anchor="middle" opacity="0.3">${label}</text>
      </svg>`;
      await sharp(Buffer.from(svg)).jpeg({ quality: 75 }).toFile(path.join(BASE, fn));
      console.log(`Created ${fn}`);
    }
  } catch (e) {
    // Fallback: create 1x1 pixel JPEGs as placeholders
    console.log('Sharp not available for images, creating minimal placeholders');
    for (const fn of Object.keys(images)) {
      // Minimal JPEG file (1x1 pixel)
      const buf = Buffer.from('/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////2wBDAf//////////////////////////////////////////////////////////////////////////////////////wAARCAABAAEDASIAAhEBAxEB/8QAFAABAAAAAAAAAAAAAAAAAAAACf/EABQQAQAAAAAAAAAAAAAAAAAAAAD/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AKwA//9k=', 'base64');
      fs.writeFileSync(path.join(BASE, fn), buf);
      console.log(`Created ${fn} (placeholder)`);
    }
  }
}

// ============================================================
// MAIN
// ============================================================
async function main() {
  console.log('=== Creating Signal Files ===');
  await createDoc03();
  await createData02();
  await createFile07();
  await createImg04();
  createFile09();
  await createDoc11();
  await createFile06();
  
  console.log('\n=== Creating Noise Files ===');
  createNoiseFiles();
  await createNoiseDocx();
  await createNoiseImages();
  
  // Count files
  const files = fs.readdirSync(BASE).filter(f => fs.statSync(path.join(BASE, f)).isFile());
  console.log(`\n=== TOTAL FILES CREATED: ${files.length} ===`);
  
  // Save value registry
  fs.writeFileSync(path.join(BASE, '..', 'value_registry.json'), JSON.stringify(V, null, 2));
  console.log('Saved value_registry.json');
}

main().catch(console.error);
