const CopyPlugin = require('copy-webpack-plugin');

const projectName = process.env.VUE_APP_CURRENT_PROJECT

module.exports = {
  outputDir: `dist-${projectName}`,
  pages: {
    index: {
      entry: "src/main.js",
      template: `${projectName}/public/index.html`,
      filename: "index.html",
    },
  },
  configureWebpack: {
    plugins: [
      new CopyPlugin({
        patterns: [
          { from: `${projectName}/public`, to: '' },
        ],
      }),
    ],
  }
};
