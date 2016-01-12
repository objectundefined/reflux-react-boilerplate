var gulp = require('gulp');
var path = require('path');
var browserify = require('browserify');
var babelify = require('babelify');
var browserifyBower = require('browserify-bower');
var bowerFiles = require('main-bower-files');
var gutil = require('gulp-util');
var notify = require('gulp-notify');
var source = require('vinyl-source-stream'); // Used to stream bundle for further handling
var concat = require('gulp-concat');
var rimraf = require('gulp-rimraf'); 
var webserver = require('gulp-webserver');
var sourcemaps = require('gulp-sourcemaps');
var postcss = require('gulp-postcss');
var postcssUrl = require('postcss-url');
var minifyCss = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var gulpif = require('gulp-if');
var streamify = require('gulp-streamify');
var minimist = require('minimist');

const options = minimist(process.argv.slice(2), {
  boolean: 'production',
  default: { production: process.env.NODE_ENV == 'production' , port: 8000  }
});

const TRANSFORMS = {
  BABEL : [ "babelify", { presets : [ "es2015", "react"] } ]
};
const MAIN = 'app/js/main.js';
const DEPS = Object.keys(require('./package.json').dependencies);
const BOWER_DEPS = Object.keys(require('./bower.json').dependencies);

gulp.task('appCss', function(){
  return bundleCss('build/css/main.css', 'app/css/**/*.css')
    .on('error', gutil.log)
    .pipe(notify({ message: 'built build/css/main.css' }))
})

gulp.task('vendorCss', function(){
  return bundleCss('build/css/vendor.css', bowerFiles({ filter: "**/*.css" }))
    .on('error', gutil.log)
    .pipe(notify({ message: 'built build/css/vendor.css' }))
})

gulp.task('appJs', function () {

  var browserifyApp = browserify({
    entries: [ MAIN ],
    transform: [ TRANSFORMS.BABEL ],
    debug: !options.production,
    cache: {}, packageCache: {}, fullPaths: !options.production
  }).external( DEPS.concat(BOWER_DEPS) );

  return bundleJs('build/js/main.js', browserifyApp)
    .on('error', gutil.log)
    .pipe(notify({ message: 'built build/js/main.js' }))
    
});

gulp.task('vendorJs', function() {
  var browserifyVendor = browserify({ debug: true, require: DEPS })
  .plugin('browserify-bower', { require: ['*'], external: ['font-awesome'] });

  return bundleJs('build/js/vendor.js', browserifyVendor)
    .on('error', gutil.log)
    .pipe(notify({ message: 'built build/js/vendor.js' }))
})

gulp.task('clean', function(){  
    
  return gulp.src(['build'])
    .pipe(rimraf())
    .on('error', gutil.log)
    .pipe(notify({onLast:true, message: 'cleaned build directory' }))
})

gulp.task('copyHtml', function(){
  return gulp.src('app/index.html').pipe(gulp.dest('build/'))
    .on('error', gutil.log)
    .pipe(notify({onLast:true, message: 'copied index.html' }))
});

gulp.task('build', ['appJs', 'vendorJs', 'appCss', 'vendorCss', 'copyHtml'])

gulp.task('default', ['build']);

gulp.task('watch', ['build'], function(){
  gutil.log('watching')
  gulp.watch('app/js/**/*.js', ['appJs'])
  gulp.watch('app/css/**/*.css', ['appCss'])
  gulp.watch('app/index.html', ['copyHtml'])
  gulp.watch('package.json', ['vendorJs'])
  gulp.watch('bower.json', ['vendorCss', 'vendorJs'])
})

gulp.task('serve', ['build'], function(){
  gulp.src('build/').pipe(webserver({
    livereload: {
      enable: !options.production,
      port: 35000
    },
    open: !options.production,
    port: options.port,
    fallback: 'index.html'
  }));
})

function bundleJs( dest, bundleable ) {
  var [dirname, filename] = pathParts(dest)
  return bundleable.bundle()
    .pipe(source(filename))
    .pipe(gulpif(options.production, streamify(uglify())))
    .pipe(gulp.dest(dirname));
}

function bundleCss( dest, src ) {
  var [dirname, filename] = pathParts(dest);
  return gulp.src(src)
    .pipe(gulpif(!options.production, sourcemaps.init()))
    .pipe(postcss([ postcssUrl({ url: 'copy', assetsPath: '../assets/', useHash:true }) ], {to: dest }))
    .pipe(concat(filename))
    .pipe(gulpif(!options.production, sourcemaps.write()))
    .pipe(gulpif(options.production, minifyCss({rebase: false})))
    .pipe(gulp.dest(dirname));
}

function pathParts(p) {
  return [ path.dirname(p), path.basename(p) ]
}