/*
Gulp-autoprefixer собирает CSS файл с префиксами для различных браузеров, плюс добавляет правила для поддержки старых браузеров.
CSS Beautify автоматически форматирует стиль, чтобы он был последовательным и легким для чтения.
Gulp-Strip-CSS-Comments удаление комментариев из CSS.
Gulp-rename // Переименовывает файлы. gulp-uncss // Удаляет лишние стили. gulp-uglify // Минификация скриптов.
Gulp-CSSnano Минимизируйте CSS
Gulp-Rigger движок времени сборки для Javascript, CSS, CoffeeScript и в целом любого типа текстового файла, в который хотим «включить» другие файлы.
Gulp-Uglify Минимизируйте JavaScript 
Gulp-Plumber  он заменяет метод и удаляет стандартный обработчик событий, который по умолчанию отменяет потоки при ошибке.pipeonerrorerror
gulp-imagemin Сведение изображений в форматах PNG, JPEG, GIF и SVG и др
del удалить Файлы Папки Каталог и убирать разрушать мусор отсоединитьчистыйчисткауборка.rmрмрфРимрафРмдирШарgulpfriendlyфайлпапкакаталогфсфайловая система
Panini  компилирует серию HTML-страниц, используя общий макет. 
BrowserSync для переименования
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
const del = require("del");
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

function html() {
  return src(path.src.html, { base: srcPath })
    .pipe(plumber())
    .pipe(dest(path.build.html));
}

function css() {
  return src(path.src.css, { base: srcPath + "assets/scss/" })
    .pipe(plumber())
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
    .pipe(dest(path.build.css));
}

function js() {
  return src(path.src.js, { base: srcPath + "assets/js/" })
    .pipe(plumber())
    .pipe(rigger())
    .pipe(dest(path.build.js))
    .pipe(uglify())
    .pipe(
      rename({
        suffix: ".min",
        extname: ".js",
      })
    )
    .pipe(dest(path.build.js));
}

function images() {
  return src(path.src.images, { base: srcPath + "assets/images/" })
    .pipe(
      imagemin([
        imagemin.gifsicle({ interlaced: true }),
        imagemin.mozjpeg({ quality: 80, progressive: true }),
        imagemin.optipng({ optimizationLevel: 5 }),
        imagemin.svgo({
          plugins: [{ removeViewBox: true }, { cleanupIDs: false }],
        }),
      ])
    )
    .pipe(dest(path.build.images));
}

exports.html = html;
exports.css = css;
exports.js = js;
exports.images = images;
