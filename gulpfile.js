var gulp = require('gulp');
var watch = require('gulp-watch');
var path = require('path');
var browserify = require('browserify');
var babelify = require('babelify');
var browserifyBower = require('browserify-bower');
var bowerFiles = require('main-bower-files');
var gutil = require('gulp-util');
var notify = require('gulp-notify');
var source = require('vinyl-source-stream'); // Used to stream bundle for further handling
var concatCss = require('gulp-concat-css');
 
const DEV = true;
const OUT = "./build";
const TRANSFORMS = {
  BABEL : [ "babelify", { presets : [ "es2015", "react"] } ]
};
const MAIN = './app/main.js';
const DEPS = Object.keys(require('./package.json').dependencies);
const BOWER_DEPS = Object.keys(require('./bower.json').dependencies);

gulp.task('appCss', function(){
  
  return bundleCss('build/css/main.css', 'styles/**/*.css')
    .on('error', gutil.log)
    .pipe(notify(()=> console.log('built /build/css/main.css')))

})

gulp.task('vendorCss', function(){
  
  return bundleCss('build/css/vendor.css', bowerFiles({ filter: "**/*.css" }))
    .on('error', gutil.log)
    .pipe(notify(()=> console.log('built /build/css/vendor.css')))
})

gulp.task('vendorFonts', function(){
  // return gulp.src(bowerFiles({filter:"**/*.{eot,svg,ttf,woff,woff2,otf}"})).pipe(gulp.dest('build/fonts'))
  //   .on('error', gutil.log)
  //   .pipe(notify(()=> console.log('copied fonts')))
})

// Starts our development workflow
gulp.task('appJs', function () {

  var browserifyApp = browserify({
    entries: [ MAIN ],
    transform: [ TRANSFORMS.BABEL ],
    debug: DEV,
    cache: {}, packageCache: {}, fullPaths: DEV
  }).external( DEPS.concat(BOWER_DEPS) );

  return bundle('./build/js/main.js', browserifyApp)
    .on('error', gutil.log)
    .pipe(notify(()=> console.log('built /build/js/main.js')))
    
});

gulp.task('vendorJs', function() {
  var browserifyVendor = browserify({ debug: true, require: DEPS })
  .plugin('browserify-bower', { require: ['*'], external: ['font-awesome'] });

  return bundle('./build/js/vendor.js', browserifyVendor)
    .on('error', gutil.log)
    .pipe(notify(()=> console.log('built /build/js/vendor.js')))
})

gulp.task('default', ['appJs', 'vendorJs', 'appCss', 'vendorCss', 'vendorFonts'])

gulp.task('watch', ['default'], function(){
  
  watch('app/*', ()=> gulp.start('appJs') )
  watch('styles/*', ()=> gulp.start('appCss') )
  watch('node_modules/*', ()=> gulp.start('vendorJs') )
  watch('package.json', ()=> gulp.start('vendorJs') )
  watch('bower.json', ()=> gulp.start('vendorCss') )
  watch('bower.json', ()=> gulp.start('vendorJs') )
  watch('bower.json', ()=> gulp.start('vendorFonts') )

})


function bundle( dest, bundleable ) {
  var filename = path.basename(dest);
  var dirname = path.dirname(dest);
  return bundleable.bundle()
    .pipe(source(filename))
    .pipe(gulp.dest(dirname))
}

function bundleCss( dest, src ) {
  var filename = path.basename(dest);
  var dirname = path.dirname(dest);
  return gulp.src(src)
    .pipe(concatCss(filename))
    .pipe(gulp.dest(dirname));
}