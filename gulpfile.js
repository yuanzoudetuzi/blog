/**
 * Created by Administrator on 2017/10/27.
 * gulp配置文件
 */
var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;
gulp.task('browser-sync',function () {
    browserSync.init({
        server:'./app.js'
        /*{
            baseDir:'./app'
        }*/
    });
    gulp.watch('./app/views/*').on('change',reload);
});