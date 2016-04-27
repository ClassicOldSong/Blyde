const gulp = require('gulp');
const rename = require('gulp-rename');
const replace = require('gulp-replace');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');

gulp.task('default', () => {
	return gulp.src('src/blyde.js')
				.pipe(babel({
					presets: ['es2015']
				}))
				.pipe(gulp.dest('dist'))
				.pipe(replace(/var (error|warn)(.*)??;/g, ''))
				.pipe(replace(/(error|warn)\((.*)??\);/g, ''))
				.pipe(uglify())
				.pipe(rename({
					suffix: '.min'
				}))
				.pipe(gulp.dest('dist'));
});