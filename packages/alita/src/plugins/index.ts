import path from 'path';
import eslintFormatter from 'react-dev-utils/eslintFormatter';
const defaultOptions = {
  umi: { dva: true, antd: true },
  menu: {
    build: path.resolve('.', './src/menus.json'),
  }
};

export default function (api) {
  const { debug } = api;
  const options = api.config;
  const { umi = {}, appType = "pc" } = options;

  const opts = {
    ...defaultOptions, ...options, umi: {
      ...defaultOptions.umi, ...umi, hd: appType === 'h5'
    }
  };

  if (process.env.ALITA_ESLINT && process.env.ALITA_ESLINT !== 'none') {
    console.log('use alita eslint');

    api.chainWebpackConfig(config => {
      const eslintOptions = {
        formatter: eslintFormatter,
        baseConfig: {
          extends: [require.resolve('eslint-config-alita')],
        },
        ignore: false,
        eslintPath: require.resolve('eslint'),
        useEslintrc: false,
      };

      config.module
        .rule('eslint-alita')
        .test(/\.(js|jsx)$/)
        .include.add(api.paths.cwd)
        .end()
        .exclude
        .add(/node_modules/)
        .end()
        .enforce('pre')
        .use('eslint-loader')
        .loader(require.resolve('eslint-loader'))
        .options(eslintOptions);
    });
  }

  function getId(id) {
    return `alita:${id}`;
  }

  function noop() {
    return true;
  }
  const reactPlugin = require('umi-plugin-react').default;

  reactPlugin(api, opts.umi);

  api._registerConfig(() => {
    return () => {
      return {
        name: 'appType',
        validate: noop,
        onChange(newConfig) {
          api.service.restart(`umi config changed`);
        },
      };
    };
  });

  api._registerConfig(() => {
    return () => {
      return {
        name: 'umi',
        validate: noop,
        onChange(newConfig) {
          api.service.restart(`umi config changed`);
        },
      };
    };
  });

  if (opts.pagePath) {
    api._registerConfig(() => {
      return () => {
        return {
          name: 'pagePath',
          validate: noop,
          onChange(newConfig) {
            api.service.restart(`pagePath config changed`);
          },
        };
      };
    });
    process.env.PAGES_PATH = opts.pagePath;
  }

  const plugins = {
    menu: () => require('umi-plugin-menus').default,
    authority: () => require('./authorize').default,
    prettier: () => require('./prettier').default,
    whale: () => require('./whale').default,
    alitagenerate: () => require('./generate/index').default,
  };

  Object.keys(plugins).forEach(key => {
    api.registerPlugin({
      id: getId(key),
      apply: plugins[key](),
      opts: opts[key],
    });

    api._registerConfig(() => {
      return () => {
        return {
          name: key,
          validate: noop,
          onChange(newConfig) {
            api.service.restart(`${name} changed`);
          },
        };
      };
    });
  });
}
