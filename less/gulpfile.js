const gulp = require('gulp');
const less = require('gulp-less');

gulp.task('mobil', function() {
    return gulp
    .src('./src/mobil.less')
    .pipe(less())
    .pipe(gulp.dest('../public/css'))
});

gulp.task('css', function() {
    return gulp
        .src('./src/computer.less')
        .pipe(less())
        .pipe(gulp.dest('../public/css'))
});

