const path = require('path');
const runSequence = require('run-sequence');
const del = require('del');
const gulp = require('gulp');
const shell = require('gulp-shell');
const hash = require('gulp-hash-src');
const ejs = require('gulp-ejs');

const paths = {
    src: './src',
    dist: './dist',
    assets: './dist/assets'
};

const NODE_ENV = process.env.NODE_ENV;
const __PROD__ = NODE_ENV === 'production';
const __DEV__ = !__PROD__;

// =============================================
// webpack
// =============================================
gulp.task('webpack', shell.task('webpack'));
gulp.task('webpack:watch', shell.task('webpack -w'));
gulp.task('webpack:server', shell.task('webpack-dev-server'));

// =============================================
// dist
// =============================================
gulp.task('dist:build', ['webpack'], () => {
    // build index.html from index.ejs
    return gulp.src(paths.src + '/index.ejs')
        .pipe(ejs({ NODE_ENV, __DEV__, __PROD__ }, {}, { ext: '.html' }))
        .pipe(gulp.dest(paths.dist))
        .pipe(hash({
            verbose: true,
            src_path: paths.assets,
            build_dir: paths.assets
        }))
        .pipe(gulp.dest(paths.dist));
});

gulp.task('dist:clean', (done) => {
    del([
        paths.assets + '/**/*.bundle.*',
        paths.dist + '/index.html'
    ], done);
});

// =============================================
// start
// =============================================
gulp.task('start', () => {
    return runSequence('dist:build', 'webpack:server');
});

// =============================================
// clean
// =============================================
gulp.task('clean', (done) => runSequence('test:clean', 'dist:clean', done));


// =============================================
// test
// =============================================
gulp.task('test', [], (done) => {
    return runSequence(
        'test:clean',
        'test:build',
        ['test:build:watch', 'test:run']
    );
});

gulp.task('test:clean', del.bind(null, ['.compiled']));
gulp.task('test:build', shell.task('NODE_ENV=test tsc'));
gulp.task('test:build:watch', shell.task(['NODE_ENV=test tsc -w']));
gulp.task('test:run', shell.task(['ava -w']));
