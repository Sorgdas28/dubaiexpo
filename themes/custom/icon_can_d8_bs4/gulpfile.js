var gulp = require('gulp'),
    sass = require('gulp-sass'),
    prefix = require('gulp-autoprefixer'),
    clean = require('gulp-clean'),
    cleanCSS = require('gulp-clean-css'),
    uglify = require('gulp-uglify'),
    plumber = require('gulp-plumber'), // For error handling.
    gutil = require('gulp-util'); // For error handling.

const scss_files_for_compiling = [
  'scss/style.scss',
  'scss/components/affix.scss',
  'scss/components/book-navigation.scss',
  'scss/components/breadcrumb.scss',
  'scss/components/dropbutton.component.scss',
  'scss/components/dropbutton.scss',
  'scss/components/form.scss',
  'scss/components/indented.scss',
  'scss/components/maintenance-page.scss',
  'scss/components/node.scss',
  'scss/components/sidebar-collapse.scss',
  'scss/components/tabs.scss',
  'scss/components/vertical-tabs.scss',
  'scss/colors/messages/messages-dark.scss',
  'scss/colors/messages/messages-light.scss'
];

// Error Handling to stop file watching from dying on an error (ie: Sass
// compiling).
var onError = function (err) {
  gutil.beep();
  console.log(err);
};

/**
 * @task sass
 * Compile files from scss
 */
gulp.task('styles', function () {

  /**
   * Match bootstrap upstream requirements.
   * @type Array
   */
  var prefixOptions = [
    "Android >= 5",
    "Chrome >= 49",
    "Firefox >= 35",
    "Explorer >= 10",
    "iOS >= 10",
    "Opera >= 40",
    "Safari >= 10"
  ];

  gulp.src('css/*', {read: false}).pipe(clean());

  // Min CSS file Movement
  gulp.src('node_modules/jquery.mmenu/dist/jquery.mmenu.all.css')
      .pipe(plumber({
        errorHandler: onError
      }))
      .pipe(gulp.dest('css'));

  return gulp.src(scss_files_for_compiling) // the source .scss file
      .pipe(sass().on('error', sass.logError))
      .pipe(prefix({browsers: prefixOptions, cascade: true})) // pass the file through autoprefixer
      .pipe(cleanCSS())
      .pipe(gulp.dest('css'))
});

/**
 * @task scripts
 * Compile files from scripts
 */
gulp.task('scripts', function () {

  // Min JS files movement
  gulp.src([
    'node_modules/bootstrap/dist/js/**',
    'node_modules/popper.js/dist/umd/popper.min.js',
    'node_modules/jquery.mmenu/dist/jquery.mmenu.all.js'
  ])
      .pipe(plumber({
        errorHandler: onError
      }))
      .pipe(gulp.dest('js'));

  return gulp.src('src/js/*.js')
      .pipe(plumber({
        errorHandler: onError
      }))
      .pipe(uglify())
      .pipe(gulp.dest('js'));

});


//Watch task
gulp.task('default', ['styles', 'scripts']);

// Watch changes.
gulp.task('watch', ['scripts', 'styles'], function() {
  // Watch for JS changes.
  gulp.watch('src/js/*.js', function() {
    gulp.start('scripts');
  });
  // Watch for Sass changes.
  gulp.watch(scss_files_for_compiling, function() {
    gulp.start('styles');
  });
});