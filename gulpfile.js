const gulp = require('gulp');
const gutil = require('gulp-util');
const debug = require('gulp-debug');
const jsonlint = require('gulp-jsonlint');


gulp.task('jsonlint', function() {
  let success;
  const jsonLintResultTracker = function() {
    success = true;

    return function (file, jsonlint) {
      gutil.log('File ' + file.path + ' is not valid JSON.');
      success = success && file.jsonlint.success;
    }
  };

  return gulp.src('src/**/*.json')
    .pipe(debug({title: 'Linting'}))
    .pipe(jsonlint())     
    .pipe(jsonlint.reporter())
    .pipe(jsonlint.reporter(jsonLintResultTracker()))
    .on('end', function() {
      if (success) {
        gutil.log(gutil.colors.green('>>> Linting complete.'));
      } else {
        gutil.log(gutil.colors.red('>>> Linting failed.'));
      }
    })       

});

gulp.task('watch', function() {
  return gulp.watch('src/**/*.json', ['jsonlint']);
});

gulp.task('default', ['jsonlint', 'watch']);