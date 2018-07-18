'use strict';

const gulp = require('gulp'),

  //CSS
  sass = require('gulp-sass'),
  cleanCSS = require('gulp-clean-css'),

  //JavaScript
  babel = require('gulp-babel'),
  uglify = require('gulp-uglify'),

  //Healpers
  harp = require('harp'),
  exec = require('child_process').exec,
  autoprefixer = require('gulp-autoprefixer'),
  browserSync = require('browser-sync'),
  reload = browserSync.reload,
  argv = require('yargs').argv,
  del = require('del');

const env = (argv.prod === true) ? 'prod' : 'preview';

gulp.task('css', ['clean'], () => {
  if (process.env.NODE_ENV === 'development') {
    return gulp.src('./_dev/stylesheets/**/*.scss')
      .pipe(sass().on('error', sass.logError))
      .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1'))
      .pipe(gulp.dest('./_dev/stylesheets'))
      .pipe(reload({ stream: true }))
  } else {
    return gulp.src('./_dev/stylesheets/**/*.scss')
      .pipe(sass().on('error', sass.logError))
      .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1'))
      .pipe(cleanCSS())
      .pipe(gulp.dest('./_dist/stylesheets'))
  }
});

gulp.task('js', ['clean'], () => {
  if (process.env.NODE_ENV === 'development') {
    return gulp.src('./_dev/resources/scripts/**/*.js')
      .pipe(babel({
        compact: false,
        presets: ['env']
      }))
      .pipe(reload({ stream: true }))
  } else {
    return gulp.src('./_dev/resources/scripts/**/*.js')
      .pipe(babel({
        compact: false,
        presets: ['env']
      }))
      .pipe(uglify())
      .pipe(gulp.dest('./_dist/resources/scripts'))
  }
});

gulp.task('html', function () {
  if (process.env.NODE_ENV === 'development') {
    return browserSync.reload();
  }
});

gulp.task('watch', function () {
  gulp.watch('./_dev/stylesheets/*.scss', ['css']);
  gulp.watch('./_dev/scripts/*.js', ['js']);
  gulp.watch('./_dev/**/*.ejs', ['html']);
});

gulp.task('dev-set-env', function () {
  return process.env.NODE_ENV = 'development';
});

gulp.task('serve', function (done) {
  harp.server(__dirname + "/_dev", {
    port: 9100
  }, function (done) {
    browserSync({
      proxy: "localhost:9100",
      open: true,
      startPath: '/'
    });
  });
});

gulp.task('prod-set-env', ['clean'], function () {
  return process.env.NODE_ENV = 'production';
});

gulp.task('clean', function () {
  if (process.env.NODE_ENV === 'production') {
    return del([
      '_dist/*',
      '_dist/**/*'
    ]);
  }
});

gulp.task('build', ['prod-set-env'], () => {
  console.log("Environment: ", process.env.NODE_ENV);
  exec('npm run compile', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
  });
});

gulp.task('default', (argv.prod === true) ? ['prod-set-env', 'build', 'css', 'js'] : ['dev-set-env', 'serve', 'css', 'js', 'html', 'watch']);