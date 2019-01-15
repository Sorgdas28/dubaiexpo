const dist_css_base = 'css';
const dist_js_base = 'js';

let scss_files_global = [
  'src/scss/style.scss',
  'src/scss/maintenance-page.scss',
  'src/scss/print.scss',
];

let scss_files_components = [
  'src/scss/components/affix.scss',
  'src/scss/components/book-navigation.scss',
  'src/scss/components/breadcrumb.scss',
  'src/scss/components/dropbutton.component.scss',
  'src/scss/components/dropbutton.scss',
  'src/scss/components/form.scss',
  'src/scss/components/indented.scss',
  'src/scss/components/node.scss',
  'src/scss/components/sidebar-collapse.scss',
  'src/scss/components/tabs.scss',
  'src/scss/components/vertical-tabs.scss'
];

let scss_files_colors = [
  'src/scss/colors/messages/messages-dark.scss',
  'src/scss/colors/messages/messages-light.scss'
];


let js_files_for_compiling = 'src/js/*.js';

// Error Handling to stop file watching from dying on an error (ie: Sass
// compiling).
let onError = function (err) {
  beeper();
  console.log(err);
};

const gulp = require('gulp'),
    sass = require('gulp-sass'),
    prefix = require('gulp-autoprefixer'),
    clean = require('gulp-clean'),
    cleanCSS = require('gulp-clean-css'),
    uglify = require('gulp-uglify'),
    plumber = require('gulp-plumber'), // For error handling.
    beeper = require('beeper'); // For error handling.

/**
 * @task styles
 * Compile files from scss files
 */
function styles() {
  // Compile global styles
  compile_scss_files(scss_files_global, dist_css_base);
  // Compile components
  compile_scss_files(scss_files_components, dist_css_base + '/components/');
  // Compile colors
  return compile_scss_files(scss_files_colors, dist_css_base + '/colors/messages/');
}

function compile_scss_files(src, dist){
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

  return gulp.src(src) // the source .scss file
      .pipe(sass().on('error', sass.logError))
      .pipe(prefix({browsers: prefixOptions, cascade: true})) // pass the file
      // through
      // autoprefixer
      .pipe(cleanCSS())
      .pipe(gulp.dest(dist));
}

function clean_part() {
  return gulp.src([
        dist_css_base + '/colors/*',
        dist_css_base + '/components/*',
        dist_css_base + '/*.css',
        dist_js_base + '/*.js',],
      {read: false}).pipe(clean());
}

function clean_all() {
  return gulp.src([dist_css_base + '/*', dist_js_base + '/*',], {read: false}).pipe(clean());
}

function move_min_css_n_js(){
  // Min CSS file Movement
  gulp.src('node_modules/jquery.mmenu/dist/jquery.mmenu.all.css')
      .pipe(plumber({
        errorHandler: onError
      }))
      .pipe(gulp.dest(dist_css_base + '/vendors'));

  // Min JS files movement
  return gulp.src([
    'node_modules/bootstrap/dist/js/bootstrap.min.js',
    'node_modules/popper.js/dist/umd/popper.min.js',
    'node_modules/jquery.mmenu/dist/jquery.mmenu.all.js'
  ])
      .pipe(plumber({
        errorHandler: onError
      }))
      .pipe(gulp.dest(dist_js_base + '/vendors'));
}

/**
 * @task scripts
 * Compile files from scripts
 */
function scripts() {
  return gulp.src(js_files_for_compiling)
      .pipe(plumber({
        errorHandler: onError
      }))
      .pipe(uglify())
      .pipe(gulp.dest(dist_js_base));
}


// Default tasks
exports.default = gulp.series(clean_all, move_min_css_n_js, styles, scripts);


// Watch tasks
let total_watching_files = scss_files_global.concat(scss_files_components, scss_files_colors, js_files_for_compiling);

gulp.watch(total_watching_files, function () {
  clean_part();
  styles();
  scripts()
});