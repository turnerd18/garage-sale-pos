const { google } = require('googleapis');
const crypto = require('crypto');


exports.handler = async (req, res) => {
  const jwt = getJwt();
  const apiKey = process.env.GOOGLE_API_KEY;
  const spreadsheetId = process.env.SPREADSHEET_ID;
  const range = 'Transactions!A1:D';
  const transactionId = crypto.randomUUID()
  const transactionDate = new Date()
  const rows = req.body.items.map(item =>
    [transactionId, transactionDate, item.bucket, item.amount]
  )
  await appendSheetRow(jwt, apiKey, spreadsheetId, range, rows);
  res.status(200).type('text/plain').end('OK');
};

function getJwt() {
  const email = process.env.SERVICE_ACCOUNT_EMAIL
  const privateKey = process.env.SERIVCE_ACCOUNT_PRIVATE_KEY
  return new google.auth.JWT(
    email, null, privateKey,
    ['https://www.googleapis.com/auth/spreadsheets']
  );
}

async function appendSheetRow(jwt, apiKey, spreadsheetId, range, rows) {
  // Sheets API Node.JS documentation https://googleapis.dev/nodejs/googleapis/latest/sheets/classes/Resource$Spreadsheets$Values.html#append

  const sheets = google.sheets({ version: 'v4' });
  const valuesResponse = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
    auth: jwt,
    key: apiKey,
  })
  const rowCount = valuesResponse.data.values.length
  console.log(`${rowCount} rows`)

  const updateResult = await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `Transactions!A${rowCount + 1}`,
    auth: jwt,
    key: apiKey,
    valueInputOption: 'RAW',
    resource: { values: rows }
  })
  console.log('Updated sheet: ' + updateResult.data.updates.updatedRange);
}


// curl --location --request POST 'http://localhost:5001/<app-name>/<region>/appendRow' \
// --header 'Content-Type: application/json' \
// --header 'X-MyHeader: 123' \
// --data-raw '{
//     "items": [
//         {
//             "bucket": "Clothes",
//             "amount": 2.25
//         },
//         {
//             "bucket": "Clothes",
//             "amount": 3
//         }
//     ]
// }'
