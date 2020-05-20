const express = require('express');
const router = express.Router();

const Util = require('./classes/util');
const multer = require('multer');

router.get('/', function (req, res) {
    res.render('index');
});

router.get('/doc/:id', function (req, res) {
    const content = Util.readDoc(req.params['id']);
    res.append('Content-Type', content['type']);
    res.append('Content-Length', content['size']);
    res.send(content['data']);
});

router.post('/upload', multer({ dest: 'tmp/' }).single('file'), (req, res) => {
    const id = Util.saveDoc({
        type: req.file.mimetype,
        size: req.file.size
    }, req.file.path);
    res.send({
        doc_id: id
    });
});

router.post('/setting', async function (req, res) {
    req.session.channel = req.body['channel'];
    Util.setFlashMessage(req.session, 'Changed setting');
    res.send('ok');
});

module.exports = router;
