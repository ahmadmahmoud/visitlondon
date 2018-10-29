var gulp = require("gulp");
var sass = require("gulp-sass");
var browserSync = require("browser-sync");
var reload = browserSync.reload;
var prefix = require("gulp-autoprefixer");

var SourePath = {
  sassPath: "src/scss/*.scss",
  htmlSource: "src/*.html"
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

gulp.task("copy", function() {
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

gulp.task("watch", ["sass", "serve", "copy"], function() {
  gulp.watch([SourePath.sassPath], ["sass"]);
  gulp.watch([SourePath.htmlSource], ["copy"]);
});

gulp.task("default", ["watch"]);
