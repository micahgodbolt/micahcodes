---
title: An Intro To Metalsmith - Part 2
layout: post.html
---

So far our [Metalsmith Starter project](https://github.com/micahgodbolt/metalsmith-starter) doesn't do much more than move HTML files from one folder to another. Today we're going too add some much needed functionality!

- Support for Markdown
- Templating framework

## Setting up some new node packages

Let's get all of this out of the way. If you are following along, we need to add several node packages to our project.

```bash
$ npm install metalsmith-markdown metalsmith-layouts nunjucks --save-dev
```
Then update our `metalsmith.js` file with the new require statements

```js
var markdown = require('metalsmith-markdown');
var layouts = require('metalsmith-layouts');
var nunjucks = require('nunjucks');
```

If you don't have the code from last time, you can always download the [Metalsmith-Starter repo](https://github.com/micahgodbolt/metalsmith-starter) and start at the stage-1 branch or just jump to stage-2 if you want to see the finished product.

With all of that code in place, we can move to updating our project code to take advantage of these new packages.


## Support for Markdown

[Markdown](https://daringfireball.net/projects/markdown/) is a very popular feature that converts your shorthand writing into full HTML. To see how this works, let's change `index.html` to `index.md` and update the body contents to the following:

### Writing in Markdown


```md
---
title: Hello World
date: 2016-02-08
---

# Header 1

This is a paragraph

```

As you can see, Markdown lets us write headings and paragraph (and other) tags without the need for any HTML markup. This is really speeds up writing, and is much less error prone. If you are new to Markdown, but sure to check it out!

#### Our new `files` data

Now that `index.md` has some Markdown content in it, let's take a look again at our `console.log(files);` to see what has happened.

```js
'index.md':
   { title: 'Hello World',
     contents: <Buffer....
```

So far, not much as changed other than the file extension on `index` changing from `.html` to `.md`. The thing is though, we need our finished file to an HTML file. So what do we do?

### Converting our Markdown to HTML

To convert our markdown file to an HTML file we need to go back to the `use()` function and invoke the `markdown()` plugin. There aren't any settings we need to fiddle with right now, just `.use(markdown())` and we're good to go.



```js
metalsmith = Metalsmith(__dirname)
  .use(markdown())
  .use(function(files, metalsmith, done) {
    console.log(files);
    console.log(metalsmith);
    done();
  })
  .build(function(err){
    if (err) throw err;
  });
```

As you can see, I'm putting this _before_ my console logs, because all of these functions are sequential. I want to see what the `files` var looks like after we compile.

Now our `console.log(files);` produces the following:

```js
'index.html':
   { title: 'Hello World',
   contents: <Buffer....
 ```

Our file extension was successfully changed, but we can't see if the contents have changed because they are wrapped inside of a buffer.

### Viewing the compiled results

[Last time](/an-intro-to-metalsmith/) I mentioned that buffers can be converted to something more readable with a simple `toString('utf8')` function. So if we replace `console.log(files);` this more specific logging function:

```
console.log(files['index.html']['contents'].toString('utf8'));
```

We'll get the following:

 ```html
 <h1 id="header-1">Header 1</h1>
 <p>This is a paragraph</p>
 ```

This version of markdown automatically creates an ID for each heading to make it easier to link to each section, but otherwise you see we're getting the exact markup we're looking for. Markdown supports links, images, lists, and just about every other HTML element. I'm actually writing in Markdown as we speak. It's a great language for blog writing without resorting to a WYSIWYG.

## Using a templating engine

Now that we had Markdown turning our content into markdown, we need to figure out how to turn a handful of HTML tags into a full blown web page. To do this we will lean on a templating language to provide that wrapping markup.

To set up a templating language we need to configure a couple modules. The first one is the [Metalsmith Layouts module](https://github.com/superwolff/metalsmith-layouts). This versatile module passes your `files` data into the templating language of your choice before outputing the result to the `dist` folder.

Since Layouts doesn't come with a language of its own we'll pull in a popular JS based language called [Nunjucks](https://mozilla.github.io/nunjucks/). This Mozilla sponsored templating tool will compile our content using whatever template file we ask it to use.


### Setting up Nunjucks

Once again we envoke the `use()` function, this time with `layouts()` as its parameter. We'll be sure to place this _after_ the markdown function, as this ensure that we have an HTML file before doing the rendering.

Inside of `layouts()` we set the language we want to use, in this case `nunjucks`. Layouts uses the [consolidate.js](https://github.com/tj/consolidate.js#supported-template-engines) module to connect to the numerous compatible languages. Go check out their repo to see the full list of options.

#### Setting up a default template

Lastly, we can set a default HTML file to be used to render our content. By default the Layout module will look inside the `layouts` folder for this file, but you can specify the directory if you prefer. You can also override the template used to render by adding `layout: another-file.html` in the head of your markdown file.

```js
.use(layouts({
  engine: 'nunjucks',
  default: 'page.html'
}))
```

#### The page.html file

This `page.html` file will be the template used to render whatever content you put into your markdown files. The whole process is performed by the Nunjucks library, so be sure to [check Nunjucks documentation](https://mozilla.github.io/nunjucks/templating.html) to learn more about variables, filters and other functionality.

#### Printing some variables

Right now we're going to simply put the `title` variable into the page title, and then print the `contents` of the page into the body of our webpage. Variables are rendered by using the {{}} notation, and the `|safe` filter means that Nunjucks won't automatically escape the special HTML characters in that variable.

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>{{title}}</title>
  </head>
  <body>
      {{contents|safe}}
  </body>
</html>
```

#### Rendering our index.html

If you are wondering where the `title` and `contents` variables are coming from, remember what we saw when inspecting the `files` variable.

```js
'index.html':
   { title: 'Hello World',
   contents: <Buffer....
 ```

Those are the two variables being passed into this template. So it's no surprised that we get the following output:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Hello World</title>
  </head>
  <body>
      <h1 id="header-1">Header 1</h1>
      <p>This is a paragraph</p>
  </body>
</html>
```

## Conclusion

That's it! We now can write our pages/posts in Markdown, and automatically convert those to HTML before passing them into a template of our choosing.

In the next article we'll set up a proper development environment and get some styles onto our page.
