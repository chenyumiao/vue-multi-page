/*
    该文件在很多文件中都用到，是主要的配置文件，包含静态文件的路径、是否开启sourceMap等。
    其中，分为两个部分dev（开发环境的配置）和build（生产环境的配置）。

    http://vuejs-templates.github.io/webpack for documentation.
*/
var path = require('path')

module.exports = {
  build: { //生产环境
    //构建环境(用于前面env表示环境)
    env: require('./prod.env'),
    // path.resolve的方法是用于将相对路径转为绝对路径
    /*
        它可以接受多个参数，依次表示所要进入的路径，直到将最后一个参数转为绝对路径。
        如果根据参数无法得到绝对路径，就以当前所在路径作为基准。除了根目录，该方法的返回值都不带尾部的斜杠。

        path.resolve(__dirname, '../dist/index.html'),
        表示为 __dirname的../的dis/index.html
    */
    index: path.resolve(__dirname, '../dist/index.html'),
    // 构建输出的静态资源路径
    assetsRoot: path.resolve(__dirname, '../dist'),
    // 构建build出来后的资源存放文件夹的名称
    assetsSubDirectory: 'static',
    assetsPublicPath: '../', //fgh+ 资源引用的路径(运用于多页面build)
    // 是否开启source map
    productionSourceMap: true,
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin

    // 默认关闭 gzip，因为很多流行的静态资源主机，例如 Surge、Netlify，已经为所有静态资源开启gzip
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],
    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  },
  dev: { //开发环境
    env: require('./dev.env'),
    // 端口号
    port: 8008,
    // 是否自动打开浏览器
    autoOpenBrowser: true,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      '/api': {
        target: 'https://insmetest.jd.com/apis/',//设置你调用的接口域名和端口号
        changeOrigin: true,     //跨域
        pathRewrite: {
          '^/api': '/'          //这里理解成用‘/api’代替target里面的地址，后面组件中我们掉接口时直接用api代替 比如我要调用'http://10.1.5.11:8080/xxx/duty?time=2017-07-07 14:57:22'，直接写‘/api/xxx/duty?time=2017-07-07 14:57:22’即可
        }
      }
        //fgh+ 代理使用
        /*
            param:
            *:   表示挂代理时,识别的请求前缀
            url: 表示代理的地址
            例如
            '/api': {
                target: 'http://www.baidu.com',
                changeOrigin: true,
                pathRewrite: {
                    '^/api': '/api'
                } //=> localhost:8000/api => http://www.baidu.com/api

                // 会在启动服务的时候在终端触发以下的函数
                // onProxyRes: function(proxyRes, req, res){
                //     console.log('-------proxy前');
                //     console.log(proxyRes);
                //     console.log(req);
                //     console.log(res);
                // }
            }

            代理的proxy格式可以参照以下github
            https://github.com/chimurai/http-proxy-middleware
        */

    },
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.

    // 默认情况下，关闭 CSS Sourcemaps，因为使用相对路径会报错。
    cssSourceMap: false
  }
}
