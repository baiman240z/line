const express = require('express');
const router = express.Router();

const RichMenu = require('./classes/rich-menu');
const Util = require('./classes/util');

const Tokens = require('csrf');
const tokens = new Tokens();

router.get('/menus', async function (req, res) {
    const line = new RichMenu(req.session.channel);
    const menus = await line.menus();
    const defMenu = await line.default();
    res.render('richmenus', {
        menus: menus,
        defaultMenuId: defMenu ? defMenu['richMenuId'] : null
    });
});

router.get('/image', async function (req, res) {
    const line = new RichMenu(req.session.channel);
    const buffer = await line.image(req.query['id']);
    res.append('Content-Type', 'image/png');
    res.send(buffer);
});

router.post('/delete', async function (req, res) {
    const line = new RichMenu(req.session.channel);
    const result = await line.delete(req.body['id']);
    console.log(result);
    res.redirect('/richmenu/menus');
});

router.post('/default', async function (req, res) {
    const line = new RichMenu(req.session.channel);
    const result = await line.setDefault(req.body['id']);
    res.redirect('/richmenu/menus');
});

router.get('/menu', async function (req, res) {
    const secret = tokens.secretSync();
    req.session.csrf_secret = secret;
    res.render('richmenu', {
        _csrf: tokens.create(secret)
    });
});

router.post('/menu', async function (req, res) {
    // CSRF verify
    if (!tokens.verify(req.session.csrf_secret, req.body['_csrf'])) {
        req.session.error = 'CSRF Error';
        res.redirect('/richmenu/menus');
        return;
    }

    const line = new RichMenu(req.session.channel);
    let doc = null;
    if (req.body['doc_id'].length > 0) {
        doc = Util.readDoc(req.body['doc_id']);
    }

    let parsed;
    try {
        parsed = JSON.parse(req.body['json'])
    } catch (e) {
        req.session.error = e.toString();
        res.redirect('/richmenu/menus');
        return;
    }

    await line.create(
        parsed,
        doc ? Buffer.from(doc['data']) : null
    ).catch((err) => {
        req.session.error = err.message;
    }).then();
    res.redirect('/richmenu/menus');
});

router.get('/json', async function (req, res) {
    const line = new RichMenu(req.session.channel);
    const menu = await line.menu(req.query['id']).catch((err) => {
        console.log(err);
    });
    res.send(menu);
});

module.exports = router;
