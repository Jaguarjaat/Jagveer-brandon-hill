const fs = require('fs');
const path = require('path');

const WORKSPACE = "c:\\Users\\Jagveer Singh\\Downloads\\all details\\brandon-hill";
const MOCK_DATA_DIR = path.join(WORKSPACE, "mock_data");

if (!fs.existsSync(MOCK_DATA_DIR)) {
    fs.mkdirSync(MOCK_DATA_DIR, { recursive: true });
}

// Load ground truth values
const values = JSON.parse(fs.readFileSync(path.join(WORKSPACE, "value_registry.json"), "utf8"));

function getDir(slug) {
    const dirPath = path.join(MOCK_DATA_DIR, slug);
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
    return dirPath;
}

function writeCsv(filePath, headers, rows) {
    // Helper to escape CSV values
    const formatValue = (val) => {
        if (val === null || val === undefined) return '';
        let str = String(val);
        if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
            str = str.replace(/"/g, '""');
            return `"${str}"`;
        }
        return str;
    };

    const headerLine = headers.map(formatValue).join(',');
    const bodyLines = rows.map(row => row.map(formatValue).join(','));
    const content = [headerLine, ...bodyLines, ''].join('\n');
    fs.writeFileSync(filePath, content, 'utf8');
}

// -------------------------------------------------------------
// 1. QUICKBOOKS-API
// -------------------------------------------------------------
const qbDir = getDir("quickbooks-api");

// Customers CSV
const customersHeaders = [
    "Id", "DisplayName", "GivenName", "FamilyName", "CompanyName", 
    "PrimaryEmailAddr", "PrimaryPhone", "BillAddr_Line1", "BillAddr_City", 
    "BillAddr_CountrySubDivisionCode", "BillAddr_PostalCode", "Balance", 
    "Active", "Job", "Notes"
];

const customersRows = [
    ["100", "Mountain Heritage Arts", "Dina", "Wu", "Mountain Heritage Arts", 
     "dwu@mountainheritagearts.org", "(304) 555-0190", "104 Kanawha St", "Charleston", 
     "WV", "25301", "0.00", "true", "false", "Mountain Heritage Arts client. Contact: Dina Wu."],
    ["101", "Patrick Hale", "Patrick", "Hale", "Beckley Realty Group", 
     "phale@beckleyrealty.com", "(304) 555-0122", "200 Neville St", "Beckley", 
     "WV", "25801", "1500.00", "true", "false", "Real estate listings brochure work."],
    ["102", "Mountain Heritage Art", "Dina", "Wu", "Mountain Heritage Art", 
     "dwu@mountainheritagearts.org", "(304) 555-0190", "104 Kanawha St", "Charleston", 
     "WV", "25301", "0.00", "false", "false", "Duplicate profile created in error. Mark inactive."],
    ["103", "Nina Vasquez", "Nina", "Vasquez", "Thread and Thistle", 
     "nina@threadandthistle.com", "(304) 555-0143", "45 Commerce St", "Beckley", 
     "WV", "25801", "0.00", "true", "false", "Boutique branding and rebrand project."],
    ["104", "Green Valley Brewery", "Sam", "Green", "Green Valley Brewery", 
     "sam@greenvalleybrew.com", "(304) 555-0155", "12 Oak Rd", "Fayetteville", 
     "WV", "25840", "0.00", "true", "false", "Onboarding call scheduled for Oct 19."],
    ["105", "Piper Navarro", "Piper", "Navarro", "Piper Studio", 
     "piper.navarro@gmail.com", "", "12 Main St", "Beckley", 
     "WV", "25801", "0.00", "true", "false", "Personal design sync."],
    ["106", "Dave Compton", "Dave", "Compton", "Compton Properties", 
     "dcompton@beckleyproperties.com", "", "100 Rental Pl", "Beckley", 
     "WV", "25801", "0.00", "true", "false", "Apartment leasing landlord."],
    ["107", "FastPrint Beckley", "", "", "FastPrint Beckley", 
     "print@fastprintbeckley.com", "", "50 Neville St", "Beckley", 
     "WV", "25801", "0.00", "true", "false", "Preferred printing house."],
    ["108", "Beckley YMCA", "", "", "Beckley YMCA", 
     "info@beckleyymca.org", "", "120 Woodlawn Ave", "Beckley", 
     "WV", "25801", "0.00", "true", "false", "YMCA membership and yoga classes."],
    ["109", "Fayetteville Tourism", "Jane", "Miller", "Fayetteville Tourism Board", 
     "visit@fayettevillewv.gov", "", "310 Court St", "Fayetteville", 
     "WV", "25840", "0.00", "true", "false", "Local guide layout services."]
];

