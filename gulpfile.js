'use strict';

var gulp = require('gulp'),
  del = require('del'),
  browserSync = require('browser-sync'),
  minifyCSS = require('gulp-clean-css'),
  jshint = require('gulp-jshint'),
  reload = browserSync.reload,
  ngAnnotate = require('gulp-ng-annotate'),
  angularFilesort = require('gulp-angular-filesort'),
  series = require('stream-series'),
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

gulp.task('dev-server', ['set-dev-node-env', 'inject', 'browser-sync']);

gulp.task('prod-server', ['set-prod-node-env', 'minify-copy', 'copy-resources', 'nodemon']);

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

gulp.task('minify-css', function() {
  return gulp.src('client/assets/css/*.css')
    .pipe(minifyCSS())
    .pipe($.rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('public/assets/css'));
});

gulp.task('minify-angular', function() {
  return gulp.src(['client/app/**/*.js', 'client/app/*.js'])
    .pipe(ngAnnotate())
    .pipe($.concat('app.min.js'))
    .pipe($.uglify())
    .pipe(gulp.dest('public/app'));
});

gulp.task('minify-copy', ['minify-angular', 'minify-css']);

gulp.task('copy-angular-views', function() {
  return gulp
    .src(['client/app/views/**/*'], {
      base: 'client'
    })
    .pipe(gulp.dest('public'))
});

gulp.task('copy-css-vendors', function() {
  return gulp
    .src(['node_modules/bootstrap/dist/css/bootstrap.min.css',
      'node_modules/bootstrap/dist/css/bootstrap.min.css.map',
      'node_modules/font-awesome/css/font-awesome.min.css'
    ])
    .pipe(gulp.dest('public/assets/css/vendors'));
});

gulp.task('copy-js-vendors', function() {
  return gulp
    .src(['node_modules/angular/angular.min.js', 'node_modules/angular-route/angular-route.min.js', 'node_modules/angular/angular.min.js.map', 'node_modules/angular-route/angular-route.min.js.map'])
    .pipe(gulp.dest('public/assets/js/vendors'));
});

gulp.task('copy-resources', ['copy-angular-views', 'copy-css-vendors', 'copy-js-vendors'], function() {
  var target = gulp.src('public/app/views/index.html'),
    vendors = gulp.src(['public/assets/js/vendors/angular.min.js', 'public/assets/js/vendors/angular-route.min.js'], {
      read: false
    }),
    app = gulp.src(['public/app/app.min.js'], {
      read: false
    }),
    css = gulp.src(['public/assets/css/vendors/**/*.css', 'public/assets/css/*.css'], {
      read: false,
    });

  return target
    .pipe($.inject(series(vendors, app, css), {
      ignorePath: 'public'
    }))
    .pipe(gulp.dest('public/app/views'));
});

gulp.task('inject', function() {
  var target = gulp.src('client/app/views/index.html'),
    vendors = gulp.src(['node_modules/angular/angular.js', 'node_modules/angular-route/angular-route.js'], {
      read: false
    }),
    app = gulp.src(['client/app/**/*.js']).pipe(angularFilesort()),
    css = gulp.src(['node_modules/bootstrap/dist/css/bootstrap.min.css', 'node_modules/font-awesome/css/font-awesome.min.css', 'assets/css/*.css'], {
      read: false
    });

  return target
    .pipe($.inject(series(vendors, app, css), {
      ignorePath: 'client'
    }))
    .pipe(gulp.dest('client/app/views'));
});