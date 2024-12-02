const path = require('path')

/**
 * @type {import ("webpack").Configuration;}
 */
module.exports = {
  target: 'node',
  mode: 'production',
  entry: {
    index: path.resolve(__dirname,"./src/index.js")
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: './index.js',
    publicPath: '/',
    clean: true,
    library: {
      name: 'readCatalogue',
      type: 'commonjs2'
    }
  },
  resolve: {
    extensions: ['.ts', '.js', '.json']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              // transpileOnly: true
            }
          }
        ],
        exclude: /node_modules/
      }
    ]
  }
}
