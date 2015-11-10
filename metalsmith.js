var Metalsmith = require('metalsmith');
var markdown = require('metalsmith-markdown');
var permalinks = require('metalsmith-permalinks');
var layouts = require('metalsmith-layouts');
var fileMetadata = require('metalsmith-filemetadata');
var dateInFile = require('metalsmith-date-in-filename');
var branch = require('metalsmith-branch');

var metalsmith = Metalsmith(__dirname)
  .source('./src/content')
  .clean(true)
  .destination('./dist')
  .use(branch('*.md')
    .use(markdown())
    .use(layouts({
        engine: 'swig',
        directory: 'src/layouts'
    }))
  )
  .use(branch('posts/**/*.md')
    .use(markdown())
    .use(permalinks({
      pattern: ':title'
    }))
    .use(fileMetadata([
      {
        pattern: '**/*.{md,html}',
        metadata: {
          section: 'blog',
          layout: 'post.html'
        }
      }
    ]))
    .use(layouts({
        engine: 'swig',
        directory: 'src/layouts'
    }))
  )
  .build(function (err, files) {
    if (err) {
      console.log('Error!');
      console.log(err);
      console.log(files);
      throw err;
    }
  });
