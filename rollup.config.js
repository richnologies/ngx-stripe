import resolve from 'rollup-plugin-node-resolve';

// Add here external dependencies that actually you use.
const globals = {
  '@angular/core': 'ng.core',
  '@angular/common': 'ng.common',
  rxjs: 'Rx',
  'rxjs/operators': 'Rx'
};

export default {
  entry: './dist/modules/ngx-stripe.es5.js',
  dest: './dist/bundles/ngx-stripe.umd.js',
  format: 'umd',
  exports: 'named',
  moduleName: 'ng.stripe',
  plugins: [resolve()],
  external: Object.keys(globals),
  globals: globals,
  onwarn: () => {
    return;
  }
};
