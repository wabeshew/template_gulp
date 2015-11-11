var gulp = require('gulp');
var path = require('path');
var browser = require('browser-sync');
var compass = require('gulp-compass');
var notify = require("gulp-notify");
var pleeease = require('gulp-pleeease');
var htmlhint = require("gulp-htmlhint");
var csslint = require('gulp-csslint');
var imagemin = require('gulp-imagemin');
var csscomb = require('gulp-csscomb');

// paths option
var paths = {
  ass : 'assets',
  sass: 'develop/scss/style',
  css: 'assets/css',
  js: 'assets/js',
  img_dev: 'develop/img',
  img_ass: 'assets/img',
  sprite: 'assets/img/sprite'
}

// files option
var files = {
  html : paths.ass + '/*.html',
  scss : paths.sass + '/*.scss',
  css : paths.css + '/**/*.css'
}

/**
 * server
 * ローカルサーバーを起動
 */
gulp.task("server", function() {
	browser({
		server: {
			baseDir: "./"
		}
	});
});


/**
 * watch
 * 指定したファイルに変更があればcompassタスクを起動
 */
gulp.task('watch', function(){
	gulp.watch(files.scss, function(event) {
		gulp.run('compass');
	});
	gulp.watch(files.html, function(event) {
		gulp.src(files.html)
			.pipe(notify({
				title: 'Task Complete',
				message: 'HTML finished running'
			}))
			.pipe(browser.reload({
				stream: true
			}));
	});
});


/**
 * compass
 * scssファイルのコンパイル
 */
gulp.task('compass', function() {
	gulp.src(files.scss)
		.pipe(compass({
			css: paths.css,
			sass: paths.sass,
			image: paths.img_dev,
			bundle_exec: true
		}))
		.pipe(pleeease({
			autoprefixer: ['last 2 version', 'ie 11', 'ie 10', 'ie 9', 'ie 8'],
			minifier: false
		}))
		.pipe(csscomb())
		.pipe(gulp.dest(paths.css))
		.pipe(notify({
			title: 'Task Complete',
			message: 'sass finished running'
		}))
		.pipe(browser.reload({
			stream: true
		}));
});


/**
 * htmllint
 * HTML文法チェック
 */
gulp.task('htmllint', function(){
	gulp.src(files.html)
		.pipe(htmlhint())
		.pipe(htmlhint.reporter())
});


/**
 * csslint
 * CSS文法チェック
 */
gulp.task('csslint', function(){
	gulp.src(files.css)
		.pipe(csslint())
		.pipe(csslint.reporter())
});


/**
 * imagemin
 * 画像最適化
 */
gulp.task('imagemin', function(){
	var srcGlob = paths.img_dev + '/**/*.+(jpg|jpeg|png|gif|svg)';
	var dstGlob = paths.img_ass;
	var imageminOptions = {
		optimizationLevel: 8
	};

	gulp.src(srcGlob)
		.pipe(imagemin(imageminOptions))
		.pipe(gulp.dest(dstGlob));
});


/**
 * タスク一覧
 */
// 開発用
gulp.task('dev', ['server'], function(){
	gulp.run('watch');
});

// HTML文法チェック
gulp.task('html', function(){
	gulp.run('htmllint');
});

// CSS文法チェック
gulp.task('css', function(){
	gulp.run('csslint');
});

// 画像最適化
gulp.task('img', function(){
	gulp.run('imagemin');
});
