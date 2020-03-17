export default function () {
  return {
    plugins: [
      // commands
      require.resolve('./plugins/commands/version'),
      require.resolve('./plugins/commands/cordova'),
      require.resolve('@alitajs/native'),
      require.resolve('@alitajs/generate'),

      // bundle configs
      require.resolve('@umijs/plugin-request'),
      require.resolve('@umijs/plugin-dva'),
      require.resolve('@umijs/plugin-antd'),
      require.resolve('./plugins/features/appType'),
      require.resolve('./plugins/features/displayName'),
      require.resolve('./plugins/features/packageId'),
      require.resolve('@alitajs/hd'),
      require.resolve('@alitajs/routes'),
      require.resolve('@alitajs/router'),
      require.resolve('@alitajs/layout'),
      require.resolve('@alitajs/keep-alive'),
      require.resolve('@alitajs/main-path'),
      require.resolve('./plugins/defaultConfig'),
      require.resolve('./plugins/features/complexRoute'),
    ],
  };
}
