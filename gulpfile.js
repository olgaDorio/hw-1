const del  = require('del');
const gulp = require('gulp');
const pug = require('gulp-pug');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');

var ts = require("gulp-typescript");

var tsProjectIndex = ts.createProject({
  "target": "es6",
  "module": "amd",
  "outFile": "index.js",
  "lib": ["dom", "es2017", "dom.iterable"],
  "strict": true,
  "esModuleInterop": true,
});

var tsProjectPlayer = ts.createProject({
  "target": "es6",
  "module": "amd",
  "outFile": "player.js",
  "lib": ["dom", "es2017", "dom.iterable"],
  "strict": true,
  "esModuleInterop": true,
})


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

gulp.task('ts-index', () => {
  return gulp.src("ts/index.ts")
    .pipe(tsProjectIndex())
    .js.pipe(gulp.dest(destDir + '/js'));
});

gulp.task('ts-player', () => {
  return gulp.src("ts/player.ts")
    .pipe(tsProjectPlayer())
    .js.pipe(gulp.dest(destDir + '/js'));
});

gulp.task('pug', () => {
    return gulp.src('view/**/*.pug')
        .pipe(pug())
        .on('error', errorHandling)
        .pipe(gulp.dest(destDir));
});

gulp.task('watch', ['default'], () => {
    gulp.watch('scss/**/*.scss', ['css']);
    gulp.watch('view/**/*.pug', ['pug']);
    gulp.watch('assets/**/*', ['assets']);
    gulp.watch('ts/**/*', ['ts-index', 'ts-player']);
});

gulp.task('default', ['clean', 'pug', 'css', 'assets', 'ts-player', 'ts-index']);
