const path = require('path');
const express = require('express');
const {program} = require('commander');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const redis = require('redis')
const RedisStore = require('connect-redis')(session);
const Config = require('./app/classes/config');

const app = express();
const redisClient = redis.createClient();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    store: new RedisStore({
        client: redisClient,
        prefix: 'line-tool:'
    }),
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
    let currentChannel = req.cookies.channel ? req.cookies.channel : null;
    if (currentChannel == null) {
        // noinspection LoopStatementThatDoesntLoopJS
        for (let key in channels) {
            currentChannel = key;
            res.cookie('channel', key, {
                expires: new Date(Date.now() + 86400 * 30 * 1000),
                httpOnly: true,
                secure: false
            });
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
    res.locals.channel_name = channels[currentChannel].name;

    next();
});

app.use('/', require('./app/index'));
app.use('/richmenu', require('./app/rich-menu'));
app.use('/audience', require('./app/audience'));

program.option('--port <number>', 'listen port');
program.parse(process.argv);
let port = 3000;
if (program.port) {
    port = program.port;
}

app.listen(port);
console.log('http://localhost:' + port + '/');
