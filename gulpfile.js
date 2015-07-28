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

gulp.task('sync', function() {
  bs.init({
    proxy: config.proxyAdress,
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
    .pipe(gulp.dest(config.buildRoot))
    .on('end', bs.reload);
});

gulp.task('build__jade', function() {
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
    .pipe(gulp.dest(config.buildRoot))
});

// gulp.task('jade-watch', ['jade'], function() {
//   bs.reload();
// });

gulp.task('js', function() {
  gulp.src(config.srcRoot + 'js/*.js')
    .pipe($.plumber())
    .pipe(gulp.dest(config.buildRoot + 'js/partials'));
});

gulp.task('js-watch', function() {
  $.runSequence('js', bs.reload);
});

gulp.task('json', function() {
  gulp.src(config.srcRoot + 'json/*.json')
    .pipe($.plumber())
    .pipe(gulp.dest(config.buildRoot + 'json'));
});

gulp.task('json-watch', function() {
  $.runSequence('json', bs.reload);
});

gulp.task('php', function() {
    gulp.src(config.srcRoot + 'php/*.php')
    .pipe($.newer('./www'))
    .pipe(gulp.dest(config.buildRoot + 'scripts'))
    .on('end', bs.reload);
});

gulp.task('build__php', function() {
    gulp.src(config.srcRoot + 'php/*.php')
    .pipe($.newer('./www'))
    .pipe(gulp.dest(config.buildRoot + 'scripts'));
});

gulp.task('copy:vendor__js', function () {
  var lib = {
    jquery: './bower_components/jquery/dist/jquery.min.js',
    material: './bower_components/material-design-lite/material.min.js',
    bootstrap: './bower_components/bootstrap/dist/js/bootstrap.min.js',
    owlcarousel: './bower_components/OwlCarousel2/dist/owl.carousel.min.js'
    };
  gulp.src([lib.jquery, lib.material, lib.bootstrap, lib.owlcarousel])
    .pipe($.plumber())
    .pipe(gulp.dest(config.buildRoot + 'js/vendor'));
});

gulp.task('copy:vendor__css', function () {
  var lib = {
    material: './bower_components/material-design-lite/material.min.css',
    bootstrap_core: './bower_components/bootstrap/dist/css/bootstrap.min.css',
    bootstrap_theme: './bower_components/bootstrap/dist/css/bootstrap-theme.min.css',
    owlcarousel_core: './bower_components/OwlCarousel2/dist/assets/owl.carousel.min.css',
    owlcarousel_theme: './bower_components/OwlCarousel2/dist/assets/owl.theme.default.min.css',
    owlcarousel_ajaxLoader: './bower_components/OwlCarousel2/dist/assets/ajax-loader.gif'
    };
  gulp.src([lib.material, 
           lib.bootstrap_core, 
           lib.bootstrap_theme, 
           lib.owlcarousel_core, 
           lib.owlcarousel_theme, 
           lib.owlcarousel_ajaxLoader])
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
  gulp.watch([config.srcRoot + 'jade/**/[^!]*.jade', config.srcRoot + 'jade/templates/[^!]*.jade'], ['jade']);
  gulp.watch(config.srcRoot + 'js/**/[^!]*.js', ['js-watch']);
  gulp.watch(config.srcRoot + 'json/[^!]*.json', ['json-watch']);
  // gulp.watch(config.srcRoot + 'img/*', ['images']);
  gulp.watch('src/php/[^!]*.php', ['php']);
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
      json: config.buildRoot + 'json/*.*',
      fonts: config.buildRoot + 'fonts/*.*',
      images: config.buildRoot + 'img/*.*',
      php: config.buildRoot + 'php/*.*'
    };
  $.del([path.root,
        path.css,
        path.css_vendor,
        path.css_partials,
        path.js,
        path.js_vendor,
        path.js_partials,
        path.json,
        path.fonts,
        path.images,
        path.php]);
});

gulp.task('build', function () {
  $.runSequence('clean', ['copy:vendor__js',
                          'copy:vendor__css',
                          'copy:vendor__fonts',
                          'build__jade',
                          'stylus',
                          'images',
                          'js',
                          'json',
                          'build__php']);
});

gulp.task('default', ['watch']);
