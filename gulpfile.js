import gulp from 'gulp';
import plumber from 'gulp-plumber';
import less from 'gulp-less';
import postcss from 'gulp-postcss';
import csso from 'postcss-csso';
import rename from 'gulp-rename';
import autoprefixer from 'autoprefixer';
import htmlmin from 'gulp-htmlmin';
import terser from 'gulp-terser';
import squoosh from 'gulp-libsquoosh';
import svgo from 'gulp-svgmin';
import svgstore from 'gulp-svgstore';
import del from 'del';
import browser from 'browser-sync';

const clean = () => del('build')

// Styles

const stylesBuild = () => {
  return gulp.src('source/less/style.less')
  .pipe(plumber())
  .pipe(less())
  .pipe(postcss([
    autoprefixer(),
    csso()
  ]))
  .pipe(rename('style.min.css'))
  .pipe(gulp.dest('build/css'));
}

const htmlBuild = () => {
  return gulp.src('source/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('build'))
}

const scriptsBuild = () => {
  return gulp.src('source/js/*.js')
    .pipe(terser())
    .pipe(gulp.dest('build/js'))
}

const imagesBuild = () => {
  return gulp.src('source/img/**/*.{jpg,png}')
    .pipe(squoosh())
    .pipe(gulp.dest('build/img'))
}

const webpBuild = () => gulp.src('source/img/**/*.{jpg,png}')
  .pipe(squoosh({
    webp: {}
  }))
  .pipe(gulp.dest('build/img'));

const svgBuild = () => gulp.src('source/img/*.svg', '!source/img/icons/*.svg')
  .pipe(svgo())
  .pipe(gulp.dest('build/img'));

const sprite = () => {
  del('source/img.sprite.svg');

  return gulp.src('source/img/icons/*.svg')
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename('sprite.svg'))
    .pipe(gulp.dest('source/img'))
}

const spriteBuild = () => gulp.src('source/img/icons/*.svg')
  .pipe(svgstore({
    inlineSvg: true
  }))
  .pipe(svgo())
  .pipe(rename('sprite.svg'))
  .pipe(gulp.dest('build/img'))

const copyBuild = () => gulp.src([
  'source/fonts/*.{woff2,woff}',
  'source/*.ico'], {
    base: 'source'
  })
  .pipe(gulp.dest('build'))

export const styles = () => {
  return gulp.src('source/less/style.less', { sourcemaps: true })
    .pipe(plumber())
    .pipe(less())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest('source/css', { sourcemaps: '.' }))
    .pipe(browser.stream());
}

// Server

const server = (done) => {
  browser.init({
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
  gulp.watch('source/less/**/*.less', gulp.series(styles));
  gulp.watch('source/*.html').on('change', browser.reload);
  gulp.watch('source/img/icons/*.svg', gulp.series(sprite) );
}

export const build = gulp.series(
    clean,
    copyBuild,
    gulp.parallel(
      stylesBuild,
      htmlBuild,
      scriptsBuild,
      imagesBuild,
      webpBuild,
      svgBuild,
      spriteBuild,
    ),
  );

export default gulp.series(
  styles, sprite, server, watcher
);
