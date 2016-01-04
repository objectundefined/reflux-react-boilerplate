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


const DEV = true;
const TRANSFORMS = {
  BABEL : [ "babelify", { presets : [ "es2015", "react"] } ]
};
const MAIN = './app/main.js';
const DEPS = Object.keys(require('./package.json').dependencies);
const BOWER_DEPS = Object.keys(require('./bower.json').dependencies);

gulp.task('appCss', function(){
  
  return bundleCss('build/css/main.css', 'styles/**/*.css')
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
    debug: DEV,
    cache: {}, packageCache: {}, fullPaths: DEV
  }).external( DEPS.concat(BOWER_DEPS) );

  return bundle('build/js/main.js', browserifyApp)
    .on('error', gutil.log)
    .pipe(notify({ message: 'built build/js/main.js' }))
    
});

gulp.task('vendorJs', function() {
  var browserifyVendor = browserify({ debug: true, require: DEPS })
  .plugin('browserify-bower', { require: ['*'], external: ['font-awesome'] });

  return bundle('build/js/vendor.js', browserifyVendor)
    .on('error', gutil.log)
    .pipe(notify({ message: 'built build/js/vendor.js' }))
})

gulp.task('clean', function(){  
    
  return gulp.src(['build'])
    .pipe(rimraf())
    .on('error', gutil.log)
    .pipe(notify({onLast:true, message: 'cleaned build directory' }))
})

gulp.task('default', ['appJs', 'vendorJs', 'appCss', 'vendorCss'])

gulp.task('watch', ['default'], function(){
    gulp.watch('app/*', ['appJs'])
    gulp.watch('styles/*', ['appCss'])
    gulp.watch('package.json', ['vendorJs'])
    gulp.watch('bower.json', ['vendorCss', 'vendorJs'])
    gulp.src('build/').pipe(webserver({
      livereload: true,
      open: true
    }));
})

function bundle( dest, bundleable ) {
  var [dirname, filename] = pathParts(dest)
  return bundleable.bundle()
    .pipe(source(filename))
    .pipe(gulp.dest(dirname)) 
}

function bundleCss( dest, src ) {
  var [dirname, filename] = pathParts(dest)
  return gulp.src(src)
    .pipe(sourcemaps.init())
    .pipe(postcss([ postcssUrl({ url: 'copy', assetsPath: '../static', useHash:true }) ], {to: dest }))
    .pipe(concat(filename))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(dirname));
}

function pathParts(p) {
  return [ path.dirname(p), path.basename(p) ]
}