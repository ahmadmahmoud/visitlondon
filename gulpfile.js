var gulp = require("gulp");
var sass = require("gulp-sass");
var browserSync = require("browser-sync");

var SourePath = {
  sassPath: "src/scss/*.scss"
};

var AppPath = {
  root: "app",
  css: "app/css",
  js: "app/js"
};

gulp.task("sass", function() {
  return gulp
    .src(SourePath.sassPath)
    .pipe(sass({ outputStyle: "expanded" }).on("error", sass.logError))
    .pipe(gulp.dest(AppPath.css));
});

gulp.task("serve", function() {
  browserSync.init(
    [AppPath.css + "/*.css", AppPath.root + "/*.html", AppPath.js + "/*.js"],
    {
      server: {
        baseDir: AppPath.root
      }
    }
  );
});

gulp.task("watch", ["sass", "serve"], function() {
  gulp.watch([SourePath.sassPath], ["sass"]);
});

gulp.task("default", ["watch"]);
