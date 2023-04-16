import { google } from 'googleapis';
import * as fs from 'fs';
import * as readline from 'readline';
import * as path from 'path';

const SCOPES = ['https://www.googleapis.com/auth/gmail.send'];
const TOKEN_PATH = 'token.json';

const credentialsPath = path.resolve(
    __dirname,
    '..',
    'json',
    'client_secret_882418923951-hr9l43ga64qmvjgbh44ce0i2pijjchoa.apps.googleusercontent.com.json',
    );
    fs.readFile(credentialsPath, (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    authorize(JSON.parse(content.toString()), getAccessToken);
});

function authorize(credentials: any, callback: (client: any) => void) {
    const { client_secret, client_id, redirect_uris } = credentials.web;
    const oauth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

    fs.readFile(TOKEN_PATH, (err, token) => {
        if (err) return callback(oauth2Client);
        oauth2Client.setCredentials(JSON.parse(token.toString()));
        callback(oauth2Client);
    });
}

function getAccessToken(oauth2Client: any) {
    const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
        rl.close();
        oauth2Client.getToken(code, (err: any, token: any) => {
        if (err) return console.error('Error retrieving access token', err);
        oauth2Client.setCredentials(token);
        fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
            if (err) console.error(err);
            console.log('Token stored to', TOKEN_PATH);
        });
        });
    });
}
