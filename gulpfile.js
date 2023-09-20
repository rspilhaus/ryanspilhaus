// Define dependencies
var gulp = require('gulp');
var sass = require('gulp-sass');
var sassGlob = require('gulp-sass-glob');
var autoprefixer = require('gulp-autoprefixer');
var nano = require('gulp-cssnano');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var webp = require("imagemin-webp");
var extReplace = require("gulp-ext-replace");

// Compile sass to compressed css andd add vendor prefixes
gulp.task('styles', function(done) {
	gulp.src('src/css/style.scss')
		.pipe(sassGlob())
		.pipe(sourcemaps.init())
		.pipe(sass())
		.on('error', function(error) {
			console.log('\n ✖ ✖ ✖ ✖ ✖ ERROR ✖ ✖ ✖ ✖ ✖ \n \n' + error.message + '\n \n');
		})
		.pipe(autoprefixer({
			browsers: ['> 1%', 'last 2 versions', 'Firefox >= 20']
		}))
		.pipe(nano())
		.pipe(rename('theme.min.css'))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('dist/css'))
		done();
});

// Concatenate files and minify to output to scripts.min.js
gulp.task('scripts', function(done) {
	gulp.src([
			'src/js/libs/*.js',
			'src/js/components/*.js',
			'src/js/pages/*.js',
			'src/js/*.js'
		])
		.pipe(concat('scripts.min.js'))
		.pipe(uglify())
		.on('error', function(error) {
			console.log('\n ✖ ✖ ✖ ✖ ✖ ERROR ✖ ✖ ✖ ✖ ✖ \n \n' + error.message + '\n \n');
		})
		.pipe(rename('theme.min.js'))
		.pipe(gulp.dest('dist/js'))
		done();
});


//Minify Images
gulp.task('images', function(done){
  return gulp.src('src/images/**/*.+(png|jpg|gif)')
  .pipe(cache(imagemin()))
  .pipe(gulp.dest('dist/images'))
  done();
});


gulp.task("exportWebP", function(done) {
  return gulp.src('src/images/**/*.+(png|jpg)')
	.pipe(imagemin([
	  webp({
		quality: 100
	  })
	]))
	.pipe(extReplace(".webp"))
	.pipe(gulp.dest('dist/webp'));
	done();
});


gulp.task('watch', function() {
	gulp.watch('src/css/**/*.scss', gulp.series('styles'));
	gulp.watch('src/js/**/*.js', gulp.series('scripts'));
	gulp.watch('src/images/**/*.+(png|jpg|gif)', gulp.series('images'));
	gulp.watch('src/images/**/*.+(png|jpg)', gulp.series('exportWebP'));
});

// Default task
gulp.task('default', gulp.series('watch'));
