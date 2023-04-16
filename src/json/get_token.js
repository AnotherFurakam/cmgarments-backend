"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var googleapis_1 = require("googleapis");
var fs = require("fs");
var readline = require("readline");
var path = require("path");
var SCOPES = ['https://www.googleapis.com/auth/gmail.send'];
var TOKEN_PATH = 'token.json';
var credentialsPath = path.resolve(__dirname, '..', 'json', 'client_secret_882418923951-hr9l43ga64qmvjgbh44ce0i2pijjchoa.apps.googleusercontent.com.json');
fs.readFile(credentialsPath, function (err, content) {
    if (err)
        return console.log('Error loading client secret file:', err);
    authorize(JSON.parse(content.toString()), getAccessToken);
});
function authorize(credentials, callback) {
    var _a = credentials.web, client_secret = _a.client_secret, client_id = _a.client_id, redirect_uris = _a.redirect_uris;
    var oauth2Client = new googleapis_1.google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
    fs.readFile(TOKEN_PATH, function (err, token) {
        if (err)
            return callback(oauth2Client);
        oauth2Client.setCredentials(JSON.parse(token.toString()));
        callback(oauth2Client);
    });
}
function getAccessToken(oauth2Client) {
    var authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', function (code) {
        rl.close();
        oauth2Client.getToken(code, function (err, token) {
            if (err)
                return console.error('Error retrieving access token', err);
            oauth2Client.setCredentials(token);
            fs.writeFile(TOKEN_PATH, JSON.stringify(token), function (err) {
                if (err)
                    console.error(err);
                console.log('Token stored to', TOKEN_PATH);
            });
        });
    });
}
