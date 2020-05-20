const fs = require('fs');
const crypto = require('crypto');
const Config = require('./config');

module.exports = class Util {
    static saveDoc(info, path) {
        const buffer = fs.readFileSync(path);
        info['base64'] = buffer.toString('base64');
        const id = crypto.createHash('sha256')
            .update(info['base64'], 'utf8')
            .digest('hex');

        const data = JSON.stringify(info);
        const savePath = Config.basedir() + '/tmp/' + id + '.json';
        fs.writeFileSync(savePath, data);
        fs.unlinkSync(path);

        return id;
    }

    static readDoc(id) {
        const json = fs.readFileSync(Util.docPath(id), 'utf8');
        let decoded = JSON.parse(json);
        decoded['data'] = Buffer.from(decoded['base64'], 'base64');
        delete decoded['base64'];
        return decoded;
    }

    static docPath(id) {
        return Config.basedir() + '/tmp/' + id + '.json';
    }

    static setFlashMessage(session, message) {
        if (typeof session.flash_messages == 'object') {
            session.flash_messages.push(message);
        } else {
            session.flash_messages = [message];
        }
    }
}
