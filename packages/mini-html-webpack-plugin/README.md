# `@lc/mini-html-webpack-plugin`

> 简化HTML文件创建的插件，html-webpack-plugin插件的简化版

## Webpack 5

```javascript
npm i --save-dev @lc/mini-html-webpack-plugin
```

```javascript
yarn add --dev @lc/mini-html-webpack-plugin
```

## Usage

### webpack.config.js
```
const MiniHtmlWebpackPlugin = require('@lc/mini-html-webpack-plugin');

module.exports = {
  entry: 'index.js',
  output: {
    path: __dirname + '/dist',
    filename: 'index_bundle.js'
  },
  plugins: [
    new MiniHtmlWebpackPlugin()
  ]
}
```

## Options
提供的插件选项同 `html-webpack-plugin`

