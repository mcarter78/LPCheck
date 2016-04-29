var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    rename = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer');
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var minifycss = require('gulp-minify-css');
var sass = require('gulp-sass');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');


gulp.task('styles', function(){
  gulp.src(['src/sass/**/*.scss'])
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(sass())
    .pipe(autoprefixer('last 2 versions'))
    .pipe(gulp.dest('dist/css/'))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest('dist/css/'))
});

gulp.task('build', function () {
  browserify({
    entries: 'src/scripts/app.jsx',
    extensions: ['.jsx'],
    debug: true
  })
  .transform(babelify, {presets: ['es2015', 'react']})
  .on('error', function (err) {
    console.log(err);
    this.emit('end');
  })
  .bundle()
  .on('error', function(err){
    console.log(err.message);
  })
  .pipe(source('bundle.js'))
  .pipe(gulp.dest('dist/scripts'));
});

gulp.task('watch', ['build', 'styles'], function () {
  console.log("watching for changes...");
  gulp.watch('src/**/*.jsx', ['build']);
  gulp.watch("src/sass/**/*.scss", ['styles']);
});

gulp.task('default', ['watch']);
