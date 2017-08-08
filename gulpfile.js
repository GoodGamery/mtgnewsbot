'use strict';

const gulp = require('gulp');
const gutil = require('gulp-util');
const debug = require('gulp-debug');
const jsonlint = require('gulp-jsonlint');
const eslint = require('gulp-eslint');
const yamllint = require('gulp-yaml-validate');
const runSequence = require('run-sequence');

const SRC_FILES = {
  JS: ['./*.js', 'src/**/*.js'],
  JSON: ['src/**/*.json'],
  YAML: ['src/**/*.yaml']
};

gulp.task('jslint', function() {
  const completionTracker = function(results) {
    results = results || [];

    const result = results.reduce(function(all, current) {
      all.errors += current.errorCount;
      all.warnings += current.warningCount;
      return all;
    }, { errors: 0, warnings: 0 });

    if (result.errors > 0) {
      gutil.log(gutil.colors.red('>>> Javascript linting: ' + gutil.colors.underline('FAILED') + '.'));
    } else if (result.warnings > 0) {
      gutil.log(gutil.colors.yellow('>>> Javascript linting ' + gutil.colors.underline('COMPLETED with warnings') + '.'));
    } else {
      gutil.log(gutil.colors.green('>>> Javascript linting ' + gutil.colors.underline('COMPLETED') + '.'));
    }
  };

  return gulp.src(SRC_FILES.JS)
    .pipe(debug({title: 'Linting'}))
    .pipe(eslint({ useEslintrc: true }))
    .pipe(eslint.format('codeframe'))
    .pipe(eslint.format())
    .pipe(eslint.format(completionTracker));
});

gulp.task('jsonlint', function() {
  let success;
  const completionTracker = function() {
    success = true;

    return function (file) {
      success = success && file.jsonlint.success;
    };
  };

  return gulp.src(SRC_FILES.JSON)
    .pipe(debug({title: 'Linting'}))
    .pipe(jsonlint())
    .pipe(jsonlint.reporter())
    .pipe(jsonlint.reporter(completionTracker()))
    .on('end', function() {
      if (success) {
        gutil.log(gutil.colors.green('>>> JSON linting ' + gutil.colors.underline('COMPLETED') + '.'));
      } else {
        gutil.log(gutil.colors.red('>>> JSON linting ' + gutil.colors.underline('FAILED.') + '.'));
      }
    });

});

gulp.task('yamllint', function() {
  let success;
  const completionTracker = function() {
    success = true;

    return function (file) {
      success = success && file.yamllint.success;
    };
  };

  const yaml = yamllint({});
  yaml.on('error', function(err) {
    gutil.log(gutil.colors.red('YAML validation error: ' + err.message));
    yaml.end();
  });

  return gulp.src(SRC_FILES.YAML)
    .pipe(debug({title: 'Linting'}))
    .pipe(yaml)
    .pipe(jsonlint.reporter())
    .pipe(jsonlint.reporter(completionTracker()))
    .on('end', function() {
      if (success) {
        gutil.log(gutil.colors.green('>>> YAML linting ' + gutil.colors.underline('COMPLETED') + '.'));
      } else {
        gutil.log(gutil.colors.red('>>> YAML linting ' + gutil.colors.underline('FAILED.') + '.'));
      }
    });
});

gulp.task('lint', function(callback) {
  runSequence('jslint', 'jsonlint', 'yamllint', callback);
});

gulp.task('watch', function() {
  gulp.watch([SRC_FILES.JS, SRC_FILES.JSON, SRC_FILES.YAML], ['lint']);
});

gulp.task('default', ['lint', 'watch']);