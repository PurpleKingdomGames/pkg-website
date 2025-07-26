# Purpledoc: Inverted Documentation

What do you do when you are drowning in open source documentation maintenance?

In this post I'm going to outline how we solved our documentation problem by flipping the idea of what is important on its head.

Typically people write docs with code. With the aid of our internal tool 'Purpledoc', we now write code ..with some docs.

> Working software over comprehensive documentation ~ [The Agile manifesto](https://agilemanifesto.org/)

## Declaring Documentation Bankruptcy

At the risk of seeming over-dramatic, I'm going to try and paint a picture of my experience and the trauma of maintaining open source documentation.

### Hopeful beginnings

You've written a Scala library, published it to everyone's favorite repository, and with shaking hands pushed the publish button on a Reddit post that tells the community of it's existence.

It's a nervous time, waiting. Will the world hate it? Will they expose you as the world's worst programmer? Far worse, dear reader: Mostly, they don't care.

But eventually, someone leaves a comment: "Hey! Nice work, are there any docs?" and you realise that you forgot to write any! Luckily, your library is still very small, and a README file will do the job for now.

### Growth

Turns out that contrary to popular wisdom, if you build it, they won't come, at least not until they find out about it, and even then, only when they get a chance.

Nonetheless, with every post and social media prod, gradually people do start to arrive. They come with problems and raised issues. They come with out-of-the-blue PRs and high expectations. Mostly they come with questions about how your library is supposed to work and why doesn't it work the way they expect. Sometimes they turn up with things to show you, things they built with your library.

It's wonderful.

As your community and your code base grows, your notice that your trusty README file is starting to get unmanageable. Your examples snippets are constantly out of date and they are more and more of them.

Feeling the need for better tools, you employ that marvel of engineering that is: MDoc.

MDoc compiles your documentation and makes sure all your examples are correct. Much better. The words might still be out of date - you haven't checked for a while - but at least you know the code is good.

### Scaling out

You also need better organisation, meaning more pages. Your README file needs to grow up into a real website so that people stand a chance at finding what they're looking for.

You find a static site generator, build a site, wrestle MDoc into the build process somehow, and publish to a free hosting service.

It's been a lot of work, and a lot of time not spent working on your library, but hopefully it will be worth it.

### Despair & Defeat

The docs are still growing! People are asking ever more questions, and you can't keep up with releases.

MDoc isn't keeping up either. With every new page added your compile time is increasing, and rapid documentation iteration has gone out the window. Then a new Scala version comes out, you start getting weird errors, and your release pipeline is blocked.

As if that wasn't enough, things with the static site generator aren't looking any better. The version you started out on is no longer supported and you need to migrate. The migration doesn't come with any tooling (that works), and the site isn't even compiled in any meaningful way so.. you're on your own. Maybe porting to a different site builder would actually be easier?

You're drowning in documentation maintenance and can't work on your project.. why are you doing this again?

Oh yeah, because once in a while a wonderful, hopeful, well meaning person with dreams of building something cool with your library, hops onto your chat server and utters those fateful words: "So I was following the docs and trying to get something working, but it all seems to have changed, is that right?"

### The Last Resort

This is what documentation bankruptcy looks like:

When all your docs are hopelessly out of date, you're constantly apologising for the state of the website, yet you cannot summon the will power to fix it.

There is a glimmer of hope in the darkness though, because you have examples. Examples you use for testing the library. Examples you can point your starry-eyed questioners at and say "Look over here, this is the truth."

## An interesting solution

What if you flipped documentation on its head, and made the focus be on guaranteed correct, working code first, and imprecise wording second?

What if you had a tool that interrogated a completely ordinary Scala project, extracted the documentation, and built a website out of it?

Could "Example Driven Documentation" offer a solution to the documentation maintenance problem?

## Introducing Purpledoc

Purpledoc is my attempt to put "Example Driven Documentation" into practice.

The principles of purpledoc are as follows

1. Working code examples over written documentation. The documentation site is principally built from a real, multi-module Scala project. This is the base line and the fall back. If no other mention is made of a feature than an entry in the menu and a link to working example code, that is good and useful.
2. Where further explanation of a feature is wanted, it will live as comments in the code with the example. The comments will be extracted and turned into a page on the website.
3. Conceptual, high level, miscellaneous, and other documentation that rarely changes can be added as a last resort, but the rule is that is contains NO CODE. If you add code here, it won't be checked, thus defeating the point.

### An example

Let's look at the Ultraviolet side as an example. For context, Ultraviolet is a library for writing shader programs in Scala 3.

Here is the website's landing page: https://ultraviolet.indigoengine.io/

The landing page is standard Laika stuff and configurable settings we care about are in the `purpledoc.yaml` config file in the documentation site's repo:

https://github.com/PurpleKingdomGames/ultraviolet-docs

https://github.com/PurpleKingdomGames/ultraviolet-docs/blob/main/purpledoc.yaml

There are two sections generated:

1. [Documentation](https://ultraviolet.indigoengine.io/documentation/) - The expected docs site
2. [Live Demos](https://purplekingdomgames.github.io/ultraviolet-docs//live_demos) - A simple HTML page that contains links to all the live demos.

Inside the documentation section, the top of the menu is a collection of normal static pages, which are generated from markdown by Laika. For example:

The 'Shaders and GLSL' page:

https://ultraviolet.indigoengine.io/documentation/shaders-and-glsl.html

Is built from this markdown:

https://github.com/PurpleKingdomGames/ultraviolet-docs/blob/main/website/documentation/shaders-and-glsl.md

Below that is the 'Examples' section. From here on, the nav structure is generated from the structure of the Mill build:

https://github.com/PurpleKingdomGames/ultraviolet-docs/blob/main/build.sc#L11-L35

This forms a tree of examples, and the leaves of the tree are pages like.

Here is the 'colors' page:

https://ultraviolet.indigoengine.io/examples/fragment/basics/colours/

The page's header comes from a README file:

https://github.com/PurpleKingdomGames/ultraviolet-docs/blob/main/examples/fragment/basics/colours/README.md

..and the body is extracted from the working code - any and all comments are extracted, and treated as Markdown:

https://github.com/PurpleKingdomGames/ultraviolet-docs/blob/main/examples/fragment/basics/colours/src/Colours.scala

Example of documentation that will become markdown and presented on the page:

```scala
  /** This example demonstrates how to calculate a time varying pixel color by using a cosine wave
    * made up of the current time and the UV coordinates.
    */
  // ```scala
  inline def fragment: Shader[FragmentEnv, Unit] =
    Shader[FragmentEnv] { env =>
      def fragment(color: vec4): vec4 =
        val col: vec3 = 0.5f + 0.5f * cos(env.TIME + env.UV.xyx + vec3(0.0f, 2.0f, 4.0f))
        vec4(col, 1.0f)
    }
  // ```
```

And finally, all pages have a link to the code and a link to the live demo baked into them:

- [Page](https://ultraviolet.indigoengine.io/examples/fragment/basics/colours/)
- [Code](https://github.com/PurpleKingdomGames/ultraviolet-docs/blob/main/examples/fragment/basics/colours)
- [Demo](https://ultraviolet.indigoengine.io//live_demos/examples/fragment/basics/colours/)

### Status of Purpledoc

Purpledoc is an internal tool and built for our specific use case, but it is fully open source. You are welcome to use it, fork it, and contribute to it. You can build your own sites with it, but as things stand, they will look just like one of our sites!

Better yet, if you like the idea - steal it! - and build something better that we can switch over to.

It is not a priority of ours to make this into a general purpose tool. We're amateur game devs doing what we must to survive, not passionate documentation tooling engineers!

### Purpledoc's Requirements

Purpledoc is a little command line tool, and it has a few specific requirements / constraints:

*Scala.js*

All our projects are Scala.js based, and purpledoc uses that fact to build live demos of the examples that you can view. It does not expect or know what to do with non-Scala.js projects.

*Mill*

Purpledoc only works with Mill at the time of writing. We're very fond of Mill, with its clean build setup, its snappy cli, and its nestable modules, which seemed like a good fit for the job.

Examples can be made of many nested Mill modules that go on to make up your documentation's navigation tree, as long as you don't do anything crazy, it should work.

*Laika*

Laika is a Scala-based static website generator, that comes with three serious benefits:

1. Familiar ecosystem - we do Scala here, that's one less thing to learn.
2. Scala compiled type-checked APIs - ever tried to upgrade a JavaScript framework with no compiler assistance?
3. It comes both as an sbt plugin, and thankfully, as a normal library you can integrate into anything.

We are in search of robustness here, and Laika has that in spades.

The drawback of Laika (all static site generators have pros and cons) is that it isn't very flexible, but that's fine for our purposes.

### Does it work?

At the time of writing, there are four sites built and maintained with purpledoc, and for our use-case, it's working great!

If there is an example and demo present, it's guaranteed to work. We're not always great at annotating examples, but that's ok. The important bit is the code.

It's reasonably quick to build. Sure, the more modules you have the longer it takes, but while you're working on a particular example you only need to recompile that particular one, and thanks to Mill's build caching, full rebuilds at the first build are very quick.

It is also pretty bullet proof, since it doesn't rely on any fancy stuff like macros.

#### Unexpected benefits

*Free (manual) regression suite!*

Want to know if the next version of your release has broken anything? Bump the version in your docs, follow the compiler to updates any examples, and click through the demos to see if they look ok!

*Feature testing area*

Want to see how your new feature feels in a real project? Add an example on a branch and take it for a spin! Bonus, you've just written the minimal docs for the feature once the release is ready to go out!

## Caveats and trade-offs

A non-exhaustive list of a few biases, assumptions, and trade-offs. 

*We do frontend projects here*

'Example Driven Documentation' is working well for us, but it might not make as much sense in our domains.

*Our issues with MDoc*

Earlier I alluded to problems with MDoc but I did not mean to sound critical.

Generally, MDoc is very robust and clearly a seriously impressive project; Can be a little fiddly, but it's a massive value add and the right tool for most projects.

Our projects generally live on the very latest Scala versions, and in the early days of Scala 3, this lead to cases where the MDoc macros were slightly behind the state of Scala 3, and this blocked our release pipeline.

*Indigo's docs are still transitioning*

The aim is to have a pyramid of "most docs are examples" at the bottom and "a few pages of unavoidable description" at the top. Indigo is currently still a bit top heavy, but we're working on it.

*No support for API docs*

Or to put it another way: If it isn't in an example, there is no information about it, and it is less discoverable.

Early on the decision was made to cut Scaladoc and Unidoc out of the pipeline. As with MDoc, we were having infrequent but significant problems with them that could prevent releases.

The benefit of omitting them is a more robust pipeline, the drawback is there there is no comprehensive code reference.

Adding API docs back in is under consideration.

*Top to bottom*

If your example code contains comments, those comments will be turned into a web page. What that means is that you need to structure the example code carefully, such that the code 'reads' top to bottom. Otherwise you end up using function and classes before you've introduced them.

*Documentation lives in a separate repo*

Or at least, this is how we're using it. Having all the library code and then all of the example documentation code in the same repo could be rather noisy.

Is this a problem? Not for us, but it's something to be aware of.

## Conclusion

// TODO Summary, bullet point benefits, etc.