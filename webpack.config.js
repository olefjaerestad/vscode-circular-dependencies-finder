// @ts-check

'use strict';

const path = require('path');
const miniCssExtractPlugin = require('mini-css-extract-plugin');

/** @typedef { {WEBPACK_WATCH?: boolean; WEBPACK_BUNDLE?: boolean; WEBPACK_BUILD?: boolean; [key: string]: any;} } BuildEnv **/
/** @typedef { {devtool?: string; env: BuildEnv; mode?: string; watch?: boolean; [key: string]: any;} } BuildArgs **/
/** @typedef {import('webpack').Configuration} WebpackConfig **/
/** @typedef { (env: BuildEnv, argv: BuildArgs) => WebpackConfig } WebpackConfigFunction **/

/**
 * @type { WebpackConfigFunction }
 */
const extensionConfig = (env, argv) => ({
  target: 'node', // vscode extensions run in a Node.js-context 📖 -> https://webpack.js.org/configuration/node/
  mode: 'none', // this leaves the source code as close as possible to the original (in dev we set to 'development', and when packaging to 'production')
  entry: './src/extension.ts', // the entry point of this extension, 📖 -> https://webpack.js.org/configuration/entry-context/
  output: {
    // the bundle is stored in the 'dist' folder (check package.json), 📖 -> https://webpack.js.org/configuration/output/
    path: path.resolve(__dirname, 'dist'),
    filename: 'extension.js',
    libraryTarget: 'commonjs2'
  },
  externals: {
    vscode: 'commonjs vscode', // the vscode-module is created on-the-fly and must be excluded. Add other modules that cannot be webpack'ed, 📖 -> https://webpack.js.org/configuration/externals/
    // modules added here also need to be added in the .vsceignore file
    ...vueSfcCompilerExternals()
  },
  resolve: {
    // support reading TypeScript and JavaScript files, 📖 -> https://github.com/TypeStrong/ts-loader
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader'
          }
        ]
      }
    ]
  },
  devtool: argv.mode === 'production' ? false : 'nosources-source-map'
});

/**
 * @type { WebpackConfigFunction }
 */
const webviewConfig = (env, argv) => ({
  target: 'web',
	mode: 'none',
  entry: './src/webview/webview.ts',
  output: {
    path: path.resolve(__dirname, 'dist/webview'),
    filename: 'webview.js',
    libraryTarget: 'module'
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  plugins: [
    new miniCssExtractPlugin({
      filename: 'webview.css',
    })
  ],
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader'
          }
        ]
      },
      {
        test: /\.s[ac]ss$/,
        use: [
          miniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: true
            },
          },
          'sass-loader',
        ]
      }
    ]
  },
  devtool: argv.mode === 'production' ? false : 'nosources-source-map',
  experiments: {
    outputModule: true
  }
});

function vueSfcCompilerExternals() {
  // `@vue/compiler-sfc` supports many different templating engines, but don't 
  // list them as dependencies (since it doesn't want to force users to install
  // all of them). Webpack, however, tries to resolve all of them by default,
  // which causes the build to fail. By marking them as externals, we tell
  // Webpack to ignore them, and not try to resolve them. Users who want to use
  // these template engines can install the ones they need separately. Users who
  // don't need them (probably most users) won't have to install them at all;
  // Regular SFC components work just fine without any of these.
  return [
    'arc-templates/dist/es5',
    'atpl',
    'babel-core',
    'bracket-template',
    'coffee-script',
    'dot',
    'dust',
    'dustjs-helpers',
    'dustjs-linkedin',
    'eco',
    'ect',
    'ejs',
    'haml-coffee',
    'hamlet',
    'hamljs',
    'handlebars',
    'htmling',
    'hogan.js',
    'jade',
    'jazz',
    'jqtpl',
    'just',
    'liquid-node',
    'liquor',
    'marko',
    'mote',
    'mustache',
    'nunjucks',
    'plates',
    'pug',
    'qejs',
    'ractive',
    'razor-tmpl',
    'react',
    'react-dom/server',
    'slm',
    'squirrelly',
    'swig',
    'swig-templates',
    'teacup/lib/express',
    'templayed',
    'then-jade',
    'then-pug',
    'tinyliquid',
    'toffee',
    'twig',
    'twing',
    'underscore',
    'vash',
    'velocityjs',
    'walrus',
    'whiskers',
  ].reduce((acc, module) => {
    // @ts-expect-error: Element implicitly has an 'any' type
    acc[module] = `commonjs ${module}`;
    return acc;
  }, {});
}

module.exports = [ extensionConfig, webviewConfig ];
