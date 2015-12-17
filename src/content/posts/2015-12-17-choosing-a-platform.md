---
title: Choosing a Blogging Platform
layout: post.html
---

One of my first major decisions when starting this new blog was going to be platform. I come from a Drupal development background so one might expect me to fire up a new Drupal 7 site, or be adventurous and showcase the new Drupal 8. But for me, the overhead of dealing with an entire CMS was way more than I needed for what I was trying to build. On top of that, even as a Drupal dev, I spend more time in JavaScript than I do PHP. So with static site generators being "so hot right now", I set out to find the right one for me.

## Navigating the sea of choices

There are over 125 different static site generators on [StaticGen](https://www.staticgen.com/), and I certainly didn't have time to try them all before deciding, so I had to narrow down my search. Here are the ways I did all of that narrowing:

### Must NodeJS based

- As much as I love Jekyll, Middleman, I'm not really interested in using a Ruby based site generator. It's not so much that I don't like Ruby, it's just that I've been spending the last year trying to move our stack away from Ruby ([LibSass](http://sass-lang.com/libsass), [Sass-lint](https://github.com/sasstools/sass-lint), non-ruby style guides). So the last thing I want to do is add a Ruby dependency back in!
- Plus, everything else I do is written in JavaScript, so it seems natural to try and find a NodeJS powered site generator as well.

### Must have a great community

- Part of having a strong community is having a strong set of leaders who are moving the project forward. As much as I love open source, I have been stung quite a few times recently by relying on projects that have fallen stagnant or been put out to pasture, and no longer maintained. So one major criteria was to find a project that was part of a strong organization, and had a large list of contributors from within that organization, and from without.
- The community is only as good as the people you end up interacting with. For me, those people are going to be maintainers of the generator repo and individual plug-ins, blog authors, and anyone I meet through twitter or other forums.  There is no room in my workflow for people with horrible attitudes or excluding behavior. I will only support, promote and contribute to a project that respects all of its users.
- Oh, and a Slack channel. A Slack channel would be nice.

### Must be extensible
- The best open source projects are built around a codebase that can be extended and added on to. The [Sass](http://sass-lang.com/) community is amazing for many reason, but one of them is that Sass is a framework that can be built on top of. Because of Sass you have amazing projects such as [Susy](http://susy.oddbird.net/), [Bourbon](http://bourbon.io/), [Breakpoint](http://breakpoint-sass.com/), and [Foundation](http://foundation.zurb.com/) which harness the power of Sass to build libraries that empower the Sass community to do amazing things.
- I expect the static site generator I choose to be pretty powerful out of the box, but I want to make sure it is built in such a way that it can be easily modified and enhanced. I know I want a NodeJS based generator, so creating new functionality should be as simple as writing a small NodeJS module.

### Must have support for popular templating languages

- Much of the work I've done recently has been harnessing the power of modern templating languages. My original go-to JS based language was [Swig](https://github.com/paularmstrong/swig), but as I just found out that it is no longer being maintained, I decided that I wanted to find something that used [Nunjucks](https://mozilla.github.io/nunjucks/).
- For me, a powerful and extensible templating language is the key to having a successful static site. Nunjucks bring in [template inheritance](https://mozilla.github.io/nunjucks/templating.html#template-inheritance), [includes](https://mozilla.github.io/nunjucks/templating.html#include), [looping through data](https://mozilla.github.io/nunjucks/templating.html#for), built-in and custom [filters](https://mozilla.github.io/nunjucks/templating.html#filters), and other modern conveniences for turning the data provided by the site generator into the markup that I want to use.



## Making my decision

With all of these requirements, and a good deal of searching, asking and inquiring, I eventually landed on the [Metalsmith project](https://github.com/segmentio/metalsmith). As a NodeJS based project under the [SegmentIO](https://segment.com) umbrella, with a great deal of plugins from Segment and 3rd party contributors, I felt pretty confident that I could build a solid foundation out of this platform....Oh yeah, and they have a [slack channel](http://metalsmith-slack.herokuapp.com/) too.

So now that I had a base to start with, I'll spend the next few entries going over how to get set up with Metalsmith, some of the pains that I went through, and all of the many joys. Thanks for following along. See you all next time.
