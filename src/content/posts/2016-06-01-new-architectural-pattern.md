---
title: In Need of a New Architectural Pattern
layout: post.html
draft: true
---

A funny thing happened this last month. Between two different events, and three isolated groups, a consensus was made, terminology was chosen, and the way that we approached building and implementing design systems changed forever.

## The Red Hat Design System

At Red Hat we have spent the last year creating a new design system: a collection of rules and assets that allow us to [express everything our visual language needs to say](https://www.youtube.com/watch?v=BAQUo2QM1kg). With a design sytem of complex of nestable templates, we quickly realized that we needed to create an abstraction layer between the data needed by our templates, and the data we gathered from the user in our content types.

### Our Problem

If we presented the user with our view's data model, they would need to traverse down several levels of objects before they could enter a single page title. The resulting data would look something like this:

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

Not only did this create a large nested admin form, but it also meant that our title was stuck inside of a group, inside of the header of our band for the life of this website. We couldn't move the title into a different template without migrating ALL of the content in our CMS.

### Our Solution

Our solution to this problem was to create a data model that matched what we were trying to collect from the user:

```
{
  "title": "This is a title",
  "headline": "This is my headline"
}
```

And then we'd create a template that mapped this model's data to our own templates' needs:

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

The beauty of this approach is that our CMS and the content author are never made aware of the complexities of our view. They just enter a title and headline. This also means that if we wanted to change the theme value in our group, we would simply update this template file. We could even change the templates used to render this content if we created `new_band_title.twig`.

It wasn't long before we converted all of our patterns over to this new 'intermediary' approach. So when we finally launched our new content types to our users they saw nothing but organized, hand crafted data models that were easy to edit and navigate. They were completely unaware of the work that the templates were doing behind the scenes.

## Integrating Pattern Lab into Drupal

In another corner of my company, a group of developers was in the midst of trying to integrate a [Twig version of Pattern Lab](https://github.com/pattern-lab/edition-php-twig-standard) into Drupal 8, which already supported the [Twig language](http://twig.sensiolabs.org/).

### The Problem

Having native support of Twig meant that with a little configuration, Drupal 8 could read and render the atom, molecule and organism twig templates they'd created in Pattern Lab. The problem they quickly ran into was that the Drupal data model for any given content type was completely different than the templates they'd created in Pattern Lab.

They would either have to modify the Drupal content type to match their design system data needs, or they'd have to start with the Drupal data model and build their design system around the structure of that data. Both of those solutions would be awful!

#### Change the model?

Modifying Drupal's data model to match Pattern Lab would not only take a good bit of effort, but it would also cause the same large nested structures that we ran into at Red Hat. It would also lock them into using same set of templates, in that same order for the life of that content type.

#### Change the view?

Going back to Pattern Lab and changing their templates to match Drupal's data would be a cleaner approach, but it would, in all practicality, make those templates unusable to any other content type, and they'd be back to writing a single template for every page.

### The Solution!

Each Drupal content type is rendered by a template, based on a simple naming convention. So when the "Article" content type is rendered, it uses the `node--article.html.twig` template to render the data. This template is a perfect location to create an abstraction layer between the data given by Drupal and the data needed in Pattern Lab. So this is what this team came up with:

```

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

#### Translation, Allocation, Embellishment

Without a single minute of collaboration between this team and my team at Red Hat, we both came up with the exact same solution to the problem of mismatched model and view data needs. Both of our solutions involved using an intermediary template to take the model given to us by Drupal ("url", "label", node.bundle|title", "content.field_image"), and pass it into the templates we'd created in our design system.

Through the power of a modern templating language, they could not only translate Drupal's `label` to their card's `title`, but they could also embellish the view with `"card_image_top": true`, and allocate the `content.field_image` to the `card_image_top` block of the template. These 3 types of transformations allowed them to completely repurpose Drupal's model for the view they wanted to render.

## 30 Minutes Before a Drupalcon Talk

A few weeks ago, as I was preparing to give a [talk on Design Systems](bit.ly/road-runner-rules) at Drupalcon New Orleans, I sat down in the speaker lounge with [John Albin](https://twitter.com/johnalbin) hoping to tell him about the work I'd been doing at Red Hat. Being less than an hour before *his* talk, the conversation rightfully pivoted to his work and some of the troubling epiphanies he'd had recently.

You see, he's the author of the Drupal [Zen theme](https://www.drupal.org/project/zen), and with the Twig-powered release of Drupal 8 in recent months, he'd been spending a good deal of time working on a new version of this extremely popular theme. He went on to tell me about a concern he had with the way he was approaching his `.html.twig` files. Usually, he said, these files would be filled with the HTML used to render that particular piece of content. But he found himself not wanting to write any markup at all, prefering to fill them with Twig statements like the following:

```
{%
  include "@STARTERKIT/navigation/tabs/tabs.twig" with {
    heading: 'Primary tabs'|t,
    modifier_class: 'tabs--primary',
    tabs: primary
  } only
%
```

This is the first time I'd sat down with John in a number of years, but it seemed that he had come to the same conclusion that my Phase 2 co-workers and I had come to, about the role of an intermediary file between Drupal's data model and our design system. I told John not to worry. The approach he was taking was not crazy at all. It was actually well tested, extensively documented, and has been an accepted practice for the past 20 years.

Translation, allocation, embellishment: these are the tools of the "Presenter". As it turned out, all of us were building our design systems using the "Model, View, Presenter" architectural pattern.

#### To Be Continued


















