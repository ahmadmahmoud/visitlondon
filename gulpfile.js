var gulp = require("gulp");
var sass = require("gulp-sass");
var browserSync = require("browser-sync");
var reload = browserSync.reload;
var prefix = require("gulp-autoprefixer");
var browserify = require("gulp-browserify");
var clean = require("gulp-clean");
var concat = require("gulp-concat");

var SourePath = {
  sassPath: "src/scss/*.scss",
  htmlSource: "src/*.html",
  jsSource: "src/js/**"
};

var AppPath = {
  root: "app",
  css: "app/css",
  js: "app/js"
};

gulp.task("sass", function() {
  return gulp
    .src(SourePath.sassPath)
    .pipe(prefix("last 2 versions"))
    .pipe(sass({ outputStyle: "expanded" }).on("error", sass.logError))
    .pipe(gulp.dest(AppPath.css));
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
  ["sass", "serve", "copy", "clean-html", "clean-scripts", "scripts"],
  function() {
    gulp.watch([SourePath.sassPath], ["sass"]);
    gulp.watch([SourePath.htmlSource], ["copy"]);
    gulp.watch([SourePath.jsSource], ["scripts"]);
  }
);

gulp.task("default", ["watch"]);
