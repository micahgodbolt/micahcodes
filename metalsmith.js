var Metalsmith = require('metalsmith');
var drafts = require('metalsmith-drafts');
var markdown = require('metalsmith-markdown');
var excerpts = require('metalsmith-excerpts');
var permalinks = require('metalsmith-permalinks');
var layouts = require('metalsmith-layouts');
var collections = require('metalsmith-collections');
var dateInFilename = require('metalsmith-date-in-filename');
var feed = require('metalsmith-feed');
var serve = require('metalsmith-serve');
var watch = require('metalsmith-watch');
var assets = require('metalsmith-assets');
var nunjucks = require('nunjucks');
var nunjucksDate = require('nunjucks-date');
var podcastMeta = require('./podcast-meta.js');
var metalsmith = Metalsmith(__dirname);

process.env.TZ = 'Pacific';

// General Options for build process
var options = {
  source_dir : 'src/content',
  dist_dir : 'dist',
  layout_dir : 'src/layouts',
  watch: {
    "${source}/**/*": true,
    'src/layouts/**/*.html' : "**/*",
  },
  port: 8080,
  assets: {
    source: './src/assets', // relative to the working directory
    destination: './assets' // relative to the build directory
  }
}

// Metadata to be passed to templates
var metadata = {
  title: "Micah Codes",
  description: "My Blog",
  site: {
    title: "Closing Bracket Show",
    url: "http://micah.codes"
  }
}

// Page collections like all pages or all posts
var site_collections = {
  posts: {
    pattern: 'posts/*.md',
    sortBy: 'date',
    reverse: true
  },
  podcasts: {
    pattern: 'podcasts/*.md',
    reverse: true
  },
  pages: {
    pattern: '*.md',
    sortBy: 'position',
  }
}



// Need to add configuration to nunjucks that metalsmith cannot
nunjucks
  .configure(options.layout_dir, {watch: false, noCache: true})
  .addFilter('date', nunjucksDate);
nunjucksDate
  .setDefaultFormat('MMMM Do, YYYY');

// if SERVE is set to true, server is started and files are watched
if (process.env.SERVE) {
  metadata.serve = true;
  metalsmith
    .use(serve({
        port: options.port
    }))
    .use(watch({
        paths: options.watch,
        livereload: true
    }));
}

// Run Metalsmith
metalsmith
  .metadata(metadata)
  .source(options.source_dir)
  .clean(true)
  .use(drafts(true))
  .use(dateInFilename({override: false}))
  .use(collections(site_collections))
  .use(markdown())
  .use(excerpts())
  .use(permalinks({
    pattern: ':title'
  }))
  .use(assets(options.assets))
  .use(feed({
    collection: 'posts'
  }))
  .use(feed({
    collection: 'podcasts',
    destination: 'closing-bracket/rss.xml',
    custom_namespaces: {
      'itunes': 'http://www.itunes.com/dtds/podcast-1.0.dtd'
    },
    custom_elements: [
      {'itunes:image': {
        _attr: {
          url: "http://micah.codes/assets/img/closing-bracket.png"
        }
      }},
      {'itunes:author': 'Micah Godbolt'},
      {'itunes:owner': [
        {'itunes:name': 'Micah Godbolt'},
        {'itunes:email': 'micahgodbolt@gmail.com'}
      ]},
      {'itunes:category':
       {
         _attr: {
           text: 'Technology'
         }
       }
     }
    ],
    postCustomElements: function(file) {
      return podcastMeta(file, metadata);
    }
  }))
  .use(layouts({
      engine: 'nunjucks',
      directory: options.layout_dir
  }))
  .destination(options.dist_dir)
  .build(function (err, files) {
    if (err) {
      console.log('Error!');
      console.log(err);
      throw err;
    }
  });
