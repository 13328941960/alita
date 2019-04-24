import { dirname } from 'path';

process.env.ESLINT = 'none';
// process.env.ALITA_ESLINT = 'true';
process.env.UMI_PLUGINS = require.resolve('./plugins/index');
// process.env.DEBUG = 'umi*,af-webpack*';
const p = process.argv.slice(2);

// 这里做了拦截，因为version命令冲突了
if (p[0] === 'version' || p[0] === '-v' || p[0] === '-version') {
  p[0] = 'alitaVersion'
}

process.env.ALITA_DIR = dirname(require.resolve('../package'));
const umiBinPath = require.resolve('umi/bin/umi');
require('child_process').fork(umiBinPath, p, {
  stdio: 'inherit',
});
