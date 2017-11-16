module.exports = {
    devtool: 'source-map',
    entry: {
        'KMedia':'./src/entry-KMedia.js',
        'SimpleControls':'./src/entry-SimpleControls.js',
        'ComplexControls':'./src/entry-ComplexControls.js',
    },
    output: {
        filename: 'dist/[name].js',
    },
    devServer: {
        port:80,
        inline: true
    },
}
