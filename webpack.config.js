const HTMLWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  module:{
    rules:[
      {
        test:/\.html$/,
        use:[
          {
            loader:'html-loader',
            options:{minimize:true}
          }
        ]
      },
      {
        test:/\.(png|svg|jpg|gif)$/,
        use:{
          loader:'file-loader',
          options:{
            esModule:false
          },          
        } 
      },
      {
        test:/\.js$/,
        exclude: /node_modules/,
        use:{
          loader:'babel-loader'
        }
      },
      {
        test:/\.css$/,
        use:[          
          'style-loader',
          'css-loader'
        ]
      },
      {
        test:/\.scss$/,
        use:[          
          'style-loader',
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  plugins:[
    new HTMLWebpackPlugin({
      template:'./src/index.html',
      filename:'./index.html'
    })
  ]
}