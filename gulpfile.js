import gulp from 'gulp';
import plumber from 'gulp-plumber';
import sourcemap from 'gulp-sourcemaps';
import less from 'gulp-less';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import broswerSync from 'browser-sync';
import babel from 'gulp-babel';  //преобразует код для старых браузеров
import concat from 'gulp-concat';  //для конкатенации (объединения) файлов js
import uglify from 'gulp-uglify';  //Минимизирует JavaScript
import clean from 'gulp-clean';
import csso from 'gulp-csso';  //минимизирует css
import rename from 'gulp-rename';  //переименовывает css в min.css
import imagemin from 'gulp-imagemin';

const sync = broswerSync.create();

//img

const images = () => {
  return gulp.src('source/img/**/*.{jpg,png,svg}')
    .pipe(imagemin())
    .pipe(gulp.dest("docs/img")) //куда кладем
};

// Scripts

const cleanJs = () => {
  return gulp.src("source/js/**/*.min.js", { read: false, allowEmpty: true })
    .pipe(clean());
};

const scripts = () => {
  return gulp.src("source/js/**/*.js", { sourcemaps: true }) //** -все, * -любое
    .pipe(babel())
    .pipe(uglify())
    .pipe(concat('main.min.js'))
    .pipe(gulp.dest("source/js"))
    .pipe(gulp.dest("docs/js"));
};

const cleanFunc = () => {
  cleanJs();
  return gulp.src('docs', { read: false, allowEmpty: true })
    .pipe(clean());
};

// Styles

const styles = () => {
  return gulp.src("source/less/style.less")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(less())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(csso())
    .pipe(rename("style.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("docs/css"))
    .pipe(gulp.dest("source/css"))
    .pipe(sync.stream());
};

//копируем все в docs

const fonts = () => {
  return gulp.src("source/fonts/**/*.{woff,woff2}")
    .pipe(gulp.dest("docs/fonts"))
}

const favicons = () => {
  return gulp.src("source/favicon/**/*")
    .pipe(gulp.dest("docs/favicon"))
}

const html = () => {
  return gulp.src("source/**/*.html")
    .pipe(gulp.dest("docs"))
};


// Server

const server = (done) => {
  sync.init({
    server: {
      baseDir: 'source'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

// Watcher

const watcher = () => {
  gulp.watch("source/less/**/*.less", gulp.series(styles));
  gulp.watch(["source/js/**/*.js", "!source/js/**/*.min.js"], gulp.series(cleanJs, scripts, sync.reload));
  gulp.watch("source/*.html").on("change",  sync.reload);
}

const build = gulp.series(cleanFunc, images, gulp.parallel(styles, scripts, favicons, fonts, html));

export {
  build
}

export default gulp.series(
  styles, scripts, server, watcher
);
