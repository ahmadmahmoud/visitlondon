var gulp = require("gulp");
var sass = require("gulp-sass");
var browserSync = require("browser-sync");
var reload = browserSync.reload;
var prefix = require("gulp-autoprefixer");
var browserify = require("gulp-browserify");
var clean = require("gulp-clean");
var concat = require("gulp-concat");
var merge = require("merge-stream");
var newer = require("gulp-newer");
var imagemin = require("gulp-imagemin");
var minify = require("gulp-minify");
var rename = require("gulp-rename");
var cssmin = require("gulp-cssmin");

var SourePath = {
  sassPath: "src/scss/*.scss",
  htmlSource: "src/*.html",
  jsSource: "src/js/**",
  imgSource: "src/img/**"
};

var AppPath = {
  root: "app",
  css: "app/css",
  js: "app/js",
  img: "app/img"
};

gulp.task("sass", function() {
  var bootstrapCSS = gulp.src(
    "./node_modules/bootstrap/dist/css/bootstrap.css"
  );
  var sassFiles;
  sassFiles = gulp
    .src(SourePath.sassPath)
    .pipe(prefix("last 2 versions"))
    .pipe(sass({ outputStyle: "expanded" }).on("error", sass.logError));
  return merge(bootstrapCSS, sassFiles)
    .pipe(concat("app.css"))
    .pipe(gulp.dest(AppPath.css));
});

gulp.task("images", function() {
  return gulp
    .src(SourePath.imgSource)
    .pipe(newer(AppPath.img))
    .pipe(imagemin())
    .pipe(gulp.dest(AppPath.img));
});

gulp.task("clean-html", function() {
  return gulp
    .src(AppPath.root + "/*.html", { read: false, force: true })
    .pipe(clean());
});

gulp.task("clean-scripts", function() {
  return gulp
    .src(AppPath.js + "/*.js", { read: false, force: true })
    .pipe(clean());
});

gulp.task("scripts", ["clean-scripts"], function() {
  gulp
    .src(SourePath.jsSource)
    .pipe(concat("main.js"))
    .pipe(browserify())
    .pipe(gulp.dest(AppPath.js));
});

gulp.task("minifyjs", function() {
  gulp
    .src(SourePath.jsSource)
    .pipe(concat("main.js"))
    .pipe(browserify())
    .pipe(minify())
    .pipe(gulp.dest(AppPath.js));
});

gulp.task("minifycss", function() {
  var bootstrapCSS = gulp.src(
    "./node_modules/bootstrap/dist/css/bootstrap.css"
  );
  var sassFiles;
  sassFiles = gulp
    .src(SourePath.sassPath)
    .pipe(prefix("last 2 versions"))
    .pipe(sass({ outputStyle: "expanded" }).on("error", sass.logError));
  return merge(bootstrapCSS, sassFiles)
    .pipe(concat("app.css"))
    .pipe(cssmin())
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest(AppPath.css));
});

gulp.task("copy", ["clean-html"], function() {
  gulp.src(SourePath.htmlSource).pipe(gulp.dest(AppPath.root));
});

gulp.task("serve", ["sass"], function() {
  browserSync.init(
    [AppPath.css + "/*.css", AppPath.root + "/*.html", AppPath.js + "/*.js"],
    {
      server: {
        baseDir: AppPath.root
      }
    }
  );
});

gulp.task(
  "watch",
  ["sass", "serve", "copy", "clean-html", "clean-scripts", "scripts", "images"],
  function() {
    gulp.watch([SourePath.sassPath], ["sass"]);
    gulp.watch([SourePath.htmlSource], ["copy"]);
    gulp.watch([SourePath.jsSource], ["scripts"]);
    gulp.watch([SourePath.jsSource], ["images"]);
  }
);

gulp.task("default", ["watch"]);

gulp.task("production", ["minifyjs", "minifycss"]);
