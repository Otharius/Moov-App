const gulp = require('gulp');
const less = require('gulp-less');

gulp.task('css', function() {
    return gulp
    .src('./src/main.less')
    .pipe(less())
    .pipe(gulp.dest("../"))
})