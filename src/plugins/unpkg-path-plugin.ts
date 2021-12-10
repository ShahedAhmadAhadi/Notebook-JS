import axios from 'axios';
import * as esbuild from 'esbuild-wasm';

export const unpkgPathPlugin = () => {
  return {
    name: 'unpkg-path-plugin',
    setup(build: esbuild.PluginBuild) {
      build.onResolve({ filter: /.*/ }, async (args: any) => {
        console.log('onResole', args);
        if (args.path === 'index.js') {
          return { path: args.path, namespace: 'a' };
          
        }
        if (args.path.includes('./') || args.paths.includes('../')) {
          return { path: new URL(args.path, args.importer + '/').href, namespace: 'a'}
          
        }
        // else if (args.path === 'tiny-test-pkg') {
        //   return { path: `https://unpkg.com/tiny-test-pkg@1.0.0/index.js`, namespace: 'a'}
        // }
      });

      build.onLoad({ filter: /.*/ }, async (args: any) => {
        console.log('onLoad', args);

        if (args.path === 'index.js') {
          return {
            loader: 'jsx',
            contents: `
              const message = require('tiny-test-pkg');
              console.log(message);
            `,
          };
        }
        const { data } = await axios.get(args.path)
        return {
          loader: 'jsx',
          contents: data
        }
      });
    },
  };
};