writeCsv(path.join(qbDir, "customers.csv"), customersHeaders, customersRows);

// Accounts CSV
const accountsHeaders = [
    "Id", "Name", "AccountType", "AccountSubType", "CurrentBalance", 
    "Active", "Classification", "Description"
];
const accountsRows = [
    ["1", "Checking Account", "Bank", "Checking", "14250.00", "true", "Asset", "Business checking account"],
    ["2", "Accounts Receivable", "Accounts Receivable", "AccountsReceivable", "4300.00", "true", "Asset", "Outstanding customer balances"],
    ["3", "Design Services Revenue", "Income", "SalesOfProductIncome", "24500.00", "true", "Revenue", "Revenue from creative design projects"],
    ["4", "Studio Rent", "Expense", "RentOrLeaseOfEquipment", "8750.00", "true", "Expense", "Monthly studio rent"],
    ["5", "Software Subscriptions", "Expense", "OtherBusinessExpenses", "1200.00", "true", "Expense", "Adobe, Figma, Canva tools"],
    ["6", "Office Supplies", "Expense", "SuppliesMaterials", "450.00", "true", "Expense", "Paper, print ink, sketchbooks"],
    ["7", "Travel and Meals", "Expense", "Travel", "850.00", "true", "Expense", "Client meetings and local travel"]
];
writeCsv(path.join(qbDir, "accounts.csv"), accountsHeaders, accountsRows);

// Invoices JSON
const invoicesJson = [
    {
        "Id": "8001",
        "DocNumber": "INV-HDC-2026-Q1",
        "TxnDate": "2026-04-03",
        "DueDate": "2026-05-03",
        "CustomerRef": {
            "value": "100",
            "name": "Mountain Heritage Arts"
        },
        "Line": [
            {
                "Amount": Number(values["INVOICE_1_AMOUNT"]),
                "Description": "Graphic design services - Q1 FY2026",
                "SalesItemLineDetail": {
                    "ItemRef": {
                        "name": "Design Services"
                    }
                }
            }
        ],
        "TotalAmt": Number(values["INVOICE_1_AMOUNT"]),
        "Balance": 0.0,
        "Status": "Paid"
    },
    {
        "Id": "8002",
        "DocNumber": "INV-HDC-2026-Q2",
        "TxnDate": "2026-07-03",
        "DueDate": "2026-08-03",
        "CustomerRef": {
            "value": "100",
            "name": "Mountain Heritage Arts"
        },
        "Line": [
            {
                "Amount": Number(values["INVOICE_2_AMOUNT"]),
                "Description": "Graphic design services - Q2 FY2026",
                "SalesItemLineDetail": {
                    "ItemRef": {
                        "name": "Design Services"
                    }
                }
            }
        ],
        "TotalAmt": Number(values["INVOICE_2_AMOUNT"]),
        "Balance": 0.0,
        "Status": "Paid"
    },
    {
        "Id": "8003",
        "DocNumber": "INV-HDC-2026-Q3",
        "TxnDate": "2026-10-02",
        "DueDate": "2026-11-02",
        "CustomerRef": {
            "value": "100",
            "name": "Mountain Heritage Arts"
        },
        "Line": [
            {
                "Amount": Number(values["INVOICE_3_AMOUNT"]),
                "Description": "Graphic design services - Q3 FY2026 (Annual Report layout)",
                "SalesItemLineDetail": {
                    "ItemRef": {
                        "name": "Design Services"
                    }
                }
            }
        ],
        "TotalAmt": Number(values["INVOICE_3_AMOUNT"]),
        "Balance": Number(values["INVOICE_3_AMOUNT"]),
        "Status": "Open",
        "PrivateNote": "Q3 billing. Reflects actual hours including annual report draft work."
    },
    {
        "Id": "8004",
        "DocNumber": "INV-HDC-2026-PH1",
        "TxnDate": "2026-09-15",
        "DueDate": "2026-10-15",
        "CustomerRef": {
            "value": "101",
            "name": "Patrick Hale"
        },
        "Line": [
            {
                "Amount": 1500.0,
                "Description": "Listing brochure layouts and listing flyer templates",
                "SalesItemLineDetail": {
                    "ItemRef": {
                        "name": "Design Services"
                    }
                }
            }
        ],
        "TotalAmt": 1500.0,
        "Balance": 1500.0,
        "Status": "Open"
    },
    {
        "Id": "8005",
        "DocNumber": "INV-HDC-2026-Q1-VOID",
        "TxnDate": "2026-04-03",
        "DueDate": "2026-05-03",
        "CustomerRef": {
            "value": "102",
            "name": "Mountain Heritage Art"
        },
        "Line": [
            {
                "Amount": Number(values["INVOICE_1_AMOUNT"]),
                "Description": "Graphic design services - Q1 FY2026 (voided duplicate)",
                "SalesItemLineDetail": {
                    "ItemRef": {
                        "name": "Design Services"
                    }
                }
            }
        ],
        "TotalAmt": Number(values["INVOICE_1_AMOUNT"]),
        "Balance": 0.0,
        "Status": "Voided",
        "PrivateNote": "Voided. Duplicate entry under wrong client account name."
    }
];

