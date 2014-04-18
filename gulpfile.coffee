gulp = require 'gulp'
rename = require 'gulp-rename'
browserify = require 'browserify'
coffeeify = require 'coffeeify'
uglify = require 'gulp-uglify'
streamify = require 'gulp-streamify'

path = require 'path'
through = require 'through2'
express = require 'express'
app = express()

livereload = require 'gulp-livereload'
tinylr = require 'tiny-lr'
lrserver = tinylr()


bundle = ->
  return through.obj (file, enc, cb) ->
    b = browserify {entries: file.path, extensions: ['.coffee']}
      .transform coffeeify

    file.contents = b.bundle()
    this.push file
    cb()


gulp.task 'dev', ->
  gulp.src ['src/index.js']
    .pipe bundle()
    .pipe rename 'vanillidation.js'
    .pipe gulp.dest 'demo/'
    .pipe livereload lrserver


gulp.task 'build', ->
  gulp.src ['src/index.js']
    .pipe bundle()
    .pipe rename 'vanillidation.min.js'
    .pipe streamify uglify()
    .pipe gulp.dest 'build/'


gulp.task 'server', ->
  app.use require('connect-livereload')()
  app.use express.static path.resolve './demo'
  app.listen 3000


gulp.task 'demo', ->
  gulp.src ['demo/*.html', 'demo/*.css']
    .pipe livereload lrserver


gulp.task 'watch', ->
  lrserver.listen 35729, (err) ->
    return console.log err if err
  gulp.watch ['src/*.coffee', 'src/*.js'], ['dev']
  gulp.watch ['demo/*.html', 'demo/*.css'], ['demo']


gulp.task 'default', ['dev', 'demo', 'server', 'watch']
