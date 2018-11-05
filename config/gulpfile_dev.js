const url = require("url")
var gulp = require('gulp');
var webserver = require('gulp-webserver'); //web服务热启动
var browserify = require('gulp-browserify'); //模块化的打包
var autoprefixer = require('gulp-autoprefixer'); //自动添加浏览器前缀
var cleanCSS = require('gulp-clean-css'); //css的压缩
var uglify = require('gulp-uglify');
var htmlmin = require('gulp-htmlmin');
var sequence = require('gulp-sequence');
gulp.task("html", () => {
    gulp.src("./src/**/*.html")
        .pipe(htmlmin({
            removeComments: true, //清除HTML注释
            collapseWhitespace: true, //压缩HTML
            collapseBooleanAttributes: true, //省略布尔属性的值 <input checked="true"/> ==> <input checked />
            removeEmptyAttributes: true, //删除所有空格作属性值 <input id="" /> ==> <input />
            minifyJS: true, //压缩页面JS
            minifyCSS: true //压缩页面CSS
        }))
        .pipe(gulp.dest("dist"))
})
gulp.task("jsModule", () => {
    gulp.src("./src/**/*.js")
        .pipe(browserify({
            insertGlobals: true,
            debug: !gulp.env.production
        }))
        .pipe(uglify())
        .pipe(gulp.dest("./dist"))
})

gulp.task("cssCopy", () => {
    gulp.src("./src/**/*.css")
        .pipe(autoprefixer({
            borwsers: ['last 2 versions', 'Android > 4.0']
        }))
        .pipe(cleanCSS())
        .pipe(gulp.dest("./dist"));
})
gulp.task("htmlCopyServer", ["jsModule", "cssCopy", "html"], () => {
    gulp.src("./src/**/*.html")
        .pipe(gulp.dest("./dist"))
        .on('end', () => {
            // 只有监听到html复制完毕，才会启动服务
            sequence(['server'], () => {
                console.log("服务启动")
            })
        });
})

gulp.task('server', function() {
    gulp.src("./dist")
        .pipe(webserver({
            livereload: true,
            directoryListing: true,
            open: "/html/index.html",
            host: "127.0.0.1",
            port: "8883",
        }));
});

gulp.task("dev", ["htmlCopyServer"], () => {

    console.log("this is a beautiful world");
});