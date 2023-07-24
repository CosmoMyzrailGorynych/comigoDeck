import {rollup, watch} from 'rollup';
import svelte from 'rollup-plugin-svelte';
import css from 'rollup-plugin-css-only';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import sprite from 'rollup-plugin-svg-sprite';

import fs from 'fs-extra';

import svelteConfig from './svelte.config.mjs';

import builtinModules from 'builtin-modules';
import {$} from 'execa';
import nwbuild from 'nw-builder';
const nwVersion = '0.72.0';

const production = process.argv.includes('build');

const baseNwSettings = {
  version: nwVersion,
  srcDir: './public/',
  glob: false,
  icon: 'favicon.ico',
  app: {
    icon: 'favicon.ico'
  }
};
function runNw() {
  nwbuild({
    ...baseNwSettings,
    mode: 'run',
    flavor: 'sdk',
  })
};
const pack = async () => {
  await fs.remove('./build');
  return Promise.all([/*'linux', 'osx',*/ 'win'].map(platform => {
    return nwbuild({
      ...baseNwSettings,
      mode: 'build',
      flavor: 'normal',
      production: true,
      outDir: `./build/${platform}/`,
      platform
    })
  }));
};

import { createRequire } from "module";
const require = createRequire(import.meta.url);
const appPkg = require('./public/package.json');

const externalModules = [
  ...builtinModules,
  ...Object.keys(appPkg.dependencies)
];

/**
 * @type {RollupOptions}
 */
const rollupConfig = {
  logLevel: 'info',
  external: externalModules,
  input: [
    'src/main.ts',
    'src/bgPage.ts'
  ],
  output: {
    sourcemap: !production,
    format: 'cjs',
    dir: 'public/build/',
    globals: externalModules.reduce((obj, key) => {
      obj[key] = `require('${key}')`;
      return obj;
    }, {})
  },
  plugins: [
    svelte(svelteConfig),
    css({
      output: 'bundle.css'
    }),
    sprite({
      outputFolder: 'public/build/',
    }),

    // If you have external dependencies installed from
    // npm, you'll most likely need these plugins. In
    // some cases you'll need additional configuration -
    // consult the documentation for details:
    // https://github.com/rollup/plugins/tree/master/packages/commonjs
    resolve({
      dedupe: ['svelte'],
      requireReturnsDefault: false,
      modulePaths: [
        './node_modules'
      ],
      extensions: [".mjs", ".js", ".svelte", ".ts"]
    }),
    commonjs({
      include: [
        './node_modules/**'
      ]
    }),
    typescript({ sourceMap: !production }),
    production && terser(),
  ],
  watch: {
    clearScreen: false
  },
};

const build = async () => {
  await rollup(rollupConfig).then(bundle => bundle.generate(rollupConfig.output));
};

if (process.argv.includes('build')) {
  await $({
    cwd: './public'
  })`npm install`;
  await build();
  await pack();
} else if (process.argv.includes('dev')) {
  await ($({
    cwd: './public'
  })`npm install`).pipeStdout(process.stdout);
  await build();
  runNw();
  watch(rollupConfig).on('change', async ({result}) => {
    await build();
    runNw();
  });
} else {
  console.error('Usage: npm run build | npm run dev');
}
