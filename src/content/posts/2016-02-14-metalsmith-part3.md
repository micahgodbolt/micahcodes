---
title: An Intro To Metalsmith - Part 3
layout: post.html
draft: true
---

```bash
$ npm install metalsmith-markdown metalsmith-layouts metalsmith-serve metalsmith-watch nunjucks --save-dev
```

```js
var serve = require('metalsmith-serve');
var watch = require('metalsmith-watch');
```

## Creating a local server to view your site

Now that we are converting our markdown files to HTML and passing them through a templating engine, it's about time we set up a proper development environment. The first step towards that goal is

```js
  .use(serve())
```

## Watching for changing files

```js
.use(watch({
    paths: {
      "${source}/**/*": true,
      "layouts/**/*": "**/*"
    },
    livereload: true
}))
```



```html
[metalsmith-watch] ✔︎ src/index.md changed
[metalsmith-watch] - Updating 1 file...
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Hello World</title>
  </head>
  <body>
      <h1 id="header-11">Header 11</h1>
      <p>This is a paragraph</p>

  <script src="http://localhost:35729/livereload.js"></script>
  </body>
</html>

[metalsmith-watch] ✔︎ 1 file reloaded
```
