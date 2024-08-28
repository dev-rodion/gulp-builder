const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const cleanCSS = require('gulp-clean-css');
const browserSync = require('browser-sync').create();

const paths = {
    styles: {
        src: 'src/styles/**/*.scss',
        dest: './assets/styles/'
    },
    scripts: {
        src: 'src/scripts/**/*.js',
        dest: './assets/scripts/'
    },
    html: {
        src: 'src/*.html',
        dest: './assets/'
    }
};

async function clean() {
    const { deleteAsync } = await import('del');
    return deleteAsync(['assets']);
}

function styles() {
    return gulp.src(paths.styles.src)
        .pipe(sass().on('error', sass.logError))
        .pipe(cleanCSS())
        .pipe(rename({
            basename: 'main',
            suffix: '.min'
        }))
        .pipe(gulp.dest(paths.styles.dest))
        .pipe(browserSync.stream());
}

function scripts() {
    return gulp.src(paths.scripts.src, { sourcemaps: true })
        .pipe(babel())
        .pipe(uglify())
        .pipe(concat('main.min.js'))
        .pipe(gulp.dest(paths.scripts.dest))
        .pipe(browserSync.stream());
}

function html() {
    return gulp.src(paths.html.src)
        .pipe(gulp.dest(paths.html.dest))
        .pipe(browserSync.stream());
}

function serve() {
    browserSync.init({
        server: {
            baseDir: './assets/'
        }
    });

    gulp.watch(paths.scripts.src, scripts);
    gulp.watch(paths.styles.src, styles);
    gulp.watch(paths.html.src, html);
    gulp.watch(paths.html.src).on('change', browserSync.reload);
}

const build = gulp.series(clean, gulp.parallel(styles, scripts, html));
const dev = gulp.series(build, serve);

/*
 * You can use CommonJS `exports` module notation to declare tasks
 */
exports.clean = clean;
exports.styles = styles;
exports.scripts = scripts;
exports.html = html;
exports.serve = serve;
exports.build = build;
exports.dev = dev;
exports.watch = serve;
/*
 * Define default task that can be called by just running `gulp` from cli
 */
exports.default = build;