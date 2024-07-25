
const StatsPlugin = require('stats-webpack-plugin')
const path = require('path');
const CompressionPlugin = require("compression-webpack-plugin");
const  HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
function resolve(dir) {
  return path.join(__dirname, dir);
}
const { name } = require('./package');
const webpack = require("webpack");
const port = 9001
const publicPath = '/fe_system_hub/'
module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? publicPath:`//localhost:${port}${publicPath}`,
/*  publicPath: process.env.NODE_ENV === 'production' ? '/':'//localhost:9001/',*/
  filenameHashing: false,
  lintOnSave: true,
  productionSourceMap: false,
  configureWebpack:{
    resolve: {
      alias: {
        '@': resolve('src'),
      },
    },
    output: {
      library: name,
      libraryTarget:'umd',
   /*   jsonpFunction: `webpackJsonp_${name}`,*/
    },
    plugins: [
      new MonacoWebpackPlugin({
        languages: [ 'css', 'html']
      }),
      new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery",
        jquery: "jquery",
        "window.jQuery": "jquery"
      }),
      // 限制只打一个包，不分Chunk
      new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 1
      }),
      new StatsPlugin('manifest.json', {
        chunkModules: false,
        entrypoints: true,
        source: false,
        chunks: false,
        modules: false,
        assets: false,
        children: false,
       // exclude: [/node_modules/]
      }),
      new CompressionPlugin({
        test: /\.js$|\.html$|\.css$|\.jpg$|\.jpeg$|\.png/, // 需要压缩的文件类型
        threshold: 10240, // 归档需要进行压缩的文件大小最小值，我这个是10K以上的进行压缩
        deleteOriginalAssets: false // 是否删除原文件
      }),
      new HardSourceWebpackPlugin()
    ]
  },
  css: {
    extract: false,
    loaderOptions: {
      sass: {
        sassOptions: {
          includePaths: ['node_modules', '../../node_modules']
        }
      }
    }
  },
  devServer: {
    contentBase: './',
    compress: true,
    port: port,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  }
}
