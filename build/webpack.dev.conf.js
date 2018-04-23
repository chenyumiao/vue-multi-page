//该文件是开发环境中webpack的配置入口

// 引入工具集合的文件
var utils = require('./utils')
var webpack = require('webpack')
// 引入配置文件
var config = require('../config')
// webpack的 配置合并插件
var merge = require('webpack-merge')
// webpac基本配置
var baseWebpackConfig = require('./webpack.base.conf')
// 自动生成 html 并且注入到 .html 文件中的插件 (https://github.com/ampedandwired/html-webpack-plugin)
var HtmlWebpackPlugin = require('html-webpack-plugin')
// webpack错误信息提示插件 (https://github.com/geowarin/friendly-errors-webpack-plugin)
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

// 整合css的工具 https://github.com/webpack-contrib/extract-text-webpack-plugin
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var extract = new ExtractTextPlugin('css/[name].[hash].css');

// node自带的 path和glob的工具
var path = require('path');
var glob = require('glob');

// 抓取base.conf.js中的 entry入口文件, 结合dev-client(热加载) 拼接后转换
Object.keys(baseWebpackConfig.entry).forEach(function (name) {
  baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name])
})

// exports 合并
module.exports = merge(baseWebpackConfig, {
  module: {
    // css-loader的加工
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap })
  },
  // cheap-module-eval-source-map is faster for development
  /*
    这里是关于代码的 sourcemap 模式的选择
    可参考以下各种类型 https://segmentfault.com/a/1190000008315937
    几个类型的关键字
    cheap
    eval
    module
  */
  devtool: '#cheap-module-eval-source-map',
  plugins: [
    extract,
    /*
      通过配置了DefinePlugin，那么这里面的标识就相当于全局变量.
      然后再全局的js中
      'process.env' 等于一个变量 变量的值为 config.dev.env中的值
    */
    // https://webpack.js.org/plugins/define-plugin/
    new webpack.DefinePlugin({
      'process.env': config.dev.env
    }),
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    /*
        启动webpack-hot-middleware
        HotModule 插件在页面进行变更的时候只会重绘对应的页面模块，不会重绘整个 html 文件
    */
    new webpack.HotModuleReplacementPlugin(),

    // 跳过编译时出错的代码并记录，使编译后运行时的包不会发生错误
    new webpack.NoEmitOnErrorsPlugin(),


    //fgh+ 取消统一html入口
    //https://github.com/ampedandwired/html-webpack-plugin
    // new HtmlWebpackPlugin({
    //   filename: 'index.html',
    //   template: 'index.html',
    //   inject: true
    // }),

    // webpack错误信息提示插件
    new FriendlyErrorsPlugin()

  ]
})


//获取多页面入口的路径
function getEntry (globPath) {
  var entries = {},
      basename, // *.html *对应的文件名
      tmp, // 路径数组
      pathname;

  //获取对应路径符合的文件 (数组) 同步方法
  glob.sync(globPath).forEach(function(item){
    //获取 *
    basename = path.basename(item, path.extname(item));
    //路径按照 '/' 进行划分 从倒数第三个开始
    tmp = item.split('/').splice(-3);
    //返回文件夹路径 module/*
    pathname = tmp.splice(0, 1) + '/' + basename;
    //将数据存入对象
    entries[pathname] = item;
    // pathname = './src/module/basename/basename.html'
  })

  return entries;
}

//fgh+ html的入口设置
var pages = getEntry('./src/module/**/*.html');

//fgh+ html入口设置
for (var pathname in pages){
  var conf = {
    filename: pathname + '.html',
    template: pages[pathname], //路径
    minify: { //传递 html-minifier 选项给 minify 输出
      removeComments: true
    },
    inject: true, // js插入位置(true 是指 插在body中)

    // chunk 主要是针对多入口(entry)文件
    chunks: [pathname] // 每个html引用的js模块，也可以在这里加上vendor等公用模块
  }
  module.exports.plugins.push(new HtmlWebpackPlugin(conf));
}
