import typescript from '@rollup/plugin-typescript';

import commonjs from '@rollup/plugin-commonjs';
import autoExternal from 'rollup-plugin-auto-external';
import dts from 'rollup-plugin-dts';
import packageJSON from './package.json' with { type: 'json' };

/** @type {import('rollup').RollupOptions} */
export default [
  {
    input: 'src/index.ts',
    output: {
      file: packageJSON.exports['.'].require,
      format: 'commonjs',
    },
    plugins: [commonjs(), typescript(), autoExternal()],
  },
  {
    input: 'src/index.ts',
    output: {
      file: packageJSON.exports['.'].import,
      format: 'es',
    },
    plugins: [typescript(), autoExternal()],
  },
  {
    input: 'src/index.ts',
    output: {
      file: packageJSON.exports['.'].types.require,
      format: 'commonjs',
    },
    plugins: [commonjs(), dts()],
  },
  {
    input: 'src/index.ts',
    output: {
      file: packageJSON.exports['.'].types.import,
      format: 'module',
    },
    plugins: [dts()],
  },
];
