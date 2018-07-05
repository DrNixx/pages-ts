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
                loader: 'ts-loader',
                options: { configFile: 'tsconfig.webpack.json' },
                exclude: /node_modules/
            }
        ]
    },

    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    }
};