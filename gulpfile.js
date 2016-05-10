'use strict';

let gulp = require('gulp'),
  del = require('del'),
  browserSync = require('browser-sync'),
  reload = browserSync.reload,
  $ = require('gulp-load-plugins')({
    lazy: true
  });

gulp.task('browser-sync', ['nodemon'], function() {
  browserSync.init({
    proxy: "localhost:8080", // local node app address
    port: 8081, // use *different* port than above
    online: true,
    notify: true
  });
});

gulp.task('nodemon', function(cb) {
  let called = false;

  return $.nodemon({
    script: 'server.js',
    ignore: ['node_modules/'],
    ext: 'js html css'
  }).on('start', function() {
    if (!called) {
      called = true;
      cb();
    }
  }).on('restart', function() {
    setTimeout(function() {
      reload({
        stream: false
      });
    }, 1000);
  });
});

gulp.task('dev-server', ['browser-sync']);