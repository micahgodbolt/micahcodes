---
title: A New Design System Architecture
layout: post.html
---

A funny thing happened this last month. Between two different events, and three isolated groups, a consensus was made, terminology was chosen, and the way that we approached building and implementing design systems changed forever.

## The Red Hat Design System

At Red Hat we have spent the last year creating a new design system: a collection of rules and assets that allow us to [express everything our visual language needs to say](https://youtu.be/BAQUo2QM1kg?t=36m14s).

One of our primary goals was to create a single set of templates that could serve us in prototyping as well as production. So then, armed with a library of layout templates like `band.twig` and `group.twig` and component templates like `band_header.twig` we started building out the content data models that matched the way these templates were nested together.

### Our Problem

If we presented the user with our template's data model, they would need to traverse down several levels of objects before they could enter a single page title. The resulting data would look something like this:

```
{
  "template": "band.twig",
  "header": {
    "content": [
      {
        "template": "group.twig",
        "theme": "dark",
        "body": {
          "content": [
            {
              "template": "band_header.twig",
              "title": "Finally I can Add My Title",
              "headline": "Two in a row? That was easier."
            }
          ]
        }
      }
    ]
  }
}
```

And the resulting admin form would look like this:

<img style="height: auto; max-width:100%;"  src="/assets/img/nesting.png" alt="Bad nested data">

Not only did this create a large nested admin form, but it also meant that our title was stuck being rendered by the `band_header.twig` inside of the body of `group.twig`, inside of the header of `band.twig` for the life of this website. We couldn't move the title into a different template without migrating ALL of the content in our CMS.

With a design sytem of complex of nestable templates, we quickly realized that we needed to create an abstraction layer between the data entered by the user, and the data needed by our templates.

### Our Solution

Our solution to this problem was to create a data model that matched what we were trying to collect from the user:

```
{
  "title": "This is a title",
  "headline": "This is my headline"
}
```

And then we'd create a new template that mapped this model's data to our own templates' needs:

```
{% embed 'band.twig' %}
  {% block header %}
    {% embed 'group.twig' with {'theme': 'dark'} %}
      {% block body %}
        {% include 'band_header.twig' with {
          "title": title
          "headline": headline
        } %}
      {% endblock %}
    {% endembed %}
  {% endblock %}
{% endembed %}
```

> Most modern templating languages, like [Twig](http://twig.sensiolabs.org/), let you `embed` templates into your HTML file. Each embed can have multiple `blocks` which are drop zones for more markup. You can nest embeds inside of each other as well as `include` other standard templates. Embeds and includes can also be passed an object of custom data.

The beauty of this approach was that our CMS and the content author were never made aware of the complexities of our view. They just enter a title and headline. This also means that if we wanted to change the theme value in our group, we would simply update the data being passed into the `group.twig` template. We could even change the templates used to render this content if we created `new_band_header.twig`.

It wasn't long before we converted all of our patterns over to this new 'intermediary' approach. When we finally launched our new content types to our users they saw nothing but organized, hand crafted data models that were easy to edit and navigate. They were blissfully unaware of the work that the templates were doing behind the scenes.

## Integrating Pattern Lab into Drupal

In another corner of my company, a group of developers were in the midst of trying to integrate a [Twig version of Pattern Lab](https://github.com/pattern-lab/edition-php-twig-standard) into Drupal 8, which already supported the [Twig language](http://twig.sensiolabs.org/).

### The Problem

Having native support of Twig meant that with a little configuration, Drupal 8 could read and render the atom, molecule and organism twig templates they'd created in Pattern Lab. The problem was that a Drupal content type data model was completely different than the templates they'd created in Pattern Lab.

They would either have to modify the Drupal content type to match their design system data needs, or they'd have to start with the Drupal data model and build their design system around the structure of that data. Either of these solutions would negate most of the benefits they'd hope to gain from this integration!

#### Change the model?

Modifying Drupal's data model to match Pattern Lab would not only take a good bit of effort, but it would also cause the same large nested data structures that we ran into at Red Hat. It would also lock them into using same set of templates, in that same order for the life of that content type.

#### Change the view?

Going back to Pattern Lab and changing their templates to match Drupal's data would be a cleaner approach, but it would, in all practicality, make those templates unusable for any other content type, and they'd be back to writing a single template for every page.

### The Solution!

Each Drupal content type is rendered by a template, based on a simple naming convention. So when the "Article" node is rendered, it uses the `node--article.html.twig` template to render the data. This template was the perfect location to create a abstraction layer between the data given to them by Drupal and the data needed in Pattern Lab. So this is what this team came up with:

```
<!-- node--article.html.twig  -->
{% embed "@molecules/cards/card.twig"
  with {
    "classes": [
      "card"
    ],
    "url": url,
    "title": label,
    "card_image_top": true,
    "card_links": true,
    "card_footer": node.bundle|title
  }
%}
  {% block card_image_top %}
    {{ content.field_image }}
  {% endblock %}

  {% block card_links %}
    {{ content.links }}
  {% endblock %}
{% endembed %}
```
> Once again an embed is used to render the card molecule template. Into that template is passed a data object containing a class, url, title and other variables. The embed also has two `block` zones, `card_image_top` and `card_links`. This allowed them to drop the images and links into a specific part of the template file.

### Translation, Allocation, Embellishment

Without a single minute of collaboration between this team and my team at Red Hat, we both came up with the exact same solution to the problem of mismatched model and view data needs. Both of our solutions involved using an intermediary template to take the model given to us by Drupal ("url", "label", node.bundle|title", "content.field_image"), and pass it into the templates we'd created in our design system.

Through the power of a modern templating language, they could not only **translate** Drupal's `label` to their card's `title`, but they could also **embellish** the view with `"card_image_top": true`, and **allocate** the `content.field_image` to the `card_image_top` block of the template. These 3 types of transformations allowed them to completely repurpose Drupal's model for the view they wanted to render.

## 30 Minutes Before a Drupalcon Talk

A few weeks ago, as I was preparing to give a [talk on Design Systems](http://bit.ly/road-runner-rules) at Drupalcon New Orleans, I sat down in the speaker lounge with [John Albin](https://twitter.com/johnalbin) hoping to tell him about the work I'd been doing at Red Hat. Being less than an hour before *his* talk, the conversation rightfully pivoted to his work and some of the troubling epiphanies he'd had recently.

You see, he's the author of the Drupal [Zen theme](https://www.drupal.org/project/zen), and with the Twig-powered release of Drupal 8 in recent months, he'd been spending a good deal of time working on a new version of this extremely popular theme. He went on to tell about what he thought was a **crazy** approach to writing his `.html.twig` files. Usually, he said, these files would be filled with the HTML used to render that particular piece of content. Instead, he found himself not writing any markup in them at all, prefering to fill them with embeds and includes like the following:

```
{%
  include "@STARTERKIT/navigation/tabs/tabs.twig" with {
    heading: 'Primary tabs'|t,
    modifier_class: 'tabs--primary',
    tabs: primary
  } only
%
```

This is the first time I'd sat down with John in a number of years, but it seemed that he had come to the same conclusion about the use of an intermediary file between Drupal's data model and our design system. I told John not to worry. The approach he was taking was not crazy at all. We had all come to the realization that our application layer would never directly access out design system. There was always an intermediary.

## Presenting a New Architectural Paradigm for Design Systems

It turned out, we were all building our design systems using the exact same approach. Even more incredible, this approach has been around since the early 90s! The ["Model, View, Presenter" architectural pattern](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93presenter) is a pattern rooted in the creation of Microsoft Windows interfaces, and perfectly describes the roll of our "presenter" as an intermediary between the application data model and the design system's view.

> **Translation, allocation, embellishment**: these are the tools of a Presenter.

This changed everything for me, while at the same time made everything completely clear. Now we could move forward building complex design systems knowing exactly how these systems would interface with our applications. This is the future of design systems, the future of component APIs, and I'm confident to say, is the future of how we build websites.


















