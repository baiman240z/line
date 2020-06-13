const Line = require('./line');

module.exports = class Audience extends Line {
    async page(no) {
        const size = 10;
        if (no === undefined) { no = 1; }
        return await this.callGet(
            `https://api.line.me/v2/bot/audienceGroup/list?page=${no}&size=${size}`
        );
    }

    static createList(audiences) {
        let _audiences = [];
        for (const audience of audiences) {
            _audiences.push({id: audience});
        }
        return _audiences;
    }

    async create(description, audiences) {
        return await this.callPost('https://api.line.me/v2/bot/audienceGroup/upload', {
            description: description,
            isIfaAudience: false,
            audiences: Audience.createList(audiences)
        });
    }

    async update(id, description, audiences) {
        const _audiences = Audience.createList(audiences);
        if (_audiences.length > 0) {
            await this.callPut('https://api.line.me/v2/bot/audienceGroup/upload', {
                audienceGroupId: id,
                audiences: _audiences
            }).catch((err) => {
                throw err;
            });
        }

        return await this.callPut(`https://api.line.me/v2/bot/audienceGroup/${id}/updateDescription`, {
            description: description
        });
    }

    async delete(id) {
        return await this.callDelete(
            `https://api.line.me/v2/bot/audienceGroup/${id}`
        );
    }

    async get(id) {
        return await this.callGet(
            `https://api.line.me/v2/bot/audienceGroup/${id}`
        );
    }
}
