# Post-mortem: Our Trouble with The Elm Architecture

Over the years, my co-conspirator David and I have made dozens of demos and small applications using our Elm inspired libraries, but on the occasions where we've attempted a more substantial project we have found ourselves in a little trouble.

Based on our experiences, in this write-up I'm going to look at how Elm and the Elm architecture subtly encourages you to write programs that don't scale well, and what we can do about that, now that we're aware of it.

In this write up I'm going to refer to a few projects and libraries. I won't bore you with the details, but if you're not sure what I'm talking about, check the appendix at the end.

## Overview

### 2021: A roguelike odyssey

My attempt to follow the Roguelike tutorials during the annual '[RoguelikeDev Does The Complete Roguelike Tutorial](https://www.reddit.com/r/roguelikedev/comments/o5x585/roguelikedev_does_the_complete_roguelike_tutorial/)' in 2021 was a rush job. I knew it would be when I started, just trying to keep up is half the fun.. but when I'd finished the tutorial and I marveled at my first little roguelike game, I felt an enormous sense of achievement. This was not just a working roguelike game after all, it was a game based on an exercise real game developers enjoy taking part in, and it was done in our game engine, Indigo, and it was the first time someone has done it using Scala.

There was no denying that code was bad though, and as charming as the ASCII graphics were, I really wanted to drag the game kicking and screaming into the 90s with some pixel art animation. If I wanted to go any further with this project, I was going to have to do some serious clean up work.

Initial refactoring efforts went ok, with the goal being to allow time for animations between turns and swapping out graphics and so on. Things started to get more difficult when I tried to work on the characters, and finally ground to a halt completely working on the UI. For reasons I couldn't put my finger on, the game had ceased being fun to work on. Every time I went back to it I felt I needed to brace myself for another hard day's work. Then life intervened, and before I could really work out why that was, I was mercifully distracted by another piece of work, and never returned to it.

### Ahoy, matey!

David and I had been trying to build a project together for years. It's quite difficult building something together remotely, particular since while David is good at keeping regular hours, I am not, and so we regularly aren't working at the same time, despite living less than a hundred miles apart.

But we've done this before, and we know what to do: At the beginning of a project like this, someone really just needs to charge ahead and lay the foundations for a while, based on mutual discussion and agreed designs. This time, David took the role of lead game designer and programmer, on an idea we'd been chewing over for a pirate island colony builder. He even taught himself how to do pixel art for placeholder graphics so he wouldn't get stuck waiting for me!

After some hard work, David announced that he felt we nearly had a first, rough demo, but there were a few outstanding issues, and I was drafted in to help.

Among other things, I decided that I really wanted try changing the implementation for the NPCs to use Indigo's new Actor types. I did not succeed. David and I stopped to compare notes, and both complained about the same thing: The code base was getting harder and harder to work on.

This was starting to feel a lot like the Roguelike all over again.

### Summer Workflows

Although our first love is game building, as well as our game engine we also build and maintain a web framework, Tyrian, that is also based on the Elm architecture.

This year I was kindly asked if I'd be a co-mentor on a [Google Summer of Code project](https://medium.com/business4s-blog/gsoc-2025-building-a-web-ui-for-workflows4s-with-scala-js-and-tyrian-cf4b482dbf63) about visualising Workflow4s business processes using Tyrian.

My role in the project is as a co-mentor, explaining how the Elm architecture works and helping review code, rather than actually writing it.

As I watched the solution unfold, with the detachment that comes from not working on the code yourself, I could see our excellent mentee falling into some of the same traps David and I had on our own projects. Even though he was using Tyrian and not Indigo, familiar code patterns were developing that would cause trouble later.

Happily, by the time the GSoC project was in full swing, I'd developed a few ideas about what was going on, and I believe we've been able to avoid disaster.

## Root Cause

Before I go any further, I'd like to make it clear that this post is not a criticism of Elm or the Elm architecture, it's just an observation.

It is my view that there is no perfect frontend architecture out there, only a choice of trade-offs, values, and priorities. In my opinion, for my use case, The Elm Architecture (AKA the TEA pattern) is still the best frontend pattern available today, and I wouldn't use anything else.

That being said, the claim I'm going to make is as follows:

> The design of both Elm and The Elm Architecture, subtly discourage programmers from writing scalable code.



### Elm's Promise of Scalability



### Low hanging fruit

