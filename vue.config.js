"use strict";

// vue.config.js 是一个可选的配置文件，如果项目的 (和 package.json 同级的) 根目录中存在这个文件，那么它会被 @vue/cli-service 自动加载。你也可以使用 package.json 中的 vue 字段，但是注意这种写法需要你严格遵照 JSON 的格式来写。

const path = require("path");
const defaultSettings = require("./src/settings.js");

function resolve(dir) {
  //__dirName:  是Node中的一个全局变量，用来确定当前运行的文件所在的目录。 在开发时，这个目录通常跟你的当前工作目录cwd是同一个目录，但是在生产环境中，Node可能是从另外一个目录中运行的。 用__dirname 有助于保持路径在各种环境中的一致性
  //__dirname 是一个环境变量，它告诉您包含当前正在执行的文件的目录的绝对路径。
  return path.join(__dirname, dir);
}

const name = defaultSettings.title || "vue Admin Template"; // page title

// If your port is set to 80,
// use administrator privileges to execute the command line.
// For example, Mac: sudo npm run
// You can change the port by the following methods:
// port = 9528 npm run dev OR npm run dev --port = 9528
const port = process.env.port || process.env.npm_config_port || 9528; // dev port

// All configuration item explanations can be find in https://cli.vuejs.org/config/
module.exports = {
  /**
   * You will need to set publicPath if you plan to deploy your site under a sub path,
   * for example GitHub Pages. If you plan to deploy your site to https://foo.github.io/bar/,
   * then publicPath should be set to "/bar/".
   * In most cases please use '/' !!!
   * Detail: https://cli.vuejs.org/config/#publicpath
   */
  publicPath: "/",
  outputDir: "dist",
  assetsDir: "static",
  // lintOnSave: process.env.NODE_ENV === 'development',
  lintOnSave: false,
  productionSourceMap: false,
  /**
 * 我们 使用了 VUE_APP_BASE_APi 作为请求的前缀。 
 * 当我们打包生产环境 是 vue_app-base-api=/prod-api
 * 因此我们发送的所有的请求前面偶会带有 /prod-api.
 * 打包到生产环境的代码 是 没有 代理服务器的。 也就是说请求会直接发送到后端。
 * 而不会走代理。 代理只在dev环境下有效
 * 
 */
  devServer: {
    port: port,
    open: true,
    overlay: {
      warnings: false,
      errors: true,
    },
    // 配置代理服务器
    proxy: {
      "/dev-api": {
        target: "http://gmall-h5-api.atguigu.cn", // https://console.apipost.cn/apis/project/38101894-9551-44bd-c5e3-cfdfe9e9d0d6
        pathRewrite: { "^/dev-api": "" }, // 如果不希望传递/dev-api，则需要重写路径：
      },
    },
    //开启mock数据
    before: function (app, server, compiler) {
      console.log("vue-config.js.devserver.before");
      require("./mock/mock-server.js");
    },
  },
  configureWebpack: {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    name: name,
    resolve: {
      alias: {
        "@": resolve("src"),
      },
    },
    //配置生成sourceMap // 在生产环境中不输出 source map  devtool: isProduction?undefined:'source-map'
    devtool: "source-map",
  },
  chainWebpack(config) {
    // it can improve the speed of the first screen, it is recommended to turn on preload
    config.plugin("preload").tap(() => [
      {
        rel: "preload",
        // to ignore runtime.js
        // https://github.com/vuejs/vue-cli/blob/dev/packages/@vue/cli-service/lib/config/app.js#L171
        fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
        include: "initial",
      },
    ]);

    // when there are many pages, it will cause too many meaningless requests
    config.plugins.delete("prefetch");

    /**
     * vue.config.js中配置了svg-sprite-loader 插件会将 require到的svg文件变为 
     样式名称 比如 dashboard.svg 变成#icon-dashboard ，因此我们可以使用样式名引用svg文件
     */
    // set svg-sprite-loader
    config.module.rule("svg").exclude.add(resolve("src/icons")).end();
    config.module
      .rule("icons")
      .test(/\.svg$/)
      .include.add(resolve("src/icons"))
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]",
      })
      .end();

    config.when(process.env.NODE_ENV !== "development", (config) => {
      config
        .plugin("ScriptExtHtmlWebpackPlugin")
        .after("html")
        .use("script-ext-html-webpack-plugin", [
          {
            // `runtime` must same as runtimeChunk name. default is `runtime`
            inline: /runtime\..*\.js$/,
          },
        ])
        .end();
      config.optimization.splitChunks({
        chunks: "all",
        cacheGroups: {
          libs: {
            name: "chunk-libs",
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: "initial", // only package third parties that are initially dependent
          },
          elementUI: {
            name: "chunk-elementUI", // split elementUI into a single package
            priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
            test: /[\\/]node_modules[\\/]_?element-ui(.*)/, // in order to adapt to cnpm
          },
          commons: {
            name: "chunk-commons",
            test: resolve("src/components"), // can customize your rules
            minChunks: 3, //  minimum common number
            priority: 5,
            reuseExistingChunk: true,
          },
        },
      });
      // https:// webpack.js.org/configuration/optimization/#optimizationruntimechunk
      config.optimization.runtimeChunk("single");
    });
  },
};
