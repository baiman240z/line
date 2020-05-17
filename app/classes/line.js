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

    /*
    richMenus() {
        return this.client.getRichMenuList();
    }

    richMenu(menuId) {
        return this.client.getRichMenu(menuId);
    }

    richMenuImage(menuId) {
        return this.client.downloadRichMenuImage(menuId);
    }

    deleteRichMenu(menuId) {
        return this.client.deleteRichMenu(menuId);
    }

    async createRichMenu(menu, buffer) {
        for (const area of menu['areas']) {
            if (area['action']['type'] === 'datetimepicker') {
                delete area['action']['initial'];
                delete area['action']['max'];
                delete area['action']['min'];
            }
        }

        const created = await this.client.createRichMenu(menu).catch((err) => {
            throw err;
        });

        return this.client.uploadRichMenuImage(
            created['richMenuId'],
            buffer
        );
    }

    setDefaultRichMenu(menuId) {
        return this.client.setDefaultRichMenu(menuId);
    }

    defaultRichMenu() {
        return this.client.getDefaultRichMenu();
    }
    */
}

