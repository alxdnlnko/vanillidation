gulp = require 'gulp'
rename = require 'gulp-rename'
browserify = require 'browserify'
coffeeify = require 'coffeeify'

path = require 'path'
through = require 'through2'
express = require 'express'
app = express()

livereload = require 'gulp-livereload'
tinylr = require 'tiny-lr'
lrserver = tinylr()


bundle = ->
  return through.obj (file, enc, cb) ->
    b = browserify(file.path)
      .transform coffeeify

    file.contents = b.bundle()
    this.push file
    cb()


gulp.task 'dev', ->
  gulp.src ['src/index.coffee']
    .pipe bundle()
    .pipe rename 'vanillidation.js'
    .pipe gulp.dest 'demo/'
    .pipe livereload lrserver


gulp.task 'server', ->
  app.use require('connect-livereload')()
  app.use express.static path.resolve './demo'
  app.listen 3000
  console.log 'Listening on port 3000'


gulp.task 'demo', ->
  gulp.src ['demo/*.html', 'demo/*.css']
    .pipe livereload lrserver


gulp.task 'watch', ->
  lrserver.listen 35729, (err) ->
    return console.log err if err
  gulp.watch 'src/*.coffee', ['dev']
  gulp.watch 'demo/*.html', ['demo']
  gulp.watch 'demo/*.css', ['demo']


gulp.task 'default', ['dev', 'demo', 'server', 'watch']
