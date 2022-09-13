import { Compiler, webpack } from 'webpack'
import {CachedChildCompiler} from './lib/cached-child-compiler'
import type { IMiniHtmlWebpackPlugin } from './typing'
import second from './README.md'
console.log(second);

const path = require('path')
const fs = require('fs')
const { assert } = require('console')

const PLUGI_NNAME = 'MiniHtmlWebpackPlugin'

/**
 * 返回带有加载器的tempalte路径
 * 1.如果template值为‘auto’，去项目中找src/index.ejs为模版，不存在走插件默认模版
 * 2.如果传入模版路径中不存在‘!’，则在路径前面再使用插件本身loader.js解析
 * 3.处理路径本身的loader，将路径转为绝对路径（正则匹配出路径）
 */
function getFullTemplatePath(template: string, context: string) {
  let fullTemplatePath = template
  console.log(fullTemplatePath);
  
  if (fullTemplatePath === 'auto') {
    fullTemplatePath = path.resolve(context, 'src/index.ejs')
    if (!fs.existsSync(fullTemplatePath)) {
      // fullTemplatePath = require('./default_index.ejs')
      // console.log(defaultIndex);
      
    }
  }
  return fullTemplatePath
}

function hookIntoCompiler(compiler: Compiler, options: IMiniHtmlWebpackPlugin.ProcessedOptions, plugin: MiniHtmlWebpackPlugin) {
  const webpack = compiler.webpack

  // 处理template路径，返回带有加载器的tempalte路径
  options.template = getFullTemplatePath(options.template, compiler.context);
  // TODO 用于做缓存的child compiler
  // const cachedChildCompiler = new CachedChildCompiler()

  // 初始化 compilation 时调用，在触发 compilation 事件之前调用
  // compiler.hooks.thisCompilation.tap(PLUGI_NNAME, (compilation) => {
  //   // asset 处理阶段调用
  //   compilation.hooks.processAssets.tapAsync({name: PLUGI_NNAME}, (assets, callback) => {
  //     // 获取入口文件名
  //     const entryPointUnfilteredFiles = compilation.entrypoints.get('a')?.getFiles()
  //     const webpack = compiler.webpack
  //     // 输出
  //     console.log(111);
      
  //     compilation.emitAsset('index1111.html', new webpack.sources.RawSource(`<html>
  //     <head>
  //       <meta charset="utf-8">
  //       <title>Webpack App</title>
  //     <meta name="viewport" content="width=device-width, initial-scale=1"><script defer src="test.js"></script></head>
  //     <body>
  //     </body>
  //   </html>`))
  //   callback()
  //   })
  // })
  
}

export class MiniHtmlWebpackPlugin {
  static version: number;
  userOptions: IMiniHtmlWebpackPlugin.Options

  constructor(options: IMiniHtmlWebpackPlugin.Options) {
    this.userOptions = options || {}
  }

  apply(compiler: Compiler) {
    compiler.hooks.initialize.tap(PLUGI_NNAME, () => {
      const userOptions = this.userOptions

      // 合并&处理传入插件参数
      const options: IMiniHtmlWebpackPlugin.RequiredOptions = {
        compile: userOptions.compile ?? true, // ???
        template: userOptions.template ?? 'auto',
        filename: userOptions.filename ?? 'index.html',
        publicPath: userOptions.publicPath === undefined ? 'auto' : userOptions.publicPath,
        hash: userOptions.hash ?? false,
        inject: userOptions.scriptLoading === 'blocking' ? 'body' : 'head',
        scriptLoading: userOptions.scriptLoading ?? 'defer',
        favicon: userOptions.favicon ?? false,
        cache: userOptions.cache ?? true,
        showErrors: userOptions.showErrors ?? true,
        chunks: userOptions.chunks ?? 'all',
        excludeChunks: userOptions.excludeChunks ?? [],
        chunksSortMode: userOptions.chunksSortMode ?? 'auto',
        meta: userOptions.meta ?? {},
        title: userOptions.title ?? 'Webpack App',
      };

      assert(['defer', 'blocking', 'module'].includes(options.scriptLoading || ''), 'scriptLoading需要设置为"defer"，"blocking"或者"module"')
      assert([true, false, 'head', 'body'].includes(options.inject || ''), 'inject需要设置为true，false，"head"或者"body')

      // 用户未传入template情况，合并meta
      if (!userOptions.template) {
        options.meta = {
          viewport: 'width=device-width, initial-scale=1',
          ...userOptions.meta
        }
      }

      // 处理输出html文件名，将[name]替换为entry名称
      const filenameFunction = typeof options.filename === 'function' ? options.filename : (entryName: string) => entryName.replace(/\[name\]/g, entryName)
      const entryNames = Object.keys(compiler.options.entry)
      const outputNames = new Set((entryNames.length ? entryNames : ['main']).map(filenameFunction))

      const entryOptions = [...outputNames].map(filename => ({
        ...options,
        filename
      }))
      // 将MiniHtmlWebpackPlugin事件处理挂在到webpack compiler hooks中
      entryOptions.forEach(instanceOptions => hookIntoCompiler(compiler, instanceOptions, this))
    })
  }
}

MiniHtmlWebpackPlugin.version = 5
