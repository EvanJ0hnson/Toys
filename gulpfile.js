'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')({
      pattern: ['*']
    });

var bs = $.browserSync.create();
var config = {
  buildRoot: './www/',
  srcRoot: './src/',
  proxyAdress: 'toys.loc.ru',
  libVendorJS: {
    jquery: './bower_components/jquery/dist/jquery.min.js',
    matchHeight: './bower_components/matchHeight/jquery.matchHeight-min.js',
    bxSlider: './bower_components/dw-bxslider-4/dist/jquery.bxslider.min.js',
    lazyLoad: './bower_components/jquery.lazyload/jquery.lazyload.js'
    },
  libVendorAssets: {
    bxSlider_ajaxLoader: './bower_components/dw-bxslider-4/dist/images/bx_loader.gif'
  }
}

gulp.task('sync', function(cb) {
  bs.init({
    proxy: config.proxyAdress,
    open: false,
    notify: false,
    ghostMode: false
  }, cb);
});

gulp.task('stylus', function() {
  return gulp.src(config.srcRoot + 'styl/style.styl')
    .pipe($.plumber())
    .pipe($.stylus({
      compress: true
    }))
    .pipe($.autoprefixer({
      browsers: ['> 1%', 'last 2 versions'],
      cascade: false
    }))
    // .pipe(csscomb())
    .pipe($.rename('style.min.css'))
    .pipe(gulp.dest(config.buildRoot + 'css'));
});

gulp.task('jade', function() {
  // bs.notify("Compiling JADE, please wait!");
  return gulp.src([config.srcRoot + 'jade/*.jade',
                  config.srcRoot + 'jade/admin/*.jade'],
                  { base: config.srcRoot + 'jade'})
    .pipe($.plumber())
    .pipe($.jade({
      pretty: false
    }))
    .pipe($.htmlmin({
      collapseWhitespace: true,
      removeComments: true,
      minifyJS: true,
      minifyCSS: true
    }))
    .pipe(gulp.dest(config.buildRoot));
});

gulp.task('js', function() {
  return gulp.src([config.libVendorJS.jquery,
                   config.libVendorJS.matchHeight,
                   config.libVendorJS.bxSlider,
                   config.libVendorJS.lazyLoad,
                   config.srcRoot + 'js/*.js'])
    .pipe($.plumber())
    .pipe($.concat('scripts.min.js'))
    .pipe(gulp.dest(config.buildRoot + 'js/'));
});

gulp.task('json', function() {
  return gulp.src(config.srcRoot + 'json/[^!]*.json')
    .pipe($.plumber())
    .pipe(gulp.dest(config.buildRoot + 'json'));
});

gulp.task('php', function() {
  return gulp.src(config.srcRoot + 'php/*.php')
    .pipe($.newer('./www'))
    .pipe(gulp.dest(config.buildRoot + 'scripts'));
});

gulp.task('images', function() {
  return gulp.src([config.srcRoot + 'img/[^!]**/*',
           config.srcRoot + 'img/*.*'])
    .pipe($.imagemin({
      progressive: true,
      svgoPlugins: [{
        removeViewBox: false
      }]
    }))
    .pipe(gulp.dest(config.buildRoot + 'img'));
});

gulp.task('copy:vendor__assets', function () {
  return gulp.src([config.libVendorAssets.bxSlider_ajaxLoader])
    .pipe($.plumber())
    .pipe(gulp.dest(config.buildRoot + 'img'));
});

// gulp.task('copy:vendor__fonts', function () {
//   var lib = {
//     bootstrap: './bower_components/bootstrap/dist/fonts/*.*'
//     };
//   return gulp.src(lib.bootstrap)
//     .pipe($.plumber())
//     .pipe(gulp.dest(config.buildRoot + 'css/fonts'));
// });

gulp.task('stylus-watch', ['stylus'], function () {
  bs.reload();
});

gulp.task('jade-watch', ['jade'], function () {
  bs.reload();
  // bs.notify("Done");
});

gulp.task('js-watch', ['js'], function () {
  bs.reload();
});

gulp.task('json-watch', ['json'], function () {
  bs.reload();
});

gulp.task('php-watch', ['php'], function () {
  bs.reload();
});

gulp.task('watch', ['sync'], function() {
  gulp.watch(config.srcRoot + 'jade/**/[^!]*.jade', ['jade-watch']);
  gulp.watch(config.srcRoot + 'styl/**/[^!]*.styl', ['stylus-watch']);
  gulp.watch(config.srcRoot + 'js/**/[^!]*.js', ['js-watch']);
  gulp.watch(config.srcRoot + 'json/[^!]*.json', ['json-watch']);
  gulp.watch(config.srcRoot + 'php/[^!]*.php', ['php-watch']);
  bs.reload();
});

gulp.task('clean', function (cb) {
    $.del([config.buildRoot + '*'], cb);
});
// why do we need a cb
// http://stackoverflow.com/questions/31400418/gulp-sass-del-random-behaviour

gulp.task('build', function (cb) {
  $.runSequence('clean',
                [
                  'jade',
                  'php',
                  'stylus',
                  'js',
                  'json',
                  'images',
                  // 'copy:vendor__fonts',
                  'copy:vendor__assets',
                ],
                cb);
});

gulp.task('default', ['watch']);
