/*
-----
del: "^6.0.0"
gulp-sass + sass
gulp-imagemin: "^7.1.0"
-----

Gulp-Autoprefixer/ префиксы для css
Gulp-CSSBeautify/для читабельности css на выходе
Gulp-Strip-CSS-Comments/для удаления комментариев css
Gulp-Rename/ для переименования файлов
Gulp-Sass/ компилятор
Gulp-CSSnano/ сжимает css файл
Gulp-Rigger/ склеивает js файлы
Gulp-Uglify/ сжимает js файл
Gulp-Plumber/ не ламает gulp при ошибках
Gulp-Imagemin/ сжимает и оптимизирует изображеня
Del/ очищает файлы которые не нужны
Panini / для удобства работы с html
BrowserSync/ локальный сервер
*/
"use strict";

const { src, dest } = require("gulp");
const gulp = require("gulp");
const autoprefixer = require("gulp-autoprefixer");
const cssBeautify = require("gulp-cssbeautify");
const removeComments = require("gulp-strip-css-comments");
const rename = require("gulp-rename");
const rigger = require("gulp-rigger");
const sass = require("gulp-sass")(require("sass"));
const cssNano = require("gulp-cssnano");
const uglify = require("gulp-uglify");
const plumber = require("gulp-plumber");
const panini = require("panini");
const imagemin = require("gulp-imagemin");
const notify = require("gulp-notify");
const del = require("del");
const { stream } = require("browser-sync");
const browserSync = require("browser-sync").create();

/*Paths*/
const srcPath = "src/";
const distPath = "dist/";

const path = {
  build: {
    html: distPath,
    css: distPath + "assets/css/",
    js: distPath + "assets/js/",
    images: distPath + "assets/images/",
    fonts: distPath + "assets/fonts/",
  },

  src: {
    html: srcPath + "*.html",
    css: srcPath + "assets/scss/*.scss",
    js: srcPath + "assets/js/*.js",
    images:
      srcPath +
      "assets/images/**/*.{jpeg,jpg,png,svg,gif,ico,webp,webmanifest,xml,json}",
    fonts: srcPath + "assets/fonts/**/*.{eot,woff, woff2,ttf,sfg}",
  },

  watch: {
    html: srcPath + "**/*.html",
    css: srcPath + "assets/scss/**/*.scss",
    js: srcPath + "assets/js/**/*.js",
    images:
      srcPath +
      "assets/images/**/*.{jpeg,jpg,png,svg,gif,ico,webp,webmanifest,xml,json}",
    fonts: srcPath + "assets/fonts/**/*.{eot,woff, woff2,ttf,sfg}",
  },

  clean: "./" + distPath,
};

function server() {
  browserSync.init({
    server: {
      baseDir: "./" + distPath,
    },
  });
}

function html() {
  panini.refresh();
  return src(path.src.html, { base: srcPath })
    .pipe(plumber())
    .pipe(
      panini({
        root: srcPath,
        layouts: srcPath + "tpl/layouts/",
        partials: srcPath + "tpl/partials/",
        data: srcPath + "tpl/data/",
      })
    )
    .pipe(dest(path.build.html))
    .pipe(browserSync.reload({ stream: true }));
}

function css() {
  return src(path.src.css, { base: srcPath + "assets/scss/" })
    .pipe(
      plumber({
        errorHandler: function (err) {
          notify.onError({
            title: "SCSS Error",
            message: "Error: <%= error.message %",
          })(err);
          this.emint("end");
        },
      })
    )
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(cssBeautify())
    .pipe(dest(path.build.css))
    .pipe(
      cssNano({
        zindex: false,
        discardComments: {
          removeAll: true,
        },
      })
    )
    .pipe(removeComments())
    .pipe(
      rename({
        suffix: ".min",
        extname: ".css",
      })
    )
    .pipe(dest(path.build.css))
    .pipe(browserSync.reload({ stream: true }));
}

function js() {
  return src(path.src.js, { base: srcPath + "assets/js/" })
    .pipe(
      plumber({
        errorHandler: function (err) {
          notify.onError({
            title: "JS Error",
            message: "Error: <%= error.message %",
          })(err);
          this.emint("end");
        },
      })
    )
    .pipe(rigger())
    .pipe(dest(path.build.js))
    .pipe(uglify())
    .pipe(
      rename({
        suffix: ".min",
        extname: ".js",
      })
    )
    .pipe(dest(path.build.js))
    .pipe(browserSync.reload({ stream: true }));
}

function images() {
  return src(path.src.images, { base: srcPath + "assets/images/" })
    .pipe(
      imagemin([
        imagemin.gifsicle({ interlaced: true }),
        imagemin.mozjpeg({ quality: 75, progressive: true }),
        imagemin.optipng({ optimizationLevel: 5 }),
        imagemin.svgo({
          plugins: [{ removeViewBox: true }, { cleanupIDs: false }],
        }),
      ])
    )
    .pipe(dest(path.build.images))
    .pipe(browserSync.reload({ stream: true }));
}

function fonts() {
  return src(path.src.fonts, { base: srcPath + "assets/fonts/" }).pipe(
    browserSync.reload({ stream: true })
  );
}

function clean() {
  return del(path.clean);
}

function watchFailes() {
  gulp.watch([path.watch.html], html);
  gulp.watch([path.watch.css], css);
  gulp.watch([path.watch.js], js);
  gulp.watch([path.watch.images], images);
  gulp.watch([path.watch.fonts], fonts);
}

const build = gulp.series(clean, gulp.parallel(html, css, js, images, fonts));
const watch = gulp.parallel(build, watchFailes, server);

exports.html = html;
exports.css = css;
exports.js = js;
exports.images = images;
exports.clean = clean;
exports.fonts = fonts;
exports.build = build;
exports.watch = watch;
exports.default = watch;
