const fs = require('fs');
const YAML = require('yaml');
const Util = require('./util');

module.exports = class Config {
    static basedir() {
        return __dirname + '/../..';
    }

    static get(name, file = 'application') {
        try {
            const config = YAML.parse(
                fs.readFileSync(
                    `${Config.basedir()}/config/${file}.yaml`,
                    'utf8'
                )
            );

            if (name === null) {
                return config;
            }

            if (config[name] === undefined) {
                return null
            }
            return config[name]
        } catch (err) {
            console.log(err);
            return null
        }
    }

    static all(file = 'application') {
        return Config.get(null, file);
    }
}