const fillerClients = [
    ["103", "Nina Vasquez"],
    ["104", "Green Valley Brewery"],
    ["109", "Fayetteville Tourism"]
];

for (let i = 0; i < 15; i++) {
    const [clientVal, clientName] = fillerClients[i % fillerClients.length];
    const invId = String(8010 + i);
    const amounts = [150.0, 300.0, 450.0, 600.0, 800.0];
    const amt = amounts[i % amounts.length];
    invoicesJson.push({
        "Id": invId,
        "DocNumber": `INV-HDC-2026-${100+i}`,
        "TxnDate": `2026-0${(i % 9) + 1}-${10 + (i % 18)}`,
        "DueDate": "2026-10-30",
        "CustomerRef": {
            "value": clientVal,
            "name": clientName
        },
        "Line": [
            {
                "Amount": amt,
                "Description": `Design work - Item ${i+1}`,
                "SalesItemLineDetail": {
                    "ItemRef": {
                        "name": "Design Services"
                    }
                }
            }
        ],
        "TotalAmt": amt,
        "Balance": i % 3 === 0 ? amt : 0.0,
        "Status": i % 3 === 0 ? "Open" : "Paid"
    });
}

fs.writeFileSync(path.join(qbDir, "invoices.json"), JSON.stringify(invoicesJson, null, 2), "utf8");

// -------------------------------------------------------------
// 2. GMAIL-API
// -------------------------------------------------------------
const gmailDir = getDir("gmail-api");

// Profile
const profileJson = {
    "emailAddress": "brandon.hill@voissync.ai",
    "messagesTotal": 24,
    "threadsTotal": 19,
    "historyId": "129845"
};
fs.writeFileSync(path.join(gmailDir, "profile.json"), JSON.stringify(profileJson, null, 2), "utf8");

// Drafts CSV
const draftsHeaders = ["id", "thread_id", "to_addr", "cc_addr", "subject", "body", "updated_at"];
const draftsRows = [
    ["draft-001", "thr-unrelated-1", "nina@threadandthistle.com", "", "Re: Social Media Layouts", 
     "Hi Nina,\n\nHere are the updated holiday layouts. Let me know what you think.\n\nBrandon", "2026-10-03T11:00:00Z"],
    ["draft-002", "thr-unrelated-2", "piper.navarro@gmail.com", "", "Weekend dinner", 
     "Hey Piper,\n\nLooking forward to Tamarack this Friday! Let's do vinyl shopping after.\n\nBrandon", "2026-10-06T19:00:00Z"]
];
writeCsv(path.join(gmailDir, "drafts.csv"), draftsHeaders, draftsRows);

