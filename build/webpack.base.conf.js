// 各个环境下的公共webpack配置
var path = require('path')
var utils = require('./utils')
var config = require('../config')
var webpack = require('webpack');

// 整合css的工具 https://github.com/webpack-contrib/extract-text-webpack-plugin
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var extract = new ExtractTextPlugin('css/[name].[hash].css');

//fgh+ 匹配目录中所有子文件夹
var glob = require('glob');
//获取多页面的入口集合
var entries = getEntry('./src/module/**/*.js');

//构造一个方法用于获取文件绝对路径
function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  //多页面入口
  entry: entries,
  //输出
  output: {
    // 编译输出的静态资源根路径
    path: config.build.assetsRoot,
    // 编译输出的文件名
    filename: '[name].js',
    // 正式发布环境下编译输出的上线路径的根路径
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  resolve: {
    // 自动补全的扩展名
    extensions: ['.js', '.vue', '.json'],
    // 路径别名
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src'),
      'assets': resolve('src/assets'),
      'components': resolve('src/components'),
      'store': resolve('src/store')
    },
  },
  //插件
  plugins: [
    /*extract,*/
    //全局引入内容(definitions定义标识符，当遇到指定标识符的时候，自动加载模块 例如 $: "jquery", 表示使用$ 为jq)
    new webpack.ProvidePlugin({
      jQuery: "jquery",
      $: "jquery"
    })
  ],
  // 各种loader的配置
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: utils.cssLoaders({
            sourceMap: (process.env.NODE_ENV === 'production')
              ? config.build.productionSourceMap
              : config.dev.cssSourceMap,
            extract: true
          })
        }
      },

      // 在utils.js已经配置好相关对extractTextPlugin的css抽取配置.通过extract: true即可触发
      // 使用extractTextPlugin的时候需要import对应的插件 在plugins中注册一下

      //fgh+ 使用extractTextPlugin 将 *.vue 进行结合
      // {
      //   test:/\.vue$/,
      //   loader: 'vue-loader',
      //   options: {
      //     loaders: {
      //       css: ExtractTextPlugin.extract({
      //         use: 'css-loader',
      //         fallback: 'vue-style-loader',
      //         publicPath: '../../../'
      //       }),
      //       less: ExtractTextPlugin.extract({
      //         use: 'css-loader!less-loader',
      //         fallback: 'vue-style-loader',
      //         publicPath: '../../../'
      //       })
      //     }
      //   }
      // },

      //fgh+ 外部引入的less/css进行打包
      // {
      //   test: /\.less$/,
      //   loader: 'css!less',
      //   // include: [resolve('assets')]
      // },
      // {
      //   test: /\.css$/,
      //   use: ExtractTextPlugin.extract({
      //     use: 'css-loader'
      //   })
      // },

      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test')]
      },
      /*
        关于.babelrc的配置
        部分可参考
        https://segmentfault.com/a/1190000008159877
        https://babeljs.cn/docs/plugins/preset-env/
        https://doc.webpack-china.org/loaders/babel-loader/

        1.babel-preset-env 是指动态的require浏览器所缺的转换babel插件.
        这个动态是通过文件里面的配置,
        "env", {
          //是否将模块编译为 amd cmd commonjs等
          "modules": false,
          "targets": {
            //指浏览器最新的2个版本 或者safari大于7的版本 >5%是指 市场率超过5%的浏览器
            "browsers": ["last 2 versions", "safari >= 7"]
          }
        }
        如果用了env 没有加任何配置的话 那么默认与 babel-preset-latest一样

        2.babel-preset-stage 有4个版本
        Stage 0 - 稻草人: 只是一个想法，可能是 babel 插件。
        Stage 1 - 提案: 初步尝试。
        Stage 2 - 初稿: 完成初步规范。
        Stage 3 - 候选: 完成规范和浏览器初步实现。
        Stage 4(隐藏版本表示已经完成 将会在新的一版所发布) 等同于es2015 es2016...

        3.在plugin中有 babel-plugin-transform-runtime 是动态的模块加载所需的转换模块
        因为如文档所说
        Babel 几乎可以编译所有时新的 JavaScript 语法，但对于 APIs 来说却并非如此。
        例如： Promise、Set、Map 等新增对象，Object.assign、Object.entries等静态方法。
        --说到runtime就会提到babel-polyfill
        (babel-polyfill 的做法是将全局对象通通污染一遍)

        babel-runtime 更像是分散的 polyfill 模块，我们可以在自己的模块里单独引入，它们不会在全局环境添加未实现的方法，
        只是，这样手动引用每个 polyfill 会非常低效。我们借助 Runtime transform 插件来自动化处理这一切。

      */
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  }
}


//获取多页面入口的路径
function getEntry (globPath) {
  var entries = {},
      basename, // *.js *对应的文件名
      tmp, // 路径数组
      pathname;

  //获取对应路径符合的文件 (数组) 同步方法
  glob.sync(globPath).forEach(function(item){
    //获取 *
    basename = path.basename(item, path.extname(item));
    //路径按照 '/' 进行划分 从倒数第三个开始 返回的是一个数组
    tmp = item.split('/').splice(-3);
    //返回文件夹路径 module/*
    pathname = tmp.splice(0, 1) + '/' + basename;
    //将数据存入对象
    entries[pathname] = item;
  })
/* entries格式
  { 'module/index': './src/module/index/index.js',
  'module/template': './src/module/template/template.js'
  }
  在webpack.prod.conf.js中抽取css是通过这个webpack插件 ExtractTextPlugin.
    那么下面在实例化的时候.
    filename: utils.assetsPath('css/[name].[contenthash].css')

  而这个[name] 就是关键 这个[name] 就等于 entry对象的key值.所以npm run build后，生成的目录多了一层module*/

return entries;
}
