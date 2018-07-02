const path = require('path');

module.exports = {
    entry: {
        "core": ["./src/index.ts"],
        "jquery-wrapper": ["./src/index-jquery.ts"],
    },

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },

    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    }
};