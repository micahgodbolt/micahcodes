---
title: Hello World
layout: post.html
---

My name is Micah, and you've found my new blog!

## Is this site broken?

Right now you might be wondering if you accidentally turned off Javascript, or cranked up your ad blocker a bit too aggressively. Where'd all the CSS go? Well, I can assure you that you are seeing this site exactly as I intend for you to see it.

At launch this site has no JavaScript, no web fonts and not a single line of CSS. This is HTML, pure and simple. Just as [the spec](http://www.w3.org/TR/html5/) intended it to be:

- Accessible
- Responsive
- Multi-device
- Progressively Enhanced
- Light and Lightning Fast

Is it going to win any design contests? Heck no! Does it do what the web was designed to do? It sure does! This site has the power to take the words that I type and make them accessible to the entire world. Pretty sweet huh?

## Putting the Hypermiling in HTML

If you aren't familiar with hypermiling, it's the practice of optimizing your car and your driving habits to get the most possible miles out of one tank of gas. As I started to build this blog I became obsessed with figuring out the shortest, quickest path between me typing on a computer and a person reading the words.

Now this doesn't mean FTP'ing into the server and editing HTML files, but it does mean creating a super lean build process, automating deployment, and using every trick in the book to deliver that HTML file to the reader as quickly as possible. This is what that process looks like:

- Blog articles written in Markdown
- Source code pushed to [Github repo](https://github.com/micahgodbolt/micahcodes)
- [TravisCI](https://travis-ci.org/) checks out master and compiles site using NodeJS based static site generator, [Metalsmith](http://www.metalsmith.io/)
- Dist folder is automatically pushed to [Amazon S3](https://aws.amazon.com/s3/)
- [Cloudflare CDN](https://www.cloudflare.com/) is instructed to clear cache and pull new assets forward
- Static site is served to client over HTTPS using HTTP/2 from the nearest Cloudflare CDN

## But!!!!

Yes, CSS, JavaScript and Web Fonts bring a lot to the table to make a site more readable and usable. I'm sure you can think of a bunch of reasons why you might really need these things. Let me try to answer as many of those objections as I can.

### What about large viewports?

I totally agree. Without CSS, those line lengths are going to be terrible. But the point of starting with no CSS is to determine what parts of CSS we miss the most. Setting a max width, or using columns, or something of that nature will certainly be my first CSS rules.

### What about CSS resets or [Normalize](https://necolas.github.io/normalize.css/)?

I'm actually looking forward to embracing the differences between each browser. I've never really stopped to see how Safari rendered markup differently than Chrome. This will be a great opportunity to see if those differences actually break user experience, or if they are just a barrier to making the site [look the same in every browsers](http://dowebsitesneedtolookexactlythesameineverybrowser.com/).

### What about social widgets?

Really? Next question.

### What about analytics?

To be honest, I almost broke my no JS rule, and added Google Analytics in anyway. But then I thought to myself, "what is it that I want analytics for?"

1. To see how many hits I get?
  - Well that sounds self serving, and not really in the user's best interest.
2. To determine where my traffic is coming from, and what devices they are using?
  - Now this is information I could actually use to serve my users better. But if I always build for the least capable device, on the slowest connection, I should be serving all of my users to the best of my ability anyway.

For now, the benefits of analytics don't out-weight the......_weight_ of analytics. Plus, this way I can get some baseline performance measurements and then research the best approach to analytics when I do decide to add it.


### What about [Modernizr](https://modernizr.com/)?

Personally I don't care about old IE. The audience of this site is not going to be visiting on IE9 or IE10. And if they are, what is the worst that could happen? If none of my CSS works, JavaScript fails to load, and my fancy fonts are blocked, then those users get exactly what we have here on day one: 100% un-styled markup that is completely readable and usable. So expect this site to be built with reckless abandon, using the newest browser technologies. This will be progressive enhancement all the way, always starting with this core markup, and building up from there.

### That's it?

This is a blog. It has content that I will want people to read, watch, listen to. What is the minimum viable product for all of those things to happen? You are looking at it. The internet was created to make the world smaller. To make information and opinions available to anyone willing to listen.

This is my hello world. This is my platform for sharing my thoughts and opinions with the world.

## What's Next?

I've got a bazillion ideas bouncing around in my head on what to do next. I can't promise them in any particular order, but these are the things I hope to cover in the near future.

- Best practices for adding CSS, JavaScript, Fonts, and SVGs to the site
- Metalsmith and my static site setup
- How Nunjucks templating language is used on the site
- Automated testing using [Browserstack](https://www.browserstack.com/) and other fun tools
- TravisCI and how I turn commits into deployments
- Amazon S3, Cloudflare and how you can host a blog for very little money
- The power of HTTP/2 and its impact on architectural decisions
- Performance metrics of this site at launch vs each time I add a significant feature
