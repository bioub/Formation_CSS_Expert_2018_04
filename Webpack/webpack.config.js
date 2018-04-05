const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = (env, argv) => {

  const extractSass = new ExtractTextPlugin({
    filename: '[name].[chunkhash].css',
    disable: argv.mode === 'development'
  });

  return {
    entry: {
      main: './src/js/main.js'
    },
    output: {
      filename: '[name].[chunkhash].js',
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './src/index.html',
        minify: (argv.mode === 'production') ? {
          collapseWhitespace: true,
          conservativeCollapse: true,
          removeComments: true,
        } : false,
      }),
      extractSass,
    ],
    module: {
      rules: [{
        test: /\.scss$/,
        use: extractSass.extract({
          use: [{
            loader: 'css-loader'
          }, {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: () => [
                require('autoprefixer')({
                  browsers: ['last 2 versions'],
                }),
                require('cssnano')()
              ]
            }
          }, {
            loader: 'sass-loader'
          }],
          // use style-loader in development
          fallback: 'style-loader'
        })
      }],
    },
  };
};
