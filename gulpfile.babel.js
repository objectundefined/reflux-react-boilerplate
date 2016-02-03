import gulp from 'gulp';
import path from 'path';
import os from 'os'
import browserify from 'browserify';
import babelify from 'babelify';
import gutil from 'gulp-util';
import notify from 'gulp-notify';
import source from 'vinyl-source-stream'; // Used to stream bundle for further handling
import concat from 'gulp-concat';
import rimraf from 'gulp-rimraf'; 
import webserver from 'gulp-webserver';
import sourcemaps from 'gulp-sourcemaps';
import postcss from 'gulp-postcss';
import postcssUrl from 'postcss-url';
import postcssImport from 'postcss-import';
import minifyCss from 'gulp-minify-css';
import uglify from 'gulp-uglify';
import gulpif from 'gulp-if';
import streamify from 'gulp-streamify';
import minimist from 'minimist';
import browserifyInc from 'browserify-incremental';
  

const options = minimist(process.argv.slice(2), {
  boolean: 'production',
  default: { production: process.env.NODE_ENV == 'production' , port: 8000  }
});

const browserifyApp = browserifyInc(browserify({
  entries: [ 'app/js/main.js' ],
  transform: [ babelify ],
  debug: !options.production,
  cache: {}, packageCache: {}, fullPaths: !options.production,
  cacheFile: `${os.tmpdir()}/${__filename.replace(new RegExp("\/","g"),":")}.cache.json`
}));



gulp.task('appCss', bundleCss )
gulp.task('appJs', bundleJs );
gulp.task('watchAppJs', ()=> bundleJs(true) )
gulp.task('clean', clean )
gulp.task('copyHtml', copyHtml );

gulp.task('build', ['appJs', 'appCss', 'copyHtml'])

gulp.task('default', ['build']);

gulp.task('watch', ['build'], function(){
  gutil.log('watching')
  gulp.watch('app/js/**/*.js', ['appJs']).add('app/js/**/*.json')
  gulp.watch('app/css/**/*.css', ['appCss']).add('app/css/**/*.css')
  gulp.watch('app/index.html', ['copyHtml'])
})

gulp.task('serve', ['build'], function(){
  gulp.src('build/').pipe(webserver({
    livereload: {
      enable: !options.production,
      port: 35000
    },
    open: !options.production,
    port: options.port,
    proxies: [
      { source: '/db', target: 'http://fl1.deep6analytics.com:7474/db', options: {} }
    ],
    fallback: 'index.html'
  }));
})

function bundleJs(watching=false) {
  var bundling = browserifyApp.bundle();
  if (watching) {
    bundling = bundling
      .on("error", notify.onError(function (error) {
        return "Error Building JS: " + error.message;
      }))
      .on("error", function(error){
        this.end()
      })
  }
  
  return bundling
    .pipe(source('main.js'))
    .pipe(gulpif(options.production, streamify(uglify({mangle:false}))))
    .pipe(gulp.dest('build/js'))  
    .on('error', gutil.log)
    .pipe(notify({ message: 'built build/js/main.js' }))
}

function bundleCss() {
  return gulp.src('app/css/**/*.css')
    .pipe(gulpif(!options.production, sourcemaps.init()))
    .pipe(postcss([
      postcssImport(['.', './app/css']),
      postcssUrl({ url: 'copy', assetsPath: '../assets/', useHash:true }) 
    ], {to: 'build/css/main.css' }))
    .pipe(concat('main.css'))
    .pipe(gulpif(!options.production, sourcemaps.write()))
    .pipe(gulpif(options.production, minifyCss({rebase: false})))
    .pipe(gulp.dest('build/css'))
    .on('error', gutil.log)
    .pipe(notify({ message: 'built build/css/main.css' }));
}

function clean(){      
  return gulp.src(['build'])
    .pipe(rimraf())
    .on('error', gutil.log)
    .pipe(notify({onLast:true, message: 'cleaned build directory' }))
}

function copyHtml(){
  return gulp.src('app/index.html').pipe(gulp.dest('build/'))
    .on('error', gutil.log)
    .pipe(notify({onLast:true, message: 'copied index.html' }))
}