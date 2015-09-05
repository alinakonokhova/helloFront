var gulp = require('gulp');
var fs = require('fs');
var config = require('../config').style;
var sass = require('gulp-sass');
var plumber = require('gulp-plumber');
var autoprefixer = require('gulp-autoprefixer');
var cmq = require('gulp-combine-media-queries');
var gutil = require("gulp-util");
var csso = require("gulp-csso");
var notify = require('gulp-notify');
var size = require('gulp-size');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync').create();
var options = require('minimist')(process.argv.slice(2));

var onError = function(err) {
  notify.onError({
    title: "Gulp",
    subtitle: "Style Failure!",
    message: "Error: <%= error.message %>",
    sound: "Frog"
  })(err);
  this.emit('end');
};

function createNormalizeScss() {
  fs.createReadStream(config.fileNormalizeCss)
  .pipe(fs.createWriteStream(config.fileNormalizeScss));
}

gulp.task('style', function() {
  createNormalizeScss();
  return gulp.src(config.mainSrc)
    .pipe(plumber({
      errorHandler: onError
    }))
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(options.production ? cmq({
      log: true
    }) : gutil.noop())
      .pipe(options.production ? csso() : gutil.noop())
      .pipe(size({
        title: 'style'
    }))
    .pipe(gulp.dest(config.folderDest))
    .pipe(browserSync.stream());
});