// Messages CSV
const messagesHeaders = [
    "id", "thread_id", "from_addr", "to_addr", "cc_addr", "subject", 
    "snippet", "body", "date", "internal_date", "size_estimate", "labels", 
    "is_unread", "is_starred"
];

const messagesRows = [
    [
        "msg-mha-001", "thr-mha-001", "dwu@mountainheritagearts.org", "brandon.hill@voissync.ai", "", 
        "Re: Annual Report Draft - Final Pieces", 
        "Thursday still works for the deadline. I will need the draft by end of day...",
        `Brandon,\n\nThursday still works for the deadline. I will need the draft by end of day so the board can review over the weekend.\n\nOne more thing - the board approved adding a "${values['NEW_PROGRAM_ADDITION']}" line item to the report. It launched in September so we do not have big numbers yet but they want it in the highlights section. Just a brief mention with the note that metrics will be reported in the Q1 FY2027 update.\n\nLet me know if you need anything else from me before then.\n\nDina`,
        "2026-10-06T14:30:00Z", "1791297000000", "550", "INBOX", "false", "true"
    ],
    [
        "msg-mha-002", "thr-mha-001", "brandon.hill@voissync.ai", "dwu@mountainheritagearts.org", "", 
        "Re: Annual Report Draft - Final Pieces",
        "Got the files. Working on layout this week. Will have something by Thursday.",
        "Got the files. Working on layout this week. Will have something by Thursday.",
        "2026-09-30T10:15:00Z", "1790763300000", "120", "SENT", "false", "false"
    ],
    [
        "msg-mha-003", "thr-mha-001", "dwu@mountainheritagearts.org", "brandon.hill@voissync.ai", "", 
        "Annual Report Draft - Final Pieces",
        `Starting to pull together materials for the FY2026 annual report. Preliminary budget shows design services at around $${values['STALE_BUDGET_FIGURE'].toLocaleString('en-US', {minimumFractionDigits: 2})}...`,
        `Hi Brandon,\n\nStarting to pull together materials for the FY2026 annual report. Preliminary budget shows your design services at around $${values['STALE_BUDGET_FIGURE'].toLocaleString('en-US', {minimumFractionDigits: 2})} invoiced so far, but I know there might be more coming. Just wanted to give you a heads up on the timeline - we are targeting early October for the draft.\n\nI will get you the program stats and board figures as soon as they are finalized.\n\nThanks,\nDina`,
        "2026-08-12T09:00:00Z", "1786525200000", "450", "INBOX", "false", "false"
    ],
    [
        "msg-hale-001", "thr-hale-001", "phale@beckleyrealty.com", "brandon.hill@voissync.ai", "", 
        "Quick question on your rates",
        "Hi Brandon, I know you do design work for Mountain Heritage Arts. Can you share what you're charging the nonprofit?...",
        "Hi Brandon,\n\nI know you do design work for Mountain Heritage Arts. Can you share what you're charging the nonprofit? I want to make sure I'm getting a fair rate for my brochure projects. Just want to compare rates before we start the Q4 flyer template project.\n\nThanks,\nPatrick",
        "2026-10-07T10:00:00Z", "1791367200000", "300", "INBOX", "true", "false"
    ]
];

const fillers = [
    ["nina@threadandthistle.com", "Holiday packaging visual concepts", "Hi Brandon, just wanted to check on the holiday visual layout concepts. Are we still on track for next Tuesday?", "2026-10-04T09:00:00Z", "1791104400000", "INBOX"],
    ["sam@greenvalleybrew.com", "Logo pitch meeting Oct 19", "Hey Brandon, looking forward to our call on the 19th. We want to do a full redesign of our flagship IPA labels.", "2026-10-05T11:00:00Z", "1791198000000", "INBOX"],
    ["dcompton@beckleyproperties.com", "Water heater check", "Hi Brandon, the plumber will be over on Thursday at 2pm to check the water heater. Let me know if that works.", "2026-10-06T08:00:00Z", "1791273600000", "INBOX"],
    ["careers-spam@example-recruit.com", "Design opportunities in WV", "We saw your graphics portfolio and have multiple remote contract positions available. Reply if interested.", "2026-10-01T15:00:00Z", "1790866800000", "SPAM"],
    ["newsletter@designweekly.co", "Design Weekly Issue #42", "Trends in corporate report layouts, dark mode typography tips, and upcoming design systems releases.", "2026-10-05T06:00:00Z", "1791180000000", "INBOX"]
];

