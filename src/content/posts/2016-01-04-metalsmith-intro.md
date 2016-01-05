---
title: An Intro To Metalsmith
layout: post.html
---

[Metalsmith](http://www.metalsmith.io/) bills itself as "An extremely simple, _pluggable_ static site generator", and it delivers in some big ways. If you want to learn more about Metalsmith, you are in the right place! Over the next several posts I'll be diving deep into how the system works, how you can extend it, and how you can make it do just about anything that you want. If you aren't interested in static site generators, or if you're already invested in some other platform, don't go anywhere! This isn't just a simple how to. I am going to spend some time peeling back the layers of a sophisticated NodeJS tool. I'm confident you'll learn about good ways to dive into the tools you already use, and understand them more completely. Once you "know how the sausage is made", you'll be in a better position to debug, improve and extend anything in your current toolchain.

## What is a Static Site Generator?

In their most simple form, a static site generator takes content as an input, passes that content through a process, and outputs static, servable assets.

```
Content >>> Process === Static Assets
```

Now, what that content actually looks like, the process that it goes through, and the form of the finished output are totally up to the generator. You could be dealing with a Excel file being passed through an Automator script outputting a XML file that is ingested by a jQuery plugin on a static HTML page. Fortunately for us, Metalsmith is a [NodeJS](https://nodejs.org/en/) tool that allows you to store your content in [Markdown](https://github.com/segmentio/metalsmith-markdown), create static pages using a number of different [templating engines](https://github.com/superwolff/metalsmith-layouts).

Still, Metalsmith is nothing more than a process for taking input and giving us an output, so this process is what we want to focus on. For me, the best way to break down a new tool is to strip it down to its most simple, functional state.

## Metalsmith MVP (Minimum Viable Project)

For those that want to follow along, you can check out the `stage-1` branch of my [Metalsmith-Starter Repo](https://github.com/micahgodbolt/metalsmith-starter/tree/stage-1). It's pretty minimal, so you won't need to download the code to follow along. It demonstrates the smallest amount of code needed for Metalsmith to do its work.

### Getting set up

Assuming you already have [NodeJS](https://nodejs.org/en/) installed, you'll only need to run `npm install` to get everything set up. Once that is done, the only assets you need to be aware of are a pair of html files in the `src` folder. Let's take a quick look at `src/index.html`:

```
---
title: Hello World
date: 2016-01-04
---

<p>This is the home page</p>

```

The file is broken up into two parts. The first part, between the sets of triple dashes, is really common to static site generators, and is called the [YAML](http://www.yaml.org/start.html) front matter. If you are familiar with traditional CMS content types, the front matter is all of the fields other than the body field. In this example it contains a title and date, but it could also contain authors, categories, pricing information, location, thumbnail image paths, template file names, or just about any other piece of data you need to pass into the rendered page.

The only thing not going into the front matter is the page content, which is everything below the second set of `---`. In this case our content is just HTML, but eventually we'll set our project up to accept markdown files as well. This content will be passed along with the rest of our front matter to create our final output.

### A tiny Metalsmith.js file

There are actually two ways to set up a Metalsmith project. You can configure the entire project using just JSON, but I find that keeping everything in JavaScript is easier to understand and work with, so I'm going to show you how to create your own `metalsmith.js` file.

The following is as simple as it gets.

```
var Metalsmith = require('metalsmith'); // Require Metalsmith

metalsmith = Metalsmith(__dirname)      // Create new Metalsmith instance in the current directory
  .build(function(err){                 // Build Metalsmith site
    if (err) throw err;
  });
```

All we need to do is require the metalsmith node module, create a new instance of metalsmith in our current directory, and then build. Running `node metalsmith.js` right now will successfully run Metalsmith, taking our source files and output them to a build folder.

### A limited start

Sure, the Metalsmith process ran successfully, but we didn't really do much. All that we've done is taken our `src/index.html`, stripped out the YAML front matter, and created `build/index.html` containing the follow:

```
<p>This is the home page</p>
```

That's not exactly a ground breaking process! But the power of Metalsmith lies in its ability to modify `index.html` once it is pulled into memory, before it is sent back to the build folder. To understand what Metalsmith is able to do, we need to dive into a couple of global variables to see how data is stored, and how we can modify it.

## Diving into global variables

If you looked at the git repo, I actually omitted some debugging code from the `metalsmith.js` file. Here is the file in its entirety:

```
var Metalsmith = require('metalsmith');

metalsmith = Metalsmith(__dirname)
  .use(function(files, metalsmith, done) {
    console.log(files);
    console.log(metalsmith);
    done();
  })
  .build(function(err){
    if (err) throw err;
  });
```

The `use()` function allows us to read and modify key global variables as Metalsmith does its generator duties. This often invokes functions defined in other contributed modules, but right now we're simply using it to print out a few console logs of the `files` and `metalsmith` variables. Here is the truncated output of the `files` log.

### The `files` variable

```
{
  'about.html': {
    title: 'About Me',
    date: Sun Jan 03 2016 16: 00: 00 GMT - 0800(PST),
    contents: < Buffer... > ,
    mode: '0644',
    stats: {...
    }
  },
  'index.html': {
    title: 'Hello World',
    date: Sun Jan 03 2016 16: 00: 00 GMT - 0800(PST),
    contents: < Buffer... > ,
    mode: '0644',
    stats: {...
    }
  }
}
```

As you can see, there are two keys in this JSON object, one for each file in our `src` directory. The YAML that we put in the front matter gets converted nicely into object properties, and then the contents of the file gets passed into a NodeJS buffer. A buffer is just a way that NodeJS is able to easily store and process raw data. You can easily convert it back to UTF-8 by passing it into `.toString('utf8')`.

### The `metalsmith` variable

If `files` is an object containing data for each file in your `src`, what is `metalsmith`? It's all of our global settings.

```
Metalsmith {
  plugins: [ [Function] ],
  ignores: [],
  _directory: '/Users/mgodbolt/Sites/metalsmith-starter',
  _metadata: {},
  _source: 'src',
  _destination: 'build',
  _concurrency: Infinity,
  _clean: true,
  _frontmatter: true
}
```

These are settings that we can change as we set up our `metalsmith.js` project. If we want to change the `_source` from `src` to `content` we can do the following:

```
var Metalsmith = require('metalsmith');

metalsmith = Metalsmith(__dirname)
  .source('content')
  .build(function(err){
    if (err) throw err;
  });
```

`source()` is called a setter function. So instead of giving the user direct access to `metalsmith._source`, we pass a string into this function, and it sets the variable for us.

Another setter function, `metadata()`, allows us to create some persistent metadata that can be accessed by all of our pages. It looks like this:

```
var Metalsmith = require('metalsmith');

metalsmith = Metalsmith(__dirname)
  .metadata({
    siteName: "My Awesome Blog",
    author:   "Micah Godbolt"
  })
  .build(function(err){
    if (err) throw err;
  });
```

### The Metalsmith process

Now we can see how Metalsmith takes a set of content files in `src`, passes them through a series of modifying functions, and then outputs the content into the `build` folder. This is the basis of everything we are going to be doing with this site.

As we continue we'll be adding in more community contributed, and custom functions into the process chain. These functions will allow us to use Markdown instead of HTML as our source, hook up templating engines to modify our content before being output, and a host of other things. At each step we'll be able to look back at `files` and `metalsmith` to see just how those functions modify the content in those variables.

## Conclusion

The thing I love most about Metalsmith is the transparency it provides to someone that really wants to look under the hood and see how things work. I've never been a fan of black boxes that magically take your input, toss on some rainbow magic fairy dust, and output something completely different. Sure, those black boxes make a bunch of pretty things with little effort, but as soon as something breaks, or you want to modify how things work, you'll be stuck!

As a blog about open source technologies, I want to make sure this site is built upon an open source platform that I will feel comfortable contributing back to. I'm really enjoying how easy it is to dive in and get my hands dirty, and so far the community seems to be active and supportive. I hope that in the end I'll be able to help make the community, and the code, better.
