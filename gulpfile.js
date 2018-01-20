/**
 * Created by Administrator on 2017/10/27.
 * gulp配置文件
 */
let gulp = require('gulp');
let babel = require('gulp-babel'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    minCSS = require('gulp-minify-css'),
    minImg = require('gulp-imagemin'),
    rev = require('gulp-rev'),
    revCollector = require('gulp-rev-collector');
let browserSync = require('browser-sync').create();
let reload = browserSync.reload;
gulp.task('browser-sync', function () {
    browserSync.init({
        // server:'./app.js',
        // proxy: "127.0.0.1"
        proxy: "http://localhost:8080",
        port: 8080
        /*{
            baseDir:'./app'
        }*/
    });
    gulp.watch('./app/views/*').on('change', reload);
});
gulp.task('minJS', function () {
    gulp.src('public/js/*.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(uglify())
        .pipe(rev())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('dist/js'))
        .pipe(rev.manifest('js.json'))
        .pipe(gulp.dest('rev'))
});
gulp.task('minCSS', function () {
    gulp.src('public/css/*.css')
        .pipe(minCSS())
        .pipe(rev())
        .pipe(gulp.dest('dist/css'))
        .pipe(rev.manifest('css.json'))
        .pipe(gulp.dest('rev'));

});
gulp.task('minImg', function () {
    gulp.src('public/imgs/*')
        .pipe(minImg())
        .pipe(rev())
        .pipe(gulp.dest('dist/imgs'))
        .pipe(rev.manifest('imgs.json'))
        .pipe(gulp.dest('rev'));
});

gulp.task('rev',function () {
    gulp.src(['./rev/js.json','app/vies/*.pug'])
        .pipe(revCollector())
        .pipe(gulp.dest('app/rev_views'));
});