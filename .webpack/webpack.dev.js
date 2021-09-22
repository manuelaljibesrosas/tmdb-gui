const { merge } = require('webpack-merge');
const baseConfig = require('./webpack.base');

module.exports = merge(
  baseConfig,
  {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
      host: '0.0.0.0',
      port: 8081,
      historyApiFallback: {
        rewrites: [
          { from: /main.js/, to: '/main.js' },
        ],
      },
    },
  },
);
