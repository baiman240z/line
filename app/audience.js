const express = require('express');
const router = express.Router();
const Util = require('./classes/util');

const Tokens = require('csrf');
const tokens = new Tokens();

const Audience = require('./classes/audience');

router.get('/audiences', async function (req, res) {
    const line = new Audience(req.cookies.channel);
    const page = await line.page();
    res.render('audiences', {
        groups: page.audienceGroups,
    });
});

router.get('/audience', async function (req, res) {
    const secret = tokens.secretSync();
    req.session.csrf_secret = secret;

    let description;
    if (req.query['id']) {
        const line = new Audience(req.cookies.channel);
        const audience = await line.get(req.query['id']);
        console.log(audience);
        description = audience.audienceGroup.description;
    }

    res.render('audience', {
        _csrf: tokens.create(secret),
        description: description,
        id: (req.query['id'] ? req.query['id'] : null)
    });
});

router.post('/audience', async function (req, res) {
    // CSRF verify
    if (!tokens.verify(req.session.csrf_secret, req.body['_csrf'])) {
        req.session.error = 'CSRF Error';
        res.redirect('/audience/audiences');
        return;
    }

    const audiences = req.body['audiences'].split(/\r\n|\r|\n/);
    const line = new Audience(req.cookies.channel);
    if (req.query['id']) {
        const result = await line.update(req.query['id'], req.body['description'], audiences);
        console.log(result);
        Util.setFlashMessage(req.session, 'Updated');
    } else {
        const result = await line.create(req.body['description'], audiences);
        if (result.audienceGroupId === undefined) {
            console.log(result);
            Util.setFlashMessage(req.session, 'Failed');
        } else {
            Util.setFlashMessage(req.session, 'Created');
        }
    }
    res.redirect('/audience/audiences');
});

router.post('/delete', async function (req, res) {
    const line = new Audience(req.cookies.channel);
    const result = await line.delete(req.body['id']);
    console.log(result);
    Util.setFlashMessage(req.session, 'Deleted');
    res.redirect('/audience/audiences');
});

module.exports = router;
