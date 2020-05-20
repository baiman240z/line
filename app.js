const path = require('path');
const express = require('express');
const app = express();
const {program} = require('commander');
const bodyParser = require('body-parser');
const session = require('express-session');
const Config = require('./app/classes/config');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false,
        maxage: 1000 * 60 * 30
    }
}));

// before action
app.use(function(req, res, next) {
    const channels = Config.all('channels');
    res.locals.channels = channels;
    if (!req.session.channel) {
        // noinspection LoopStatementThatDoesntLoopJS
        for (let key in channels) {
            req.session.channel = key;
            break;
        }
    }

    if (req.session.error) {
        res.locals.error = req.session.error;
        delete req.session.error;
    }

    if (req.session.flash_messages) {
        res.locals.flash_messages = req.session.flash_messages;
        delete req.session.flash_messages;
    }

    res.locals.session = req.session;
    res.locals.channel_name = channels[req.session.channel].name;

    next();
});

app.use('/', require('./app/index'));
app.use('/richmenu', require('./app/rich-menu'));

program.option('--port <number>', 'listen port');
program.parse(process.argv);
let port = 3000;
if (program.port) {
    port = program.port;
}

app.listen(port);
console.log('http://localhost:' + port + '/');
