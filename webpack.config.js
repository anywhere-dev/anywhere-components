const webpack = require('webpack')
const path = require('path')

const config = {
    entry: path.resolve(__dirname, 'src'),
    output: {
        path: path.resolve(__dirname, 'lib'),
        filename: 'index.js',
        libraryTarget: 'umd',
        library: 'anywhere-components'
    },
    module: {
        rules: [
            {
                loader: 'babel-loader',
                test: /.js$/,
                exclude: /node_modules/,
                include: path.resolve(__dirname, 'src'),
                options: {
                    presets: ['env', 'react']
                }
            }
        ]
    }
}

if (process.env.NODE_ENV === 'production') {
    config.externals = {
        'react': 'react',
        'react-dom': 'react-dom',
        'semantic-ui-react': 'semantic-ui-react'
    }

    config.plugins = [
        new webpack.optimize.AggressiveMergingPlugin(),
        new webpack.optimize.UglifyJsPlugin({
            beautify: false,
            mangle: {
                screw_ie8: true,
            },
            compress: {
                warnings: false,
                screw_ie8: true
            },
            comments: false
        }),
    ]

}

module.exports = config