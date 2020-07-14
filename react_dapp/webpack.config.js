var BundleTracker=require('webpack-bundle-tracker');
var path=require('path');

const SRC_DIR = __dirname +'/src';
const DIST_DIR= __dirname +'/bundles';

module.exports = {
    context: __dirname,
    entry:[
        path.resolve(SRC_DIR,'index.js')
    ],
    output: {
        path: DIST_DIR,
        filename: "main.js",
        publicPath: '/static/'
    },
    watchOptions:{
        poll:1000
    },
    plugins: [
        new BundleTracker({
            path: __dirname,
            filename: 'webpack-stats.json'
        })

    ]
    ,
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use:{
                    loader: "babel-loader"
                }
            },
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader'
            },
        ]
    },
    resolve: {
        extensions: ['*','.js','.jsx']
    },
    watch: true,
    watchOptions: {
        aggregateTimeout: 200,
        poll: 1000
    }

}
