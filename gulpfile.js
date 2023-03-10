const sytax = 'scss';

let 	gulp          = require('gulp'),
	sass          = require('gulp-sass'),
	browserSync   = require('browser-sync'),
	concat        = require('gulp-concat'),
	uglify        = require('gulp-uglify-es').default,
	cleancss      = require('gulp-clean-css'),
	rename        = require('gulp-rename'),
	autoprefixer  = require('gulp-autoprefixer'),
	notify        = require('gulp-notify'),
	rsync         = require('gulp-rsync'),
	imageResize   = require('gulp-image-resize'),
	imagemin      = require('gulp-imagemin'),
	newer         = require('gulp-newer'),
	del           = require('del');

// Local Server
gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: 'app'
		},
		notify: false,
		// online: false, // Work Offline Without Internet Connection
		// tunnel: true, tunnel: "projectname", // Demonstration page: http://projectname.localtunnel.me
	})
});

// Sass|Scss Styles
gulp.task('styles-1', function() {
	return gulp.src(`app/1-${sytax}/**/*.${sytax}`)
	.pipe(sass({ outputStyle: 'expanded' }).on("error", notify.onError()))
	.pipe(rename({ suffix: '.min', prefix : '' }))
	.pipe(autoprefixer(['last 15 versions']))
	.pipe(cleancss( {level: { 1: { specialComments: 0 } } })) // Opt., comment out when debugging
	.pipe(gulp.dest('app/css'))
	.pipe(browserSync.stream())
});

// Sass|Scss Styles
gulp.task('styles-2', function() {
	return gulp.src(`app/2-${sytax}/**/*.${sytax}`)
	.pipe(sass({ outputStyle: 'expanded' }).on("error", notify.onError()))
	.pipe(rename({ suffix: '.min', prefix : '' }))
	.pipe(autoprefixer(['last 15 versions']))
	.pipe(cleancss( {level: { 1: { specialComments: 0 } } })) // Opt., comment out when debugging
	.pipe(gulp.dest('app/css'))
	.pipe(browserSync.stream())
});

// 1-JS
gulp.task('scripts-1', function() {
	return gulp.src([
		'app/libs/jquery/jquery-3.3.1.min.js',
		'app/1-js/tween-lite.js',
		'app/1-js/easy-pack.js',
		'app/1-js/common.js', // Always at the end
		])
	.pipe(concat('scripts.min.js'))
	.pipe(uglify()) // Mifify js (opt.)
	.pipe(gulp.dest('app/1-js'))
	.pipe(browserSync.reload({ stream: true }))
});

// 2-JS
gulp.task('scripts-2', function() {
	return gulp.src([
		'app/libs/jquery/jquery-3.3.1.min.js',
		'app/2-js/tween-lite.js',
		'app/2-js/easy-pack.js',
		'app/2-js/common.js', // Always at the end
		])
	.pipe(concat('scripts.min.js'))
	.pipe(uglify()) // Mifify js (opt.)
	.pipe(gulp.dest('app/2-js'))
	.pipe(browserSync.reload({ stream: true }))
});

// HTML Live Reload
gulp.task('code', function() {
	return gulp.src('app/*.html')
	.pipe(browserSync.reload({ stream: true }))
});

// Deploy
gulp.task('rsync', function() {
	return gulp.src('app/**')
	.pipe(rsync({
		root: 'app/',
		hostname: 'username@yousite.com',
		destination: 'yousite/public_html/',
		// include: ['*.htaccess'], // Includes files to deploy
		exclude: ['**/Thumbs.db', '**/*.DS_Store'], // Excludes files from deploy
		recursive: true,
		archive: true,
		silent: false,
		compress: true
	}))
});

// Images @x1 & @x2 + Compression | Required graphicsmagick (sudo apt update; sudo apt install graphicsmagick)
gulp.task('img1x', function() {
	return gulp.src('app/img/app/**/*.*')
	.pipe(newer('app/img/@1x'))
	.pipe(imageResize({ width: '50%' }))
	.pipe(imagemin())
	.pipe(gulp.dest('app/img/@1x/'))
});
gulp.task('img2x', function() {
	return gulp.src('app/img/_src/**/*.*')
	.pipe(newer('app/img/@2x'))
	.pipe(imageResize({ width: '100%' }))
	.pipe(imagemin())
	.pipe(gulp.dest('app/img/@2x/'))
});

gulp.task('img', gulp.series('img1x', 'img2x'));

// Clean @*x IMG's
gulp.task('cleanimg', function() {
	return del(['app/img/@*'], { force:true })
});

gulp.task('watch', function() {
	gulp.watch(`app/1-${sytax}/**/*.${sytax}`, gulp.parallel('styles-1'));
	gulp.watch(`app/2-${sytax}/**/*.${sytax}`, gulp.parallel('styles-2'));
	gulp.watch(['libs/**/*.js', 'app/1-js/common.js'], gulp.parallel('scripts-1'));
	gulp.watch(['libs/**/*.js', 'app/2-js/common.js'], gulp.parallel('scripts-2'));
	gulp.watch('app/*.html', gulp.parallel('code'));
	gulp.watch('app/img/_src/**/*', gulp.parallel('img'));
});

gulp.task('default', gulp.parallel('img', 'styles-1', 'styles-2', 'scripts-1', 'scripts-1', 'browser-sync', 'watch'));