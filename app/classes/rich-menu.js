const Line = require('./line');

module.exports = class RichMenu extends Line {
    async menus() {
        const menus = await this.client.getRichMenuList();
        console.log(menus);
        menus.sort((a, b) => {
            if (a['name'] > b['name']) {
                return 1;
            } else if (a['name'] == b['name']) {
                return 0;
            } else {
                return -1;
            }
        });
        return menus;
    }

    menu(menuId) {
        return this.client.getRichMenu(menuId);
    }

    image(menuId) {
        return this.client.downloadRichMenuImage(menuId);
    }

    delete(menuId) {
        return this.client.deleteRichMenu(menuId);
    }

    async create(menu, buffer) {
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

    setDefault(menuId) {
        return this.client.setDefaultRichMenu(menuId);
    }

    default() {
        return this.client.getDefaultRichMenu();
    }
}
