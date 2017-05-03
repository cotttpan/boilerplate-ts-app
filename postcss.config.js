module.exports = {
    plugins: [
        require('postcss-easy-import'),
        require('postcss-custom-properties'),
        require('postcss-custom-media'),
        require('postcss-nested'),
        require('postcss-calc'),
        require('autoprefixer'),
        require('css-mqpacker')
    ]
};