tuple return types are a PITA.

In order view construction

Msg's as an ADT

One big Model.

### Patterns.

## Where do we go Next

A case where modularity has been working shockingly well for years: Scenes.


## Future direction


Actors / Performers
ViewModel

Outcome
out of order rendering


Elm development has slowed, feels like they've reached the natural conclusion of what can be done with the arch, lang, principles. We're using Scala and don't have the principles, so we can carry on.

Compare Elm with a tree of stateful nodes

### Encoding vs Educating

## Appendix

### Credentials and a word on Elm

I have been building two libraries - a web framework and a game engine - that are based on the Elm architecture for nearly a decade, as well as countless demos and projects.

I like to think I know a bit about the Elm architecture, but nonetheless, what follows here is just an opinion, based on my experiences.

Before I go any further, I'd like to make it clear that this post is not a criticism of Elm or the Elm architecture. In fact I haven't used Elm itself for a very long time, and it's possible that it has moved on in the meantime, or that there is discourse in their community about these issues.

It is my view that there is no perfect frontend architecture out there - and I've looked.. - only a choice of trade-offs, values, and priorities. In my opinion, for my priorities and the kind of projects I build, The Elm Architecture (AKA the TEA pattern) is still the best frontend pattern available today. It isn't perfect, as we'll see, but I still wouldn't use anything else.

### Libraries & Projects

A few words on the projects and libraries I'm going to talk about in this post for those who aren't familiar, feel free to skip ahead.

#### Elm

Elm's goal was to bring the kind of program correctness that functional programmers enjoy, to the world of frontend programming. The desired state is that "if it compiles, it works".

Elm is really too things:

1. Elm the language (and compiler and ecosystem)
2. The Elm Architecture

Elm the language is difficult to separate from the architecture, and we'll talk about about the language and how it has shaped Elm the architecture.

The architecture pattern (known as the TEA pattern) however can be seen as distinct and useful on it's own.

#### Tyrian - Elm-inspired Web Framework

Tyrian is our web framework, and at the time of writing, it follows the classic Elm approach closely enough that if an Elm developer saw it, they'd understand what's going on.

There are some differences with Elm itself. Since Tyrian is written in Scala, we are not constrained by the compiler as Elm is by design, following it's principles and goals of compile time correctness. In practice, this means that Tyrian is a little less strict and correct, but a little more direct and fun. For example, if you can call JS whenever you need to, though you are advised to do so in a `Cmd`. Scala also comes with Higher-kinded types, and Monads and other functional goodness that Elm shies away, and it is equally happy with more Object Oriented styles of coding too.

#### Indigo - Game engine

Indigo is our game engine and was written before Tyrian came into being, and while it definitely follows the Elm architecture, it has deviated here and there for three reasons:

1. Technical - Indigo renders via graphics hardware, not HTML, a very different problem space.
2. Purpose - Games are not web apps. It is possible to make a game in a web framework, but it isn't ideal as they emphasise different things
3. I didn't understand the Elm architecture then, like I do now, and made some non-canonical choices... which mostly worked out well! More on that later.

#### Game: My Generic Roguelike

In June 2021, I took on the '[RoguelikeDev Does The Complete Roguelike Tutorial](https://www.reddit.com/r/roguelikedev/comments/o5x585/roguelikedev_does_the_complete_roguelike_tutorial/)' challenge. People kept asking if it could be done with Indigo and I was curious myself.

That wonderful experience went on to inspire a huge number of Indigo improvements, [a library](https://github.com/PurpleKingdomGames/roguelike-starterkit), [a talk](https://github.com/PurpleKingdomGames/talks/tree/main/lovable-scala-rogues), and a _demo_ of a more complete looking Roguelike game called: [My Generic Roguelike](https://github.com/davesmith00000/roguelike).

#### Game: Pirates

'Pirates' is _not_ the name of the game we're making, but we'll use it as a working title since we haven't released the name yet.

The game is essentially a pirate colony simulator, but that isn't important for the purposes of this article. What matters is that David and I are working together on this project, and we ran into trouble. More on that later!

#### Google Summer of Code 2025

This year I was kindly asked if I'd be a co-mentor on [a GSoC project](https://medium.com/business4s-blog/gsoc-2025-building-a-web-ui-for-workflows4s-with-scala-js-and-tyrian-cf4b482dbf63), because the plan was to build a Web UI using Tyrian.