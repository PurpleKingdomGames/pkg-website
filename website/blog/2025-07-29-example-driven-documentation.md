---
title: Example Driven Documentation
author: Dave Smith
authorURL: https://mastodon.gamedev.place/@davesmith00000
authorImageURL: /img/davesmith00000.png
---

![Example Driven Documentation](/img/blog/example_driven_docs.png)

Providing documentation for open source projects is a necessary support activity for any library author, but it comes with a heavy maintenance cost, particularly for large projects.

In my experience, a team of one or two developers cannot sustain the maintenance of documentation for even one large library or framework, let alone two or three or four, as we do today.

My goal with this post is to share an idea with our fellow open source library maintainers, a notion I've come to think of as 'Example Driven Documentation'. There will be a lot of references to the implementation of this idea that we now use via an open source internal tool called '[Purpledoc](https://github.com/PurpleKingdomGames/purpledoc)', but it's the idea that I want to offer up for consideration.

People typically write documentation containing code examples, but what are the maintenance implications of flipping that around, and having code examples that happen to contain documentation?

<!--truncate-->

## The Documentation Problem

At the risk of seeming over-dramatic, I'm going to try and paint a picture of my experiences of maintaining open source documentation.

I will spare you the worst parts that I believe are specific to our use case, so what follows is ...just a taste.

### Hopeful Beginnings

You've written a Scala library, published it to everyone's favorite repository, and with shaking hands you pushed the publish button on a social post that tells the community of its existence.

Eventually, someone leaves a comment: "Cool, are there any docs?" Luckily, your library is still small, and pointing them at the hand-crafted, artisanal `README.md` file will do for now.

### Growth

As your community and your code base grows, you notice that your trusty README file is starting to get unmanageable. Your example snippets are constantly out of date, and there are an ever increasing number of them.

Feeling the need for better tooling, you set up the marvel of engineering that is [MDoc](https://scalameta.org/mdoc/).

MDoc compiles your documentation and makes sure all your examples are correct. The words might still fall out of date, but at least you know the code is good.

### Scaling Out

README files only scale so far, and you realise that you're going to need to build a docs site(*). This is not the part of the job you enjoy, so you're looking for a fairly out-of-the-box-batteries-included solution.

It takes quite a while to choose a site generator, as all the available options are very opinionated, and opinionated solutions mean that there are trade-offs to consider.

Nonetheless, after a surprisingly large amount of set up work (time not spent on library development), your site goes live!

_(*I think this is always the case. The exception that proves the rule is my favorite library, [OS-Lib](https://github.com/com-lihaoyi/os-lib), which gets away with just one massive README because of the nature of the tool.)_

### The Churn

The docs are still growing! People are asking ever more questions, and you can't keep up with the changes in your releases.

MDoc isn't keeping up either. With every new page added your compile time is increasing, and any hope of rapid writing iteration goes out the window.

If that wasn't enough, you're also quickly losing faith that any of the 'optimistically wordy surrounding descriptions' you wrote five versions ago are still relevant, and reviewing it all feels like a mammoth undertaking.

You're drowning in documentation and you can't work on your project, but maybe.. maybe no-one will notice if you just... leave it?

It's about now that a wonderful, hopeful, well meaning person with dreams of building something cool with your library, hops onto your chat server and utters those fateful words: "So I was following the docs and trying to get something working, but it all seems to have changed, is that right?"

### Documentation Bankruptcy

This is what documentation bankruptcy looks like:

When all your docs are hopelessly out of date, you're constantly apologising for the state of the website, you are losing frustrated users, and yet you cannot summon the will power to fix it.

There is a glimmer of hope in the darkness though, because you have examples. Examples you use for testing the library. Examples that require no special effort to keep up to date because they're part of your dev process. Examples you can point your starry-eyed questioners at and say "Look over here, it's not much, but it is the truth."

Maybe we can just do more of that?

What if you flipped documentation on its head, and made the focus be on 'working code' first, and 'imprecise descriptions' second?

What if you had a tool that interrogated a completely ordinary Scala project, extracted the documentation, and built a website out of it?

Could "Example Driven Documentation" offer a solution to the documentation maintenance problem?

## Purpledoc

Purpledoc is my attempt to put the idea of "Example Driven Documentation" into practice - by turning traditional documentation inside out. Instead of embedding examples inside prose, we embed prose inside working examples. Sort of the inverse of [Literate Programming](https://en.wikipedia.org/wiki/Literate_programming): Where Knuth wanted elegance, we want docs that don't fall out of date.

The process is ..fantastically boring. And that is the point. It takes working code such as this:

~~~scala
object Example:

    /** ### Orbit
      *
      * Returns a position in orbit around a given point.
      */
    // ```scala
    Signal.Orbit(context.frame.viewport.center + Point(0, 200), 50).map { position =>
      circle.moveTo(position.toPoint)
    }
    // ```
~~~

..and processes it into Markdown, like this:

~~~markdown
### Orbit

Returns a position in orbit around a given point.

```scala
Signal.Orbit(context.frame.viewport.center + Point(0, 200), 50).map { position =>
  circle.moveTo(position.toPoint)
}
```
~~~

The magic isn’t in the implementation — it’s in the structure this approach gives you as a maintainer. Your job becomes writing useful, self-contained examples in a regular Scala project. No more fighting writer’s block, or wondering whether the code snippets still compile when taken together. They do. Guaranteed.

And if you’ve ever made the classic Scala documentation mistake of forgetting to include a vital import, it doesn’t matter anymore. You do not need to worry about copying everything into the docs manually or trying to second-guess what readers will miss. The full working code is always just one link away.

Purpledoc documentation sites are built around a three tier approach, with only the first being strictly necessary.

1. *(Required) Tier 1 - Working code examples over written documentation.* The documentation site is primarily generated from a real, multi-module Scala project full of examples. This is the baseline and the fall back. If no other mention is made of a feature than an entry in the menu and a link to working example code and a demo, that is good and useful to everyone.
2. *(Optional) Tier 2 - Code is enhanced with prose.* When further explanation is helpful, it lives as comments inside the code. The comments will be extracted and turned into a page on the website. This keeps all the details of a feature in one place, making it easy to maintain.
3. *(Optional) Tier 3 - High-level conceptual docs.* Broader overviews, design explanations, and other long-lived content can be added as standalone pages, but the golden rule is: They should not contain code. You can add code here, but you shouldn’t, because it won’t be checked or verified.

### An Example

Let's look at the Ultraviolet documentation site as an example. For context, Ultraviolet is a library for writing shader programs in Scala 3.

https://ultraviolet.indigoengine.io/

The site contains some traditional static pages, such as the ['Shaders and GLSL' page](https://ultraviolet.indigoengine.io/documentation/shaders-and-glsl.html) that are built from [markdown](https://github.com/PurpleKingdomGames/ultraviolet-docs/blob/main/website/documentation/shaders-and-glsl.md).

More interesting is the 'Examples' section. From here on, the navigation structure is generated from the structure of the [documentation project's Mill build](https://github.com/PurpleKingdomGames/ultraviolet-docs/blob/main/build.sc#L11-L35), producing a tree of nav items.

The leaves of the tree are pages, for example, here is the 'colours' page:

https://ultraviolet.indigoengine.io/examples/fragment/basics/colours/

The page's header comes from a README file:

https://github.com/PurpleKingdomGames/ultraviolet-docs/blob/main/examples/fragment/basics/colours/README.md

Any and all comments in the code are extracted, assumed to be Markdown, and become the body of the example's page on the website:

https://github.com/PurpleKingdomGames/ultraviolet-docs/blob/main/examples/fragment/basics/colours/src/Colours.scala

### Status of Purpledoc

Purpledoc is an internal CLI tool built for our specific use case, but it is fully open source. You are welcome to use it, fork it, and contribute to it. You can build your own sites with it, but as things stand, all sites will resemble our internal layout and structure. Better yet, if you like the idea - steal it! - and build something better!

It is not a priority of ours to make this into a general purpose tool. We're amateur / hobbyist game devs doing what we must to survive, not passionate documentation tooling engineers!

Currently, purpledoc only works for [Scala.js](https://www.scala-js.org/) based library / framework projects and requires the documentation project to use [Mill](https://mill-build.org/).

At the time of writing, there are four sites built and maintained with purpledoc, and for our use-case, it's working great! It is also pretty bullet proof, since it doesn't rely on any fancy stuff like macros.

#### Unexpected benefits

There were a few unintended benefits that came out of setting up this 'example first' documentation tooling that makes documenting a feature as easy as coding up a minimal example.

Here are a few examples:

1. Free (manual) regression suite! - Want to know if the next version of your release has broken anything? Bump the version in your docs, follow the compiler to update any examples, and click through the demos to see if they look ok. Bonus, your docs are now ready for your next release.
2. Feature testing area - Want to see how your new feature feels in a real project? Add an example on a branch and take it for a spin! Bonus, you've just written the minimal docs for the feature once the release is ready to go out.
3. Author's aid to memory - Forgotten how to do something in one of your libraries? Once you dig out the solution, throw a quick example into the docs project, and everyone gets the benefit.

#### Rough edges

Purpledoc was made for our needs, so there are a few things to bear in mind: 

1. We do frontend projects here - 'Example Driven Documentation' is working well for us, but it might not make as much sense in other domains.
2. No support for API docs currently - Not having it simplifies and tightens the build process, but reduces API / feature discoverability, i.e. If it hasn't been documented on purpose, you probably won't know it's there.
3. Writing code with in-line docs takes practice - the page is built from top to bottom, so your code has to initialise in the order it makes the most sense to read it, which isn't always how we'd structure our code.

## Conclusion

I've always liked this principle from the [Agile manifesto](https://agilemanifesto.org/), and unintentionally, it's become our open source documentation survival tactic:

> Working software over comprehensive documentation

For our requirements, Purpledoc and 'example driven documentation', has transformed the heartache and burden of documentation maintenance, into a reliable process that’s valuable to both authors and readers.

While the process isn't perfect, and the result may lack the polish of a normal docs site that someone lovingly labors over, making the documentation 'code first' yields a number of benefits to the maintainer, including:

1. Fast (relatively), robust, and reliable builds.
2. High degree of mechanical assistance.
3. Clear division between long lived / low maintenance conceptual pages vs library version sensitive examples, for higher confidence in documentation accuracy.
4. 'Free' manual regression suite for upcoming releases.
5. New feature / API UX testing playground.
6. Progressive enhancement. Adding a working example is enough by itself, embellishing with words is a nice to have.
7. Quick and easy to add new examples that everyone benefits from.

This was our solution to the documentation maintenance problem. It may not work for everyone, but if nothing else, it does go to show that there is room for alternative approaches in this space.

## Try it out!

If you'd like to see how it works in practice, why not add an example to one of our documentation projects and send over a PR? We can always use the help!

- [Ultraviolet](https://github.com/PurpleKingdomGames/ultraviolet-docs)
- [Indigo](https://github.com/PurpleKingdomGames/indigo-docs)
- [Tyrian](https://github.com/PurpleKingdomGames/tyrian-docs)
- [Roguelike-Starterkit](https://github.com/PurpleKingdomGames/roguelike-starterkit-docs)

Indigo in particular has plenty of [open "missing example" issues](https://github.com/PurpleKingdomGames/indigo-docs/issues) if you’re looking for somewhere to start.

---

## Enjoyed this post? Want to support what we do?

We’re always open to contributions — whether that’s code, feedback, or just good conversation. You can:

- Check out our projects on [Github](https://github.com/PurpleKingdomGames/)
- Join our [Discord server](https://discord.gg/b5CD47g) to share what you’re working on, ask questions, or hang out
- Support our tools via [Github Sponsors](https://github.com/sponsors/PurpleKingdomGames) or our games via [Patreon](https://www.patreon.com/purple_kingdom_games) to help keep our projects alive and well

Thanks for being part of it!