for (let i = 0; i < 18; i++) {
    const [fromAddr, subj, body, dateStr, intDate, label] = fillers[i % fillers.length];
    messagesRows.push([
        `msg-fill-${String(i).padStart(3, '0')}`,
        `thr-fill-${String(i).padStart(3, '0')}`,
        fromAddr,
        "brandon.hill@voissync.ai",
        "",
        subj,
        body.slice(0, 50) + "...",
        body,
        dateStr,
        intDate,
        String(body.length + 100),
        label,
        "false",
        "false"
    ]);
}

writeCsv(path.join(gmailDir, "messages.csv"), messagesHeaders, messagesRows);


// -------------------------------------------------------------
// 3. GOOGLE-DRIVE-API
// -------------------------------------------------------------
const driveDir = getDir("google-drive-api");

const driveHeaders = [
    "id", "name", "mime_type", "parent_id", "size", "created_time", 
    "modified_time", "owner_email", "starred", "trashed", "web_view_link"
];

const driveRows = [
    ["folder-root", "My Drive", "application/vnd.google-apps.folder", "", "0", 
     "2024-01-01T00:00:00Z", "2024-01-01T00:00:00Z", "brandon.hill@voissync.ai", "false", "false", ""],
    ["folder-mha", "MHA Annual Report 2026", "application/vnd.google-apps.folder", "folder-root", "0", 
     "2026-08-15T10:00:00Z", "2026-10-05T14:30:00Z", "brandon.hill@voissync.ai", "true", "false", "https://drive.google.com/drive/folders/folder-mha"],
    ["file-mha-report", "doc_03.docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "folder-mha", "9444", 
     "2026-08-16T11:00:00Z", "2026-10-05T14:30:00Z", "brandon.hill@voissync.ai", "false", "false", "https://docs.google.com/document/d/file-mha-report"],
    ["file-mha-finance", "data_02.xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "folder-mha", "8438", 
     "2026-08-20T09:00:00Z", "2026-09-28T15:00:00Z", "brandon.hill@voissync.ai", "false", "false", "https://docs.google.com/spreadsheets/d/file-mha-finance"],
    ["folder-nina", "Nina's Boutique Rebrand", "application/vnd.google-apps.folder", "folder-root", "0", 
     "2025-03-01T10:00:00Z", "2025-05-15T16:00:00Z", "brandon.hill@voissync.ai", "false", "false", ""],
    ["folder-patrick", "Beckley Realty Group", "application/vnd.google-apps.folder", "folder-root", "0", 
     "2026-07-01T11:00:00Z", "2026-09-15T10:00:00Z", "brandon.hill@voissync.ai", "false", "false", ""]
];

for (let i = 1; i <= 15; i++) {
    driveRows.push([
        `file-fill-${String(i).padStart(3, '0')}`,
        `design_draft_${i}.png`,
        "image/png",
        i % 2 === 0 ? "folder-nina" : "folder-patrick",
        "102400",
        "2026-03-01T10:00:00Z",
        "2026-09-01T10:00:00Z",
        "brandon.hill@voissync.ai",
        "false",
        "false",
        ""
    ]);
}

writeCsv(path.join(driveDir, "files.csv"), driveHeaders, driveRows);


// -------------------------------------------------------------
// 4. GOOGLE-CALENDAR-API (DISTRACTOR)
// -------------------------------------------------------------
const calDir = getDir("google-calendar-api");

const calHeaders = [
    "id", "calendar_id", "summary", "description", "location", "start", 
    "end", "all_day", "status", "creator", "organizer", "recurrence", "visibility"
];

