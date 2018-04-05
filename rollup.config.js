import resolve from 'rollup-plugin-node-resolve';
import sourcemaps from 'rollup-plugin-sourcemaps';

const globals = {
  '@angular/core': 'ng.core',
  '@angular/common': 'ng.common',
  'rxjs/Observable': 'Rx',
  'rxjs/Observer': 'Rx',
  'rxjs/add/observable/combineLatest': 'Rx',
  'rxjs/add/observable/fromPromise': 'Rx',
  'rxjs/add/observable/of': 'Rx',
  'rxjs/add/operator/map': 'Rx',
  'rxjs/add/operator/filter': 'Rx',
  'rxjs/add/operator/switchMap': 'Rx',
  'rxjs/add/operator/first': 'Rx',
  'rxjs/Observable': 'Rx',
  'rxjs/BehaviorSubject': 'Rx'
};

export default {
  external: Object.keys(globals),
  plugins: [resolve(), sourcemaps()],
  onwarn: () => {
    return;
  },
  output: {
    format: 'umd',
    name: 'ng.stripe',
    globals: globals,
    sourcemap: true,
    exports: 'named',
    amd: { id: 'ngx-stripe' }
  }
};
