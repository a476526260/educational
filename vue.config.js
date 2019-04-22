'use strict';
module.exports = {
  lintOnSave: undefined,
  publicPath: '',
  assetsDir: 'assets',
  indexPath: 'index.html',
  productionSourceMap: false,
  devServer: {
    port: 8080,
    open: false,
    proxy: {
      '/public': {
        target: 'http://teach.shu-acca.com',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/public': '/public'
        }
      },
      '/uploads': {
        target: 'http://teach.shu-acca.com',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/uploads': '/uploads'
        }
      },
      '/admin': {
        target: 'http://teach.shu-acca.com',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/admin': '/admin'
        }
      }
    }
  },
}
