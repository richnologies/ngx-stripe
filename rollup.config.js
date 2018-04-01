import resolve from 'rollup-plugin-node-resolve';

// Add here external dependencies that actually you use.
const globals = {
  '@angular/core': 'ng.core',
  '@angular/common': 'ng.common',
  'rxjs/add/observable/combineLatest': 'Rx',
  'rxjs/add/observable/fromPromise': 'Rx',
  'rxjs/add/observable/of': 'Rx',
  'rxjs/add/operator/map': 'Rx',
  'rxjs/add/operator/filter': 'Rx',
  'rxjs/add/operator/switchMap': 'Rx',
  'rxjs/add/operator/publishLast': 'Rx',
  'rxjs/add/operator/refCount': 'Rx',
  'rxjs/Observable': 'Rx',
  'rxjs/BehaviorSubject': 'Rx'
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
