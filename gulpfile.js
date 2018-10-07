const del  = require('del');
const gulp = require('gulp');
const pug = require('gulp-pug');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const { events } = require('./events.json')

const destDir = 'docs';

function errorHandling(error) {
    console.log(error.message);
    this.emit('end');
}

gulp.task('clean', () => {
    return del.sync(destDir + '/*', {force: true});
});

gulp.task('css', () => {
    return gulp.src('scss/**/*.scss')
        .pipe(sass())
        .pipe(autoprefixer({
          browsers: ['last 2 versions'],
        }))
        .on('error', errorHandling)
        .pipe(gulp.dest(destDir + '/css'));
});

gulp.task('assets', () => {
    return gulp.src('assets/**/*')
        .pipe(gulp.dest(destDir + '/assets'));
});

gulp.task('js', () => {
    return gulp.src('js/**/*')
        .pipe(gulp.dest(destDir + '/js'));
});

gulp.task('pug', () => {
    return gulp.src('view/**/*.pug')

        .pipe(pug({
            pretty: true,
            data: {
                events: JSON.stringify(events)
                //events
            }
        }))
        .on('error', errorHandling)
        .pipe(gulp.dest(destDir));
});

gulp.task('watch', ['default'], () => {
    gulp.watch('scss/**/*.scss', ['css']);
    gulp.watch('view/**/*.pug', ['pug']);
    gulp.watch('assets/**/*', ['assets']);
    gulp.watch('js/**/*', ['js']);
});

gulp.task('default', ['clean', 'pug', 'css', 'assets', 'js']);
