var gulp = require('gulp');
var less = require('gulp-less');
var minifyCSS = require('gulp-minify-css');
var less = require('gulp-less');
var uglify = require('gulp-uglify');


gulp.task('less', function () {
    gulp.src('./assets/less/style.less') // path to your file
        .pipe(less())
        .pipe(gulp.dest('./assets/dist/css/'));
});


gulp.task('popless', function () {
    gulp.src('./assets/less/popup.less') // path to your file
        .pipe(less())
        .pipe(gulp.dest('./assets/dist/css/'));
});

gulp.task('fonts', function () {
    gulp.src('./assets/fonts/*')
        .pipe(gulp.dest('./assets/dist/fonts'));
})



gulp.task('scripts', function () {
    gulp.src('./assets/js/*/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('./assets/dist/js'));
})

// Default Task
gulp.task('default', ['less', 'popless', 'scripts', 'fonts']);
