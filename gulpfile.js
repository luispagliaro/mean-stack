'use strict';

var gulp = require('gulp'),
  del = require('del'),
  browserSync = require('browser-sync'),
  minifyCSS = require('gulp-clean-css'),
  jshint = require('gulp-jshint'),
  reload = browserSync.reload,
  ngAnnotate = require('gulp-ng-annotate'),
  $ = require('gulp-load-plugins')({
    lazy: true
  });

gulp.task('browser-sync', ['nodemon'], function() {
  browserSync.init({
    proxy: 'localhost:' + process.env.PORT, // local node app address
    port: 8081, // use *different* port than above
    online: true,
    notify: true
  });
});

gulp.task('set-port', function() {
    return process.env.PORT = 8080;
});

gulp.task('set-dev-node-env', function() {
    return process.env.NODE_ENV = 'development';
});

gulp.task('set-prod-node-env', function() {
    return process.env.NODE_ENV = 'production';
});

gulp.task('nodemon', ['set-port'], function(cb) {
  var called = false;

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

gulp.task('dev-server', ['set-dev-node-env', 'browser-sync']);

gulp.task('prod-server', ['set-prod-node-env']);

gulp.task('css', function() {
  return gulp.src('client/assets/css/*.css')
    .pipe(minifyCSS())
    .pipe($.rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('public/assets/css'));
});

gulp.task('js', function() {
  return gulp.src(['server.js', 'config.js', 'server/**/*.js', 'client/app/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('angular', function() {
  return gulp.src(['client/app/**/*.js'])
    .pipe(ngAnnotate())
    .pipe($.concat('app.min.js'))
    .pipe($.uglify())
    .pipe(gulp.dest('public/dist'));
});