# Webpack入门



## 初始化

使用VS Code进入创建的项目文件夹，terminal中输入

```
npm init -y
```

(-y表示所有选择都自动选yes,也可以手动设置)

此时项目文件夹中会生成node_modules文件夹(各种依赖包)，package.json文件(npm配置)

然后输入下面指令安装webpack

```
npm i -D webpack webpack-cli
```

(因为只在开发中用到，故使用了--save-dev，缩写-D)

## package.json文件

### main

项目的入口文件，默认为index.js

### scripts

表示在`npm run *` 之后执行的操作,比如设置
```json
"scripts": {
  "build": "webpack"
}
```
则在`npm run build`之后将会执行`webpack`命令(支持任何cmd语句)

此时执行会报错，因为所有源代码文件需要放到src文件夹中。

```
ERROR in Entry module not found: Error: Can't resolve './src' in 'D:\Desktop\GitHub\TUTORIAL Build A Webpack Project from Scratch'
npm ERR! code ELIFECYCLE
npm ERR! errno 2
npm ERR! webpacktut@1.0.0 build: `webpack`
npm ERR! Exit status 2
npm ERR!
npm ERR! Failed at the webpacktut@1.0.0 build script.
npm ERR! This is probably not a problem with npm. There is likely additional logging output above.
```

创建src文件夹并在里面创建index.js文件，然后再次`npm run build`，webpack会将index.js文件压缩混淆成main.js放入项目文件夹下新生成的dist文件夹中。

## 配置webpack

在项目目录下创建webpack.config.js文件。

### 使webpack能打包html文件

先安装对应依赖

```
npm i -D html-webpack-plugin html-loader
```
安装完成后，在webpack.config.js文件中添加如下代码
```js
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
      }
    ]
  },
  plugins:[
    new HTMLWebpackPlugin({
      template:'./src/index.html',
      filename:'./main.html'
    })
  ]
}
```
作用是使用正则找到html文件，然后将其打包置于dist中命名为index.html，支持一些自定义选项，如上文的是否压缩代码等。template的默认目录为项目根目录，filename的默认目录为dist

此时入口的js文件会被自动引入html，无需在html中手动引入。

### 使webpack能打包图片文件

安装依赖
```
npm i -D file-loader
```
配置webpack.config.js

在rules中加入下面代码
```js
{
  test:/\.(png|svg|jpg|gif)$/,
  use:{
    loader:'file-loader',
    options:{
      esModule:false
    }
  } 
}
```
注:v4.3以上版本的file-loader默认使用esModule语法，图片引用方式改变，原来的方式引用会导致打包后无法显示图片地址，可在此配置关闭

### webpack打包css

安装依赖
```
npm i -D css-loader style-loader
```
配置webpack.config.js

rules中添加
```js
{
  test:/\.css$/,
  use:[
    'style-loader',
    'css-loader'
  ]
}
```
两个loader的顺序不能错，不然会报错。此后，便可在js中通过import来导入css

可选项:
```
mini-css-extract-plugin
```
在webpack.config.js中添加
```js
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const MiniCssExtractPlugin({
  filename:'[name].css',
  chunkFilename:'[id].css'
})
```

### webpack打包sass

安装依赖
```
npm i -D node-sass sass-loader
```
配置webpack.config.js，在rules中添加
```js
{
  test:/\.scss$/,
  use:[          
    'style-loader',
    'css-loader',
    'sass-loader'
  ]
}
```
同样loaders的顺序不能错

### webpack打包typescript

安装依赖
```
npm i -D typescript ts-loader
```
配置webpack.config.js，在rules中添加
```js
{
  test: /\.ts$/,
  use: 'ts-loader',
  exclude: /node_modules/
}
```
在项目根目录下创建tsconfig.json，输入
```json
{
  "compilerOptions": {
    "outDir": "./dist/",
    "sourceMap": true,
    "noImplicitAny": true,
    "module": "commonjs",
    "target": "es6",
    "jsx": "react",
    "allowJs": true
  }
}

```

### webpack使用babel转换es语法

安装依赖
```
npm i -D @babel/core babel-loader @babel/preset-env
```
配置webpack.config.js，在rules中添加下面代码
```js
{
  test:/\.js$/,
  exclude: /node_modules/,
  use:{
    loader:'babel-loader'
  }
}
```
类似html部分，作用为查找js文件(排除npm依赖包)，然后使用babel转换


## dev-server(w/ live-reload)

安装依赖
```shell
npm i -D webpack-dev-server
```
在package.json中配置指令
```json
"scripts": {
  "build": "webpack",
  "dev": "webpack-dev-server"
}
```
此时`npm run dev`即可在运行本地开发服务器，默认url为[http://localhost:8080/](http://localhost:8080/)


## webpack.config.js和package.json的最终形态
### webpack.config.js
```js
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
```
### package.json
```json
{
  "name": "webpacktut",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "dependencies": {},
  "devDependencies": {
    "@babel/core": "^7.8.6",
    "@babel/preset-env": "^7.8.6",
    "babel-loader": "^8.0.6",
    "css-loader": "^3.4.2",
    "file-loader": "^5.1.0",
    "html-loader": "^0.5.5",
    "html-webpack-plugin": "^3.2.0",
    "mini-css-extract-plugin": "^0.9.0",
    "node-sass": "^4.13.1",
    "sass-loader": "^8.0.2",
    "style-loader": "^1.1.3",
    "ts-loader": "^6.2.1",
    "typescript": "^3.8.2",
    "webpack": "^4.41.6",
    "webpack-cli": "^3.3.11",
    "webpack-dev-server": "^3.10.3"
  },
  "scripts": {
    "build": "webpack",
    "dev": "webpack-dev-server"
  },  
  "author": "",
  "license": "ISC"
  
}

```

## 参考资料
1. [Webpack 4 Tutorial - Getting Started for Beginners](https://www.youtube.com/watch?v=TzdEpgONurw)
2. [webpack配置文件中的输入输出文件路径](https://segmentfault.com/a/1190000021049255)
3. [file-loader打包图片文件时路径错误输出为[object-module]的解决方法](https://www.jb51.net/article/177740.htm)
4. [Webpack4与Typescript结合开发](https://blog.csdn.net/u013986166/article/details/80246452)