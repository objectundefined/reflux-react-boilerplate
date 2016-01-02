var gulp = require('gulp');
var path = require('path');
var browserify = require('browserify');
var babelify = require('babelify');
var browserifyBower = require('browserify-bower');
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
  
  return bundleCss('build/main.css', 'styles/**/*.css')
    .on('error', gutil.log)
    .pipe(notify(()=> console.log('built /build/main.css')))

})

// Starts our development workflow
gulp.task('appJs', function () {

  var browserifyApp = browserify({
    entries: [ MAIN ],
    transform: [ TRANSFORMS.BABEL ],
    debug: DEV,
    cache: {}, packageCache: {}, fullPaths: DEV
  }).external( DEPS.concat(BOWER_DEPS) );

  return bundle('./build/main.js', browserifyApp)
    .on('error', gutil.log)
    .pipe(notify(()=> console.log('built /build/main.js')))
    
});

gulp.task('vendorJs', function() {
  var browserifyVendor = browserify({
    debug: true,
    require: DEPS
  }).plugin('browserify-bower', { require: ['*'] });

  return bundle('./build/vendor.js', browserifyVendor)
    .on('error', gutil.log)
    .pipe(notify(()=> console.log('built /build/vendor.js')))
})

gulp.task('default', ['appCss', 'appJs', 'vendorJs'])






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
  return gulp.src(src).pipe(concatCss( dest ));
}


`
var gulp = require('gulp');
var source = require('vinyl-source-stream'); // Used to stream bundle for further handling
var browserify = require('browserify');
var watchify = require('watchify');
var babelify = require('babelify'); 
var browserifyBower = require('browserify-bower');
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');
var streamify = require('gulp-streamify');
var notify = require('gulp-notify');
var concat = require('gulp-concat');
var cssmin = require('gulp-cssmin');
var gutil = require('gulp-util');
var shell = require('gulp-shell');
var glob = require('glob');
var jasminePhantomJs = require('gulp-jasmine2-phantomjs');
var bowerFiles = require('main-bower-files');


// External dependencies you do not want to rebundle while developing,
// but include in your application deployment
var dependencies = [
    'react',
    'react-dom',
    'react/addons',
    'flux-react'
];

gulp.src(bowerFiles({ filter: /\.css$/i })).pipe(gulp.dest('lib/'));
gulp.task('clean',function(){
    return gulp.src('lib/').pipe(clean())
})

var browserifyTask = function (options) {

	var appBundler = browserify({
		entries: [options.src], // Only need initial file, browserify finds the rest
   	transform: [["babelify", {presets: ["es2015", "react"]}]], // We want to convert JSX to normal javascript
		debug: options.development, // Gives us sourcemapping
		cache: {}, packageCache: {}, fullPaths: options.development // Requirement of watchify
	});
  
	// We set our dependencies as externals on our app bundler when developing.
  // You might consider doing this for production also and load two javascript
  // files (main.js and vendors.js), as vendors.js will probably not change and
  // takes full advantage of caching
	appBundler.external(options.development ? dependencies : []);


  // The rebundle process
  var rebundle = function () {
    var start = Date.now();
    console.log('Building APP bundle');
    appBundler.bundle()
      .on('error', gutil.log)
      .pipe(source('main.js'))
      .pipe(gulpif(!options.development, streamify(uglify())))
      .pipe(gulp.dest(options.dest))
      .pipe(notify(function () {
        console.log('APP bundle built in ' + (Date.now() - start) + 'ms');
      }));
  };

  // Fire up Watchify when developing
  if (options.development) {
    appBundler = watchify(appBundler);
    appBundler.on('update', rebundle);
  }
      
  rebundle();

  // We create a separate bundle for our dependencies as they
  // should not rebundle on file changes. This only happens when
  // we develop. When deploying the dependencies will be included 
  // in the application bundle
  if (options.development) {

  	var testFiles = glob.sync('./specs/**/*-spec.js');
		var testBundler = browserify({
			entries: testFiles,
			debug: true, // Gives us sourcemapping
      transform: [["babelify", {presets: ["es2015", "react"]}]], // We want to convert JSX to normal javascript
			cache: {}, packageCache: {}, fullPaths: true // Requirement of watchify
		});

    testBundler.external(dependencies);

  	var rebundleTests = function () {
  		var start = Date.now();
  		console.log('Building TEST bundle');
  		testBundler.bundle()
      .on('error', gutil.log)
	      .pipe(source('specs.js'))
	      .pipe(gulp.dest(options.dest))
	      .pipe(notify(function () {
	        console.log('TEST bundle built in ' + (Date.now() - start) + 'ms');
	      }));
  	};

    testBundler = watchify(testBundler);
    testBundler.on('update', rebundleTests);
    rebundleTests();
    
    var vendorsBundler = browserify({
      debug: true,
      require: dependencies
    });
    vendorsBundler.plugin('browserify-bower', {
    	require: ['*']
    });
    // Run the vendor bundle
    var start = new Date();
    console.log('Building VENDORS bundle');
    
    
    vendorsBundler.bundle()
      .on('error', gutil.log)
      .pipe(source('vendors.js'))
      .pipe(gulpif(!options.development, streamify(uglify())))
      .pipe(gulp.dest(options.dest))
      .pipe(notify(function () {
        console.log('VENDORS bundle built in ' + (Date.now() - start) + 'ms');
      }));
    
  }
  
}

var cssTask = function (options) {
    if (options.development) {
      var run = function () {
        console.log(arguments);
        var start = new Date();
        console.log('Building CSS bundle');
        gulp.src(options.src)
          .pipe(concat('main.css'))
          .pipe(gulp.dest(options.dest))
          .pipe(notify(function () {
            console.log('CSS bundle built in ' + (Date.now() - start) + 'ms');
          }));
      };
      run();
      gulp.watch(options.src, run);
    } else {
      gulp.src(options.src)
        .pipe(concat('main.css'))
        .pipe(cssmin())
        .pipe(gulp.dest(options.dest));   
    }
}

  


// Starts our development workflow
gulp.task('default', function () {

  browserifyTask({
    development: true,
    src: './app/main.js',
    dest: './build'
  });
  
  cssTask({
    development: true,
    src: './styles/**/*.css',
    dest: './build'
  });

});

gulp.task('deploy', function () {
  browserifyTask({
    development: false,
    src: './app/main.js',
    dest: './dist'
  });
  
  cssTask({
    development: false,
    src: './styles/**/*.css',
    dest: './dist'
  });

});

gulp.task('test', function () {
    return gulp.src('./build/testrunner-phantomjs.html').pipe(jasminePhantomJs());
});
`