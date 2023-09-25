import { defineConfig } from 'umi';
import plugins from './plugins';
import proxy from './proxy';
import routes from './routes';

/**
 * 构建时配置
 */
const isProd = process.env.UMI_ENV?.startsWith('_prd');
const isLocal = process.env.UMI_ENV?.startsWith('_local');

export default defineConfig({
  title: 'ChatUI',
  routes,
  proxy,
  ...plugins,
  devtool: isProd ? false : 'source-map',
  hash: !isLocal,
  jsMinifier: 'esbuild',
  npmClient: 'pnpm',
  icons: { autoInstall: {} },
  externals: {
    // '@chatui/core': 'ChatUI',
  },

  // 扩展 babel 插件
  extraBabelPlugins: isProd ? ['transform-remove-console'] : [],

  // 扩展 Umi 内置 webpack 配置
  chainWebpack(memo, { env }) {
    return memo;
  },
});
