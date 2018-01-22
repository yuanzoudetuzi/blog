/**
 * Created by Administrator on 2017/10/27.
 * gulp配置文件
 */
let gulp = require('gulp');
let babel = require('gulp-babel'),
    uglify = require('gulp-uglify'),
    minCSS = require('gulp-minify-css'),
    minImg = require('gulp-imagemin'),
    sourcemaps = require('gulp-sourcemaps'),
    rev = require('gulp-rev'),
    sequence = require('gulp-sequence'),
    del = require('del'),                     /*用于清除之前压缩合并的文件夹,防止出现路径二次替换*/
    revCollector = require('gulp-rev-collector');
let browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    babelify = require('babelify'),
    buffer = require('vinyl-buffer'),
    standalonify = require('standalonify');
let browserSync = require('browser-sync').create();
let reload = browserSync.reload;
let bundleIngoreJsFile = ['!public/js/index.js','!public/js/random.js','!public/js/rain.js','!public/js/sunshine.js','!public/js/cloud.js'];
let bundleJsFil  = ['public/js/index.js','public/js/random.js','public/js/rain.js','public/js/sunshine.js','public/js/cloud.js'];

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
    del.sync(['public/dist/js']);
   return gulp.src(['public/js/**/*.js'].concat(bundleIngoreJsFile))
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(uglify())
        .pipe(rev())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('public/dist/js'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('rev/js'));
   // return del([
   //      'public/dist/js',
   //  ]).then(()=>{
   //
   //  });

});

gulp.task('minCSS', function () {
    del.sync(['public/dist/css']);
   return gulp.src('public/css/**/*.css')
        .pipe(sourcemaps.init())
        .pipe(minCSS())
        .pipe(rev())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('public/dist/css'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('rev/css'));
   // return del([
   //      'public/dist/css',
   //  ]).then(()=> {
   //
   //  });

});

gulp.task('minImg', function () {
    del.sync(['public/dist/imgs']);
    return gulp.src('public/imgs/**/*.*')
        .pipe(minImg())
        .pipe(rev())
        .pipe(gulp.dest('public/dist/imgs'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('rev/imgs'));
   // return del([
   //      'public/dist/imgs',
   //  ]).then(()=>{
   //
   //  });
});

//index包含import,需要单独使用browserify进行模块打包
gulp.task('bundle-js', function () {
    del.sync(['public/dist/js/index-*']);
   return browserify({
        entries: 'public/js/index.js', //指定打包入口文件
        debug: true   //告知browserify在运行同时生成内联sourcemap用于调试
    })
        .plugin(standalonify, {  //使打包后的js文件符合UMD规范并指定外部依赖包
            name: 'FlareJ',
            deps: {
                'nornj': 'nj',
                'react': 'React',
                'react-dom': 'ReactDOM'
            }
        })
        .transform(babelify,  {        //使用babel转换es6代码
            presets: [
                'es2015'  //转换es6代码
            ]
        })
        .bundle()  //合并打包
        .pipe(source('index.js'))  //将常规流转换为包含Stream的vinyl对象，并且重命名
        .pipe(buffer())  //将vinyl对象内容中的Stream转换为Buffer
        .pipe(uglify())
        .pipe(rev())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest('public/dist/js'))  //输出打包后的文件
        .pipe(rev.manifest())
        .pipe(gulp.dest('rev/bundle'));
   // return del([]).then(()=>{
   //
   //  });
});

gulp.task('rev',function () {
    del.sync(['app/rev_views/']);
    gulp.src(['rev/**/*.json','app/views/*.pug'])
        .pipe(revCollector({
            replaceReved:true,       //一定要加上这一句，不然不会替换掉上一次的值
            dirReplacements: {
                '/css/':'/dist/css/',     //确定路径的更换
                '/js/':'/dist/js/',
                '/imgs/':'/dist/imgs/',
            }
        }))
        .pipe(gulp.dest('app/rev_views/'));
    gulp.src(['rev/**/*.json','public/dist/js/**/*.*'])
        .pipe(revCollector({
            replaceReved:true,       //一定要加上这一句，不然不会替换掉上一次的值
            dirReplacements: {
                '/css/':'/dist/css/',     //确定路径的更换
                '/js/':'/dist/js/',
                '/imgs/':'/dist/imgs/',
            }
        }))
        .pipe(gulp.dest('public/dist/js/'));
    gulp.src(['rev/**/*.json','public/dist/css/**/*.*'])
        .pipe(revCollector({
            replaceReved:true,       //一定要加上这一句，不然不会替换掉上一次的值
            dirReplacements: {
                '/css/':'/dist/css/',     //确定路径的更换
                '/js/':'/dist/js/',
                '/imgs/':'/dist/imgs/',
            }
        }))
        .pipe(gulp.dest('public/dist/css/'));



});

gulp.task('watch',function () {
    gulp.watch(['public/js/**/*.js'].concat(bundleIngoreJsFile),sequence('minJS','rev'));
    gulp.watch('/public/css/**/*.css',sequence('minCSS','rev'));
    gulp.watch('/public/imgs/**/*.*',sequence('minImg','rev'));
    gulp.watch(bundleJsFile,sequence('bundle-js','rev'));
});
// gulp.task('clean-dist',function () {
//     del([
//         'public/dist/',
//     ]);
// });
gulp.task('default',sequence('minJS','minCSS','minImg','bundle-js','rev'));