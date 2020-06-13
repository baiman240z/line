const Config = require('./config');
const {LineClient} = require('messaging-api-line');
const url = require('url');
const https = require('https');

module.exports = class Line {
    client;
    accessToken;
    channelSecret;

    constructor(channel) {
        const config = Config.all('channels');
        this.accessToken = config[channel]['token'];
        this.channelSecret = config[channel]['secret'];
        this.client = LineClient.connect({
            accessToken: config[channel]['token'],
            channelSecret: config[channel]['secret']
        });
    }

    promise(options, body) {
        return new Promise((resolve, reject) => {
            const request = https.request(options, (response) => {
                response.setEncoding('utf8');
                let responseBody = '';
                response.on('data', (chunk) => {
                    responseBody += chunk;
                });
                response.on('end', () => {
                    resolve(JSON.parse(responseBody));
                });
            }).on('error', (e) => {
                reject(e);
            });
            if (body !== undefined) {
                request.write(body);
            }
            request.end();
        });
    }

    callGet(urlStr) {
        let options = url.parse(urlStr);
        options.method = 'GET';
        options.headers = {
            'Authorization': `Bearer ${this.accessToken}`
        }
        return this.promise(options);
    }

    callPost(urlStr, params, method) {
        let options = url.parse(urlStr);
        options.method = method === undefined ? 'POST' : method;
        options.headers = {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
        }
        const body = JSON.stringify(params);
        return this.promise(options, body);
    }

    callPut(urlStr, params) {
        return this.callPost(urlStr, params, 'PUT');
    }

    callDelete(urlStr) {
        let options = url.parse(urlStr);
        options.method = 'DELETE';
        options.headers = {
            'Authorization': `Bearer ${this.accessToken}`
        }
        return this.promise(options);
    }
}

