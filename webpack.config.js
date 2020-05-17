module.exports = {
    devtool: 'inline-source-map',
    watch: false,
    mode: "development",
    entry: {
        'js/init': `${__dirname}/src/js/init.js`,
        'js/richmenu': `${__dirname}/src/js/richmenu.js`,
        'js/richmenus': `${__dirname}/src/js/richmenus.js`,
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                options: {
                    presets: [
                        '@babel/preset-env'
                    ]
                }
            }
        ]
    },
    output: {
        path: `${__dirname}/public`,
        filename: "[name].js"
    },
    optimization: {
        splitChunks: {
            name: "js/chunks",
            chunks: "initial"
        }
    },
    resolve: {
        extensions: [
            ".js"
        ]
    }
};