const calRows = [
    ["evt-001", "brandon.hill@voissync.ai", "MHA Annual Report Draft Due", "Send final draft report layout to Dina Wu via email", 
     "", "2026-10-09T17:00:00-04:00", "2026-10-09T18:00:00-04:00", "false", "confirmed", 
     "brandon.hill@voissync.ai", "brandon.hill@voissync.ai", "", "default"],
    ["evt-002", "brandon.hill@voissync.ai", "Therapy appointment", "Weekly sync with Dr. Marcus Chen", 
     "Telehealth", "2026-10-08T16:30:00-04:00", "2026-10-08T17:30:00-04:00", "false", "confirmed", 
     "brandon.hill@voissync.ai", "brandon.hill@voissync.ai", "RRULE:FREQ=WEEKLY;BYDAY=TH", "private"],
    ["evt-003", "brandon.hill@voissync.ai", "Brewery Branding Kickoff Call", "New River Brewing Co. - sam@greenvalleybrew.com", 
     "Zoom", "2026-10-19T10:00:00-04:00", "2026-10-19T11:00:00-04:00", "false", "confirmed", 
     "sam@greenvalleybrew.com", "sam@greenvalleybrew.com", "", "default"],
    ["evt-004", "brandon.hill@voissync.ai", "Coffee with Nina", "Holiday campaign prep notes", 
     "Tamarack Cafe", "2026-10-03T10:00:00-04:00", "2026-10-03T11:30:00-04:00", "false", "confirmed", 
     "brandon.hill@voissync.ai", "brandon.hill@voissync.ai", "", "default"],
    ["evt-005", "brandon.hill@voissync.ai", "Yoga Flow", "Morning session at Beckley YMCA", 
     "YMCA", "2026-10-01T07:00:00-04:00", "2026-10-01T08:00:00-04:00", "false", "confirmed", 
     "brandon.hill@voissync.ai", "brandon.hill@voissync.ai", "RRULE:FREQ=WEEKLY;BYDAY=TU,TH", "default"]
];

for (let i = 0; i < 5; i++) {
    calRows.push([
        `evt-fill-${i}`,
        "brandon.hill@voissync.ai",
        `Generic personal event ${i+1}`,
        "Focus block or design work",
        "",
        `2026-10-1${i}T13:00:00-04:00`,
        `2026-10-1${i}T14:30:00-04:00`,
        "false",
        "confirmed",
        "brandon.hill@voissync.ai",
        "brandon.hill@voissync.ai",
        "",
        "default"
    ]);
}

writeCsv(path.join(calDir, "events.csv"), calHeaders, calRows);


// -------------------------------------------------------------
// 5. XERO-API (DISTRACTOR)
// -------------------------------------------------------------
const xeroDir = getDir("xero-api");

const xeroHeaders = [
    "invoice_id", "invoice_number", "type", "contact_id", "contact_name", 
    "date", "due_date", "status", "line_amount_types", "sub_total", 
    "total_tax", "total", "amount_due", "amount_paid", "currency_code", "reference"
];

const xeroRows = [
    ["i0000001", "INV-1001", "ACCREC", "c000001", "Vandelay Industries", "2026-09-01", "2026-09-15", "PAID", "Exclusive", "5000.00", "0.00", "5000.00", "0.00", "5000.00", "USD", "Consulting retainer"],
    ["i0000002", "INV-1002", "ACCREC", "c000002", "Initech LLC", "2026-09-05", "2026-10-05", "AUTHORISED", "Exclusive", "2400.00", "0.00", "2400.00", "2400.00", "0.00", "USD", "Creative hours"],
    ["i0000003", "INV-1003", "ACCREC", "c000003", "Globex Corporation", "2026-09-10", "2026-10-10", "AUTHORISED", "Exclusive", "8500.00", "0.00", "8500.00", "8500.00", "0.00", "USD", "Annual design support"],
    ["i0000004", "BILL-2001", "ACCPAY", "c000004", "Acme Paper Supplies", "2026-09-12", "2026-09-27", "PAID", "Exclusive", "350.00", "0.00", "350.00", "0.00", "350.00", "USD", "Paper stock"],
    ["i0000005", "BILL-2002", "ACCPAY", "c000005", "Wonka Cocoa", "2026-09-18", "2026-10-18", "AUTHORISED", "Exclusive", "1100.00", "0.00", "1100.00", "1100.00", "0.00", "USD", "Event materials"],
    ["i0000006", "INV-1004", "ACCREC", "c000001", "Vandelay Industries", "2026-09-20", "2026-10-20", "AUTHORISED", "Exclusive", "750.00", "0.00", "750.00", "750.00", "0.00", "USD", "Add-on design work"]
];

