require('./check-versions')()

var config = require('../config')
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
}

// https://github.com/sindresorhus/opn
// opn 可以强制打开浏览器并跳转到指定 url 的插件
var opn = require('opn')
// node自带的文件路径工具
var path = require('path')
var express = require('express')
var webpack = require('webpack')
var proxyMiddleware = require('http-proxy-middleware')
var webpackConfig = process.env.NODE_ENV === 'testing'
  ? require('./webpack.prod.conf')
  : require('./webpack.dev.conf')

// 端口号
var port = process.env.PORT || config.dev.port
// 判断是否自动打开浏览器(双感叹号的作用为更好的转换Boolean)
var autoOpenBrowser = !!config.dev.autoOpenBrowser
// 配置文件中 http代理配置
// https://github.com/chimurai/http-proxy-middleware
var proxyTable = config.dev.proxyTable

// 启动 express服务
var app = express()
// 启动wp 服务
var compiler = webpack(webpackConfig)

// 可以将编译后的文件暂存到内存中的插件
/*
    作用:
    1.不需要一直寫入磁碟，所有產生的結果會直接存在記憶體
    2.If files changed in watch mode, the middleware delays requests until compiling has completed.
    3.Supports hot module reload

    https://github.com/webpack/webpack-dev-middleware
*/
var devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  quiet: true
})

// Hot-reload 热重载插件
/*
    https://segmentfault.com/a/1190000005614604
*/
// https://github.com/glenjamin/webpack-hot-middleware
var hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: () => {}
})


// 强制页面刷新, 当html-webpack-plugin template 发生变化的时候
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({ action: 'reload' })
    cb()
  })
})

// proxy代理的相关配置,并挂载到app(express)服务上
Object.keys(proxyTable).forEach(function (context) {
  var options = proxyTable[context]

  /*
    判断设置的代理如果仅为字符串,表示只设置了代理的url
    所以将url进行处理 => target: url
    (具体配置项 参照上面的github地址)
  */
  if (typeof options === 'string') {
    options = { target: options }
  }
  app.use(proxyMiddleware(options.filter || context, options))
})


// 使用 connect-history-api-fallback 匹配资源
// 如果不匹配就可以重定向到指定地址
// https://github.com/bripkens/connect-history-api-fallback (用于spa的应用)
app.use(require('connect-history-api-fallback')())

// 将上面配置好的 webpack-dev-middleware 挂在到 express 服务上
app.use(devMiddleware)

// 将 Hot-reload 挂在到 express 服务上
app.use(hotMiddleware)

// 拼接 static 文件夹的静态资源路径 (在posix上面执行join的方法)
/*
    参照api http://nodejs.cn/api/path.html#path_path_posix
*/
var staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
/*
    将静态资源文件所在的目录作为参数传递给 express.static 中间件就可以提供静态资源文件的访问了。
    可通过 http://localhost.com:port/staticPath/静态文件夹目录 访问

    http://www.expressjs.com.cn/starter/static-files.html
*/
app.use(staticPath, express.static('./static'))

var uri = 'http://localhost:' + port + '/module/index.html'

var _resolve
var readyPromise = new Promise(resolve => {
  _resolve = resolve
})

console.log('> Starting dev server...')

/*
  这个是上面 webpack-dev-middleware 成功执行之后的回调函数
  Executes a callback function when the compiler bundle is valid, typically after compilation.
*/
devMiddleware.waitUntilValid(() => {
  console.log('> Listening at ' + uri + '\n')
  // 当检测到自动打开浏览器的标识, 触发上面的插件
  if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
    opn(uri)
  }
  _resolve()
})

/*
  与 var server = http.createServer(app).listen(port) 一样,
  按照文档的意思
  监听端口号的意义在于, 通过node的http服务作为回调去处理发出去的请求.
  便于同一套代码可以在开发过程中应对http或者https的协议

  http://www.expressjs.com.cn/4x/api.html#app.listen
*/
var server = app.listen(port)

module.exports = {
  ready: readyPromise,
  close: () => {
    server.close()
  }
}
