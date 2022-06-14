const { google } = require('googleapis');
const crypto = require('crypto');


exports.handler = async (req, res) => {
    var jwt = getJwt();
    var apiKey = process.env.GOOGLE_API_KEY;
    var spreadsheetId = process.env.SPREADSHEET_ID;
    var range = 'Transactions!A1:D';
    const transactionId = crypto.randomUUID()
    const transactionDate = new Date()
    var rows = req.body.items.map(item => 
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

function getApiKey() {
    return process.env.GOOGLE_API_KEY
}

async function appendSheetRow(jwt, apiKey, spreadsheetId, range, rows) {
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