writeCsv(path.join(xeroDir, "invoices.csv"), xeroHeaders, xeroRows);


// -------------------------------------------------------------
// 6. BOX-API (DISTRACTOR)
// -------------------------------------------------------------
const boxDir = getDir("box-api");

const boxHeaders = [
    "id", "name", "parent_id", "owner_id", "description", "size", "extension", "sha1", "created_at", "modified_at"
];

const boxRows = [
    ["500001", "old-brand-guidelines.pdf", "160001", "11446498", "Brand guidelines v1", "1500000", "pdf", "sha1-01", "2025-03-01T10:00:00-05:00", "2025-03-01T10:00:00-05:00"],
    ["500002", "icons-library.zip", "160001", "22893011", "Creative commons icons library", "3120000", "zip", "sha1-02", "2025-05-12T14:00:00-05:00", "2025-05-12T14:00:00-05:00"],
    ["500003", "billing_setup.docx", "160002", "11446498", "Old bank details setup instruction", "45000", "docx", "sha1-03", "2026-01-15T09:00:00-05:00", "2026-01-15T09:00:00-05:00"],
    ["500004", "backup-invoice-2025.xlsx", "160003", "22893011", "Previous year invoice backups", "85000", "xlsx", "sha1-04", "2026-01-05T10:00:00-05:00", "2026-01-05T10:00:00-05:00"]
];

writeCsv(path.join(boxDir, "files.csv"), boxHeaders, boxRows);


// -------------------------------------------------------------
// 7. ASANA-API (DISTRACTOR)
// -------------------------------------------------------------
const asanaDir = getDir("asana-api");

const asanaHeaders = [
    "gid", "name", "project_gid", "section_gid", "assignee_gid", "completed", "due_on", "notes", "created_at", "modified_at"
];

const asanaRows = [
    ["1205000000004001", "Audit studio print materials", "1203000000002001", "1204000000003001", "1202000000001001", "true", "2026-09-01", "Review all brochures on shelves", "2026-08-10T10:00:00.000Z", "2026-09-01T16:00:00.000Z"],
    ["1205000000004002", "Purchase premium design assets", "1203000000002001", "1204000000003001", "1202000000001001", "false", "2026-10-15", "Need new fonts and mockups", "2026-09-10T11:00:00.000Z", "2026-09-10T11:00:00.000Z"],
    ["1205000000004003", "Update website portfolio links", "1203000000002001", "1204000000003002", "1202000000001001", "false", "2026-10-20", "Add Thread and Thistle photos", "2026-09-15T12:00:00.000Z", "2026-09-15T12:00:00.000Z"]
];

writeCsv(path.join(asanaDir, "tasks.csv"), asanaHeaders, asanaRows);


// -------------------------------------------------------------
// 8. SLACK-API (DISTRACTOR)
// -------------------------------------------------------------
const slackDir = getDir("slack-api");

const slackHeaders = [
    "ts", "channel_id", "user_id", "text", "thread_ts", "reply_count", "reactions"
];

const slackRows = [
    ["1791210000.000100", "C01DESIGN", "U01BRANDON", "Hey Nina, layout is coming along nicely.", "", "1", ""],
    ["1791210100.000200", "C01DESIGN", "U01NINA", "Awesome, looking forward to seeing it!", "1791210000.000100", "0", ""],
    ["1791220500.000300", "C01GENERAL", "U01BRANDON", "Anyone planning to hike the Endless Wall trail this weekend?", "", "0", "+1:U01PIPER"],
    ["1791221000.000400", "C01GENERAL", "U01PIPER", "Might go on Sunday morning if it doesn't rain.", "1791220500.000300", "0", ""]
];

writeCsv(path.join(slackDir, "messages.csv"), slackHeaders, slackRows);

console.log("Mock data generated successfully via Node.js script.");
