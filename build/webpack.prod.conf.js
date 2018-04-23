// 生产环境中webpack的配置入口
var path = require('path')
var utils = require('./utils')
var webpack = require('webpack')
var config = require('../config')

// webpack 配置合并插件
var merge = require('webpack-merge')
// 基本配置文件
var baseWebpackConfig = require('./webpack.base.conf')
// webpack 复制文件和文件夹的插件
// https://github.com/kevlened/copy-webpack-plugin
var CopyWebpackPlugin = require('copy-webpack-plugin')
// 自动生成 html 并且注入到 .html 文件中的插件
// https://github.com/ampedandwired/html-webpack-plugin
var HtmlWebpackPlugin = require('html-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
// webpack 优化压缩和优化 css 的插件
// https://github.com/NMFR/optimize-css-assets-webpack-plugin
var OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')

//fgh+ 打包后的配置
var glob = require('glob');

var env = process.env.NODE_ENV === 'testing'
  ? require('../config/test.env')
  : config.build.env

var webpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.build.productionSourceMap,
      extract: true
    })
  },
  // 检测生产环境下是否生成source map
  devtool: config.build.productionSourceMap ? '#source-map' : false,
  output: {
    path: config.build.assetsRoot,
    filename: utils.assetsPath('js/[name].[chunkhash].js'),
    chunkFilename: utils.assetsPath('js/[id].[chunkhash].js')
  },
  plugins: [
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    new webpack.DefinePlugin({
      'process.env': env
    }),

    // 压缩 js
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      sourceMap: true
    }),
    // extract css into its own file
    new ExtractTextPlugin({
      filename: utils.assetsPath('css/[name].[contenthash].css')
    }),
    // Compress extracted CSS. We are using this plugin so that possible
    // duplicated CSS from different components can be deduped.

    // 删除重复的css内容
    new OptimizeCSSPlugin({
      cssProcessorOptions: {
        safe: true
      }
    }),

    // 分割公共 js 到独立的文件
    // https://webpack.js.org/guides/code-splitting-libraries/#commonschunkplugin
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function (module, count) {
        // node_modules中的任何所需模块都提取到vendor(在package.json中的dependencies部分)
        return (
          module.resource &&
          /\.js$/.test(module.resource) &&
          module.resource.indexOf(
            path.join(__dirname, '../node_modules')
          ) === 0
        )
      }
    }),
    // extract webpack runtime and module manifest to its own file in order to
    // prevent vendor hash from being updated whenever app bundle is updated
    // 将webpack runtime 和模块清单 提取到独立的文件，以防止当 app包更新时导致公共 jsd hash也更新
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      chunks: ['vendor']
    }),
    // 复制静态资源
    // https://github.com/kevlened/copy-webpack-plugin
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.build.assetsSubDirectory,
        ignore: ['.*']
      }
    ])
  ]
})

//多页面的配置
function getEntry(globPath){
  var entries = {},
      basename,
      tmp,
      pathname;

  if(typeof (globPath) != 'object'){
    globPath = [globPath];
  }

  globPath.forEach(function(itemPath){
    glob.sync(itemPath).forEach(function(entry){
      basename = path.basename(entry, path.extname(entry));
      if(entry.split('/').length > 4){
        tmp = entry.split('/').splice(-3);
        pathname = tmp.splice(0, 1) + '/' + basename;
        entries[pathname] = entry;
      }
      else{
        entries[basename] = entry;
      }
    })
  })
  return entries;

}
//获取对应入口目录 (html)
var pages = getEntry('./src/module/**/*.html');

//配置 HtmlWebpackPlugin
for (var pathname in pages){
  var conf = {
    //生成html的名字
    filename: pathname + '.html',
    template: pages[pathname],
    inject: true,
    minify: {
      removeComments: true,
      collapseWhitespace: true,
      removeAttributeQuotes: true
      // more options:
      // https://github.com/kangax/html-minifier#options-quick-reference
    },
    chunksSortMode: 'dependency'
  };

  if(pathname in webpackConfig.entry){
    conf.chunks = ['manifest', 'vendor', pathname];
    conf.hash = true;
  }

  webpackConfig.plugins.push(new HtmlWebpackPlugin(conf));
}


// 开启 gzip 的情况时，给 webpack plugins添加 compression-webpack-plugin 插件
if (config.build.productionGzip) {
  // webpack 压缩插件
  // https://github.com/webpack-contrib/compression-webpack-plugin
  var CompressionWebpackPlugin = require('compression-webpack-plugin')


  // 向webpackconfig.plugins中加入下方的插件
  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp(
        '\\.(' +
        config.build.productionGzipExtensions.join('|') +
        ')$'
      ),
      threshold: 10240,
      minRatio: 0.8
    })
  )
}

// 开启包分析的情况时， 给 webpack plugins添加 webpack-bundle-analyzer 插件
// https://github.com/th0r/webpack-bundle-analyzer
if (config.build.bundleAnalyzerReport) {
  var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig
