var gulp        = require('gulp'),
    rename      = require('gulp-rename'),
    fileinclude = require('gulp-file-include'),
    min_html    = require('gulp-minify-html'),
    sass        = require('gulp-sass'),
    min_css     = require('gulp-minify-css'),
    sourcemaps  = require('gulp-sourcemaps'),
    min_js      = require('gulp-minify')
    lr          = require('tiny-lr'),
    connect     = require('gulp-connect');

var server    = lr();

//HTML
gulp.task('html', function() {
    //settings for minifying html
    var f_opts = {
        prefix: '@@',
        basepath: './src/'
    }
    var m_opts = {
        conditionals: true
    }
    return gulp.src('src/*.html')
        .pipe(fileinclude(f_opts))
        .pipe(min_html(m_opts))
        .pipe(gulp.dest('.'))
        .pipe(connect.reload() );
})

gulp.task('html:watch', function () {
    server.listen(4002, function (e) {
        if (e) {
            return console.log(e)
        };
    gulp.watch(['./src/*.html',
        './src/snippets/panels/*.html'], ['html']);
        //'./src/snippets/components/*.html',
        //'./src/snippets/pages/*.html',

    });
});


// STYLES
gulp.task('styles', ['sass', 'css', 'css-images']);

gulp.task('sass', function() {
    return gulp.src('src/sass/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({ style: 'expanded', outputStyle: 'nested', noCache: true, errLogToConsole: true, sourcemap: true }))
        .pipe(sourcemaps.write())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('./css'))
        .pipe(connect.reload() );
});

gulp.task('css', function() {
    return gulp.src('src/css/*.css')
        .pipe(sourcemaps.init())
        .pipe(min_css())
        .pipe(sourcemaps.write())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('./css'));
})

gulp.task('css-images', function() {
    /*return gulp.src('src/css/images/*.*')
        .pipe(gulp.dest('./css/images'));*/
})

gulp.task('fonts', function() {
     return gulp.src('src/fonts/*.*')
        .pipe(gulp.dest('./fonts'));
})

gulp.task('styles:watch', function () {
    server.listen(4002, function (e) {
        if (e) {
            return console.log(e)
        };
    gulp.watch(['./src/sass/*.scss'], ['styles']);
    });
});

// IMAGES
gulp.task('images', function() {
    return gulp.src('src/img/*.jpg')
        .pipe(gulp.dest('./img'));
})

// JAVASCRIPT
gulp.task('js', function() {
    return gulp.src('src/js/*.js')
        //.pipe(min_js({
        //    ignoreFiles: ['.min.js', '-min.js']
        //}))
        .pipe(rename({ suffix: '-min' }))
        .pipe(gulp.dest('./js'))
        .pipe(connect.reload() );
});

gulp.task('js:watch', function () {
    server.listen(4002, function (e) {
        if (e) {
            return console.log(e)
        };
    gulp.watch(['./src/js/*.js'], ['js']);
    });
});

// SERVER TASKS
gulp.task('connect', function() {
  connect.server({
    root: '.',
    livereload: true
  });
});
gulp.task('serverKill', function() {
    server.close();
})

gulp.task('watch', ['html:watch', 'js:watch', 'styles:watch']);

gulp.task('default', ['html', 'styles', 'fonts', 'images', 'js', 'serve']);

gulp.task('serve',['watch', 'connect']);

