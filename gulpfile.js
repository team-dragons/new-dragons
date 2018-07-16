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
  gulpif = require('gulp-if'),
  autoprefixer = require('gulp-autoprefixer'),
  browserSync = require('browser-sync'),
  reload = browserSync.reload,
  argv = require('yargs').argv,
  del = require('del');

const env = (argv.prod === true) ? 'prod' : 'preview';

gulp.task('css', () => {
  return gulp.src('./_dev/stylesheets/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1'))
    .pipe(gulp.dest('./_dev/stylesheets'))
    .pipe(gulpif(env === 'preview', reload({ stream: true })))
    .pipe(gulpif(env === 'prod', cleanCSS()))
    .pipe(gulp.dest('./_dist/stylesheets'))
});

gulp.task('js', () => {
  return gulp.src('./_dev/scripts/**/*.js')
    .pipe(babel({
      presets: ['env']
    }))
    .pipe(gulp.dest('./_dist/scripts'))
    .pipe(gulpif(env === 'preview', reload({ stream: true })))
    .pipe(gulpif(env === 'prod', uglify()))
    .pipe(gulp.dest('./_dist/scripts'))
});

gulp.task('html', function () {
  return gulp.src([
      './_dev/**/*.html',
      './_dev/**/*.ejs',   //exclude .ejs files
      '!node_modules',    //exclude node_modules
      '!node_modules/**', //exclude node_modules
      '!_dist',           //exclude node_modules
      '!_dist/**'         //exclude node_modules
    ])
    .pipe(gulpif(env === 'preview', reload({ stream: true })))
});

gulp.task('watch', function () {
  gulp.watch('./_dev/stylesheets/*.scss', ['css']);
  gulp.watch('./_dev/scripts/*.js', ['js']);
  gulp.watch('./_dev/**/*.ejs', ['html']);
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

// gulp.task('build', function (done) {
//   return gulp.src('')
//     .pipe(shell([
//       'harp compile _dev _dist'
//     ]))
// });

gulp.task('build', function (done) {
  child_process.exec('harp compile _dev _dist', { stdio: 'inherit' })
    .on('close', done);
});

gulp.task('clean', function () {
  return del([
    '_dist/*',
    '_dist/**/*'
  ]);
});


gulp.task('default', (env === 'prod') ? ['css', 'js', 'build'] : ['serve', 'css', 'js', 'html', 'watch']);