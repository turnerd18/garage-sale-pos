const functions = require("firebase-functions");
const appendRow = require('./appendRow')

module.exports = {
    appendRow: functions.https.onRequest(appendRow.handler),
};