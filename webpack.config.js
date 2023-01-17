const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');

const htmlPageNames = ['index', 'catalog', 'form'];
const multipleHtmlPlugins = htmlPageNames.map(name => {
  return new HtmlWebpackPlugin({
    template: `./source/${name}.html`, // путь до файла
    filename: `${name}.html` // имя файла
  })
});

const DIR_SRC = path.resolve(__dirname, 'source');

module.exports = {
  entry: './source/js/index.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'main.min.js',
    clean: true
  },
  performance: {
    hints: false
  },
  resolve: {
    symlinks: false,
    modules: ['node_modules'],
    extensions: ['.js', '.json', '.less', '.css']
  },
  mode: 'production',
  devServer: {
    host  : '0.0.0.0',
    port  : 8085,
    http2 : false,
    https : false,
    client: {
      logging: 'warn'
    },
    compress          : false,
    historyApiFallback: true
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        loader: 'html-loader'
      },
      {
        test   : /\.less$/,
        include: DIR_SRC,
        use    : [MiniCssExtractPlugin.loader, {
          loader: 'css-loader',
          options: {
            modules: {
              localIdentName: '[local]'
            }
          }
        }, {
          loader: 'less-loader',
          options: {
            lessOptions: {
              javascriptEnabled: true
            }
          }
        }]
      },
      {
        test     : /\.(png|jpg|jpeg|svg)$/,
        include  : DIR_SRC,
        type     : 'asset',
        generator: {
          filename: 'assets/[name][ext]'
        },
        loader: ImageMinimizerPlugin.loader,
        enforce: "pre",
        options: {
          minimizer: {
            implementation: ImageMinimizerPlugin.imageminMinify,
            options: {
              plugins: [
                "imagemin-gifsicle",
                "imagemin-mozjpeg",
                "imagemin-pngquant",
                "imagemin-svgo"
              ],
            },
          },
        }
      }
    ]
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel     : true,
        terserOptions: {
          sourceMap: false,
          ie8      : false,
          output   : {
            comments: false
          }
        }
      }),
      new CssMinimizerPlugin({
        parallel: true
      })
    ],
  },

  plugins: [
    ...multipleHtmlPlugins,
    new MiniCssExtractPlugin({
      filename: "[name].min.css",
    }),
    new FaviconsWebpackPlugin({
      logo: './source/favicon.svg',
      mode: 'webapp',
      favicons: {
        appName: 'Cat energy',
        icons: {
          android: true,
          favicons: true,
          windows: true,
          yandex: true
        }
      }
    }),
  ]
};
