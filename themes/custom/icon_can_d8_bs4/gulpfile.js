const dist_css_base = './css';
const dist_js_base = './js';

const src_move_css_files = ['./node_modules/jquery.mmenu/dist/jquery.mmenu.all.css'];

const src_move_js_files = [
  './node_modules/bootstrap/dist/js/bootstrap.min.js',
  './node_modules/popper.js/dist/umd/popper.min.js',
  './node_modules/jquery.mmenu/dist/jquery.mmenu.all.js'
];

const gulp = require('gulp');
const sass = require('gulp-sass');
const prefix = require('gulp-autoprefixer');
const clean = require('gulp-clean');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const plumber = require('gulp-plumber'); // For error handling.
const gutil = require('gulp-util'); // For error handling.

// Error Handling to stop file watching from dying on an error (ie: Sass
// compiling).
let onError = function (err) {
  gutil.beep();
  console.log(err);
};

// ******** CSS related functions and tasks ********
/**
 * @task Default sass task
 * Compile files from scss
 */
gulp.task('styles', function () {
  gulp.src(dist_css_base + '/*', {read: false}).pipe(clean());

  // Min CSS file Movement
  gulp.src(src_move_css_files)
      .pipe(plumber({errorHandler: onError}))
      .pipe(gulp.dest(dist_css_base + '/'));

  /**
   * Match bootstrap upstream requirements.
   * @type Array
   */
  const prefixOptions = [
    "Android >= 5",
    "Chrome >= 49",
    "Firefox >= 35",
    "Explorer >= 10",
    "iOS >= 10",
    "Opera >= 40",
    "Safari >= 10"
  ];

  // Compile styles
  return gulp.src('./src/scss/*.scss') // the source .scss file
      .pipe(sass().on('error', sass.logError))
      .pipe(prefix({browsers: prefixOptions, cascade: true})) // pass the file through autoprefixer
      .pipe(cleanCSS())
      .pipe(gulp.dest(dist_css_base + '/'));
});

// ******** JS related functions and tasks ********
/**
 * @task scripts
 * Compile files from scripts
 */
gulp.task('scripts', function () {
  gulp.src(dist_js_base + '/*', {read: false}).pipe(clean());

  // Min JS files movement
  gulp.src(src_move_js_files)
      .pipe(plumber({
        errorHandler: onError
      }))
      .pipe(gulp.dest(dist_js_base));

  return gulp.src('./src/js/**/*.js')
      .pipe(plumber({errorHandler: onError}))
      .pipe(uglify())
      .pipe(gulp.dest(dist_js_base));
});

// ********************************************************************************************************************************************

// Default gulp task.
gulp.task('default', function () {
  gulp.start('styles');
  gulp.start('scripts');
});

// Watch changes.
gulp.task('watch', function () {

  // Watch for Sass changes.
  gulp.watch('./src/scss/**/*.scss', function () {
    gulp.start('styles');
  });

  // Watch for JS changes.
  gulp.watch('./src/js/**/*.js', function () {
    gulp.start('scripts');
  });

});
