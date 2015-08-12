'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')({
      pattern: ['*']
    });

var bs = $.browserSync.create();
var config = {
  buildRoot: './www/',
  srcRoot: './src/',
  proxyAdress: 'toys.loc.ru'
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
      browsers: ['last 2 versions'],
      cascade: false
    }))
    // .pipe(csscomb())
    .pipe($.rename('style.min.css'))
    .pipe(gulp.dest(config.buildRoot + 'css'));
});

gulp.task('jade', function() {
  // bs.notify("Compiling JADE, please wait!");
  return gulp.src(config.srcRoot + 'jade/*.jade')
    .pipe($.plumber())
    .pipe($.jade({
      pretty: true
    }))
    // .pipe($.htmlmin({
    //   collapseWhitespace: true,
    //   removeComments: true,
    //   minifyJS: true,
    //   minifyCSS: true
    // }))
    .pipe(gulp.dest(config.buildRoot));
});

gulp.task('js', function() {
  return gulp.src(config.srcRoot + 'js/*.js')
    .pipe($.plumber())
    .pipe(gulp.dest(config.buildRoot + 'js/partials'));
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

gulp.task('copy:vendor__js', function () {
  var lib = {
    jquery: './bower_components/jquery/dist/jquery.min.js',
    mdl: './bower_components/material-design-lite/material.min.js',
    bootstrap: './bower_components/bootstrap/dist/js/bootstrap.min.js',
    owlcarousel: './bower_components/OwlCarousel2/dist/owl.carousel.min.js',
    flexslider: './bower_components/flexslider/jquery.flexslider-min.js',
    matchHeight: './bower_components/matchHeight/jquery.matchHeight-min.js',
    bxSlider: './bower_components/dw-bxslider-4/dist/jquery.bxslider.min.js'
    };
  return gulp.src([lib.jquery,
           lib.matchHeight,
           lib.bxSlider])
    .pipe($.plumber())
    .pipe(gulp.dest(config.buildRoot + 'js/vendor'));
});

gulp.task('copy:vendor__css', function () {
  var lib = {
    mdl: './bower_components/material-design-lite/material.min.css',
    bootstrap_core: './bower_components/bootstrap/dist/css/bootstrap.min.css',
    bootstrap_theme: './bower_components/bootstrap/dist/css/bootstrap-theme.min.css',
    owlcarousel_core: './bower_components/OwlCarousel2/dist/assets/owl.carousel.min.css',
    owlcarousel_theme: './bower_components/OwlCarousel2/dist/assets/owl.theme.default.min.css',
    owlcarousel_ajaxLoader: './bower_components/OwlCarousel2/dist/assets/ajax-loader.gif',
    flexslider: './bower_components/flexslider/flexslider.css',
    resetcss: './bower_components/reset-css/reset.css',
    bxSlider: './bower_components/dw-bxslider-4/dist/jquery.bxslider.min.css',
    bxSlider_ajaxLoader: './bower_components/dw-bxslider-4/dist/images/bx_loader.gif'
    };
  return gulp.src([lib.bxSlider_ajaxLoader])
    .pipe($.plumber())
    .pipe(gulp.dest(config.buildRoot + 'css/vendor'));
});

gulp.task('copy:vendor__fonts', function () {
  var lib = {
    bootstrap: './bower_components/bootstrap/dist/fonts/*.*'
    };
  return gulp.src(lib.bootstrap)
    .pipe($.plumber())
    .pipe(gulp.dest(config.buildRoot + 'css/fonts'));
});

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
    $.del([config.buildRoot], cb);
});
// why do we need a cb
// http://stackoverflow.com/questions/31400418/gulp-sass-del-random-behaviour

gulp.task('build', function (cb) {
  $.runSequence('clean',
                ['copy:vendor__js',
                  'copy:vendor__css',
                  // 'copy:vendor__fonts',
                  'jade',
                  'php',
                  'stylus',
                  'js',
                  'json',
                  'images'
                ],
                cb);
});

gulp.task('default', ['watch']);
