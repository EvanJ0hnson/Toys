var gulp = require('gulp');
var $ = require('gulp-load-plugins')({
      pattern: ['*']
    });

var proxyAdress = 'toys.loc.ru';
var bs = $.browserSync.create();
var config = {
  buildRoot: './www/',
  srcRoot: './src/'
}

gulp.task('sync', function() {
  bs.init({
    proxy: proxyAdress,
    notify: false
  });
});

gulp.task('stylus', function() {
  gulp.src(config.srcRoot + 'styl/style.styl')
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

gulp.task('stylus-watch', ['stylus'], function () {
  bs.reload();
});

gulp.task('jade', function() {
  gulp.src(config.srcRoot + 'jade/*.jade')
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

gulp.task('jade-watch', function() {
  $.runSequence('jade', bs.reload);
});

gulp.task('copy:php', function() {
    gulp.src(config.srcRoot + 'php/*.php')
    .pipe($.newer('./www'))
    .pipe(gulp.dest(config.buildRoot));
});

gulp.task('copy:vendor__js', function () {
  var lib = {
    jquery: './bower_components/jquery/dist/jquery.min.js',
    material: './bower_components/material-design-lite/material.min.js',
    bootstrap: './bower_components/bootstrap/dist/js/bootstrap.min.js'
    };
  gulp.src([lib.jquery, lib.material, lib.bootstrap])
    .pipe($.plumber())
    .pipe(gulp.dest(config.buildRoot + 'js/vendor'));
});

gulp.task('copy:vendor__css', function () {
  var lib = {
    material: './bower_components/material-design-lite/material.min.css',
    bootstrap_core: './bower_components/bootstrap/dist/css/bootstrap.min.css',
    bootstrap_theme: './bower_components/bootstrap/dist/css/bootstrap-theme.min.css'
    };
  gulp.src([lib.material, lib.bootstrap_core, lib.bootstrap_theme])
    .pipe($.plumber())
    .pipe(gulp.dest(config.buildRoot + 'css/vendor'));
});

gulp.task('copy:vendor__fonts', function () {
  var lib = {
    bootstrap: './bower_components/bootstrap/dist/fonts/*.*'
    };
  gulp.src(lib.bootstrap)
    .pipe($.plumber())
    .pipe(gulp.dest(config.buildRoot + 'css/fonts'));
});

gulp.task('images', function() {
  gulp.src(config.srcRoot + 'img/*.*')
    .pipe($.newer('www/img'))
    .pipe($.imagemin({
      progressive: true,
      svgoPlugins: [{
        removeViewBox: false
      }]
    }))
    .pipe(gulp.dest(config.buildRoot + 'img'));
});

gulp.task('watch', ['sync'], function() {
  gulp.watch(config.srcRoot + 'styl/**/[^!]*.styl', ['stylus-watch']);
  gulp.watch([config.srcRoot + 'jade/**/[^!]*.jade', config.srcRoot + 'jade/articles/[^!]*.md'], ['jade-watch']);
  // gulp.watch(config.srcRoot + 'img/*', ['images']);
  // gulp.watch('src/php/[^!]*.php', ['php']);
  // gulp.watch('www/**/*').on('change', bs.reload);
});

gulp.task('clean', function () {
  var path = {
      root: config.buildRoot + '*.*',
      css: config.buildRoot + 'css/*.*',
      css_vendor: config.buildRoot + 'css/vendor/*.*',
      css_partials: config.buildRoot + 'css/partials/*.*',
      js: config.buildRoot + 'js/*.*',
      js_vendor: config.buildRoot + 'js/vendor/*.*',
      js_partials: config.buildRoot + 'js/partials/*.*',
      fonts: config.buildRoot + 'fonts/*.*',
      images: config.buildRoot + 'img/*.*'
    };
  $.del([path.root,
        path.css,
        path.css_vendor,
        path.css_partials,
        path.js,
        path.js_vendor,
        path.js_partials,
        path.fonts,
        path.images]);
});

gulp.task('build', function () {
  $.runSequence('clean', ['copy:vendor__js', 'copy:vendor__css', 'copy:vendor__fonts', 'jade', 'stylus', 'images']);
});

gulp.task('default', ['watch']);
