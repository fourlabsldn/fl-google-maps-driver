// List all available tasks
const path = require('path');
const organiser = require('gulp-organiser');

const srcRoot = './src';
const destRoot = './dest';

organiser.registerAll('./tasks', {
  transpile: {
    src: path.join(srcRoot, 'index.js'),
    dest: destRoot,
    watch: srcRoot,
    config: { format: 'umd', moduleName: 'flMaps', external: ['lodash/fp'] },
  },

  'browser-sync': {
    src: '.', // it doesn't matter, it's just so the task object is not ignored.
    reloadOn: ['transpile'],
    startPath: 'examples/index.html',
  },
});
