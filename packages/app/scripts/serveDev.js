// Copied from https://github.com/respond-framework/rudy/blob/22d0a9d8d28e1e74aaf04bb48b5e0f65a609cf81/packages/boilerplate/server/serveDev.js

import 'source-map-support/register';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import express from 'express';
import nocache from 'nocache';
import favicon from 'serve-favicon';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpackHotServerMiddleware from 'webpack-hot-server-middleware';
import makeConfig from './webpack.config.babel';

const clientConfig = makeConfig({ server: false });
const serverConfig = makeConfig({ server: true });

const { publicPath, outputPath } = clientConfig.output;

const app = express();

app.use(favicon('./public/favicon.ico'));
app.use(nocache());

// UNIVERSAL HMR + STATS HANDLING GOODNESS:

const multiCompiler = webpack([clientConfig, serverConfig]);
const clientCompiler = multiCompiler.compilers[0];

app.use(
  webpackDevMiddleware(multiCompiler, {
    publicPath,
    serverSideRender: true,
    stats: 'minimal',
  }),
);
app.use(webpackHotMiddleware(clientCompiler));

// keeps serverRender updated with arg: { clientStats, outputPath }
app.use(
  webpackHotServerMiddleware(multiCompiler, {
    serverRendererOptions: { outputPath },
  }),
);

app.listen(3000, () => {
  // eslint-disable-next-line no-console
  console.log('Listening @ http://localhost:3000/');
});