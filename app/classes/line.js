const Config = require('./config');
const {LineClient} = require('messaging-api-line');

module.exports = class Line {
    client;

    constructor(channel) {
        const config = Config.all('channels');
        this.client = LineClient.connect({
            accessToken: config[channel]['token'],
            channelSecret: config[channel]['secret']
        });
    }
}

