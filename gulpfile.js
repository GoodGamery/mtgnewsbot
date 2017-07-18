const gulp = require('gulp');
const gutil = require('gulp-util');
const debug = require('gulp-debug');
const jsonlint = require('gulp-jsonlint');
const eslint = require('gulp-eslint');

gulp.task('lint', function() {
  return gulp.src('src/**/*.js')
    .pipe(debug({title: 'Linting'}))
    .pipe(eslint({ useEslintrc: true }))
    .pipe(eslint.format('codeframe')) 
    .pipe(eslint.format());
});

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
  return gulp.watch(['src/**/*.js', 'src/**/*.json'], ['lint', 'jsonlint']);
});

gulp.task('default', ['lint', 'jsonlint', 'watch']);