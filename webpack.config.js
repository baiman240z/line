const path = require('path');

module.exports = {
    devtool: 'inline-source-map',
    watch: false,
    mode: "development",
    context: path.resolve(__dirname, 'src'),
    output: {
        path: path.resolve(__dirname, 'public/js'),
        filename: "[name].js"
    },
    entry: {
        'init': './js/init.js',
        'richmenu': './js/richmenu.js',
        'richmenus': './js/richmenus.js',
        'audience': './js/audience.js',
        'audiences': './js/audiences.js'
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
    optimization: {
        splitChunks: {
            name: "chunks",
            chunks: "initial"
        }
    },
    resolve: {
        extensions: [
            ".js"
        ]
    }
};
