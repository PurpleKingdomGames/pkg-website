# Post-mortem: The Trouble with the Elm Architecture

We've made dozens of joyful little game demos and small applications using our Elm inspired libraries, but we keep getting into trouble when we attempt anything larger.

Big projects all start well, but after a while the code becomes less and less fun to work on. It starts getting difficult to add new features, even to understand what's happening in the program, this despite Elm's claim to make programs easier to reason about. What is going on?

In this write-up we're going to look at how Elm and the Elm architecture subtly encourage you to write programs that don't scale, and what we can do about that now that we're aware of it.

## Context

### Credentials and a word on Elm

I have been building two libraries - a web framework and a game engine - that are based on the Elm architecture for nearly a decade, as well as countless demos and projects.

I like to think I know a bit about the Elm architecture, but nonetheless, what follows here is just an opinion, based on the time I've spent with my favorite frontend architecture pattern.

Before I go any further, I'd like to make it clear that this post is not a criticism of Elm or the Elm architecture. In fact I haven't used Elm in anger for a long time, and it's possible it has moved on in the meantime. It is my view that there is no perfect frontend architecture out there - and I've looked.. - only a choice of trade-offs, values, and priorities.

In my view, and for my priorities and the kind of projects I build, The Elm Architecture (AKA the TEA pattern) is still the best frontend pattern available today. It isn't perfect, and I'm going to talk about how the not-perfect has affected us in this post-mortem, but I still wouldn't use anything else.

### Libraries & Projects

#### Elm

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

## Overview

It all started with a roguelike
Going well, pleased.
Refactored.
Pain.
Moved on for other reasons.

Pirate game.
Starts well.
Oh crap, this feels familiar.

Joined GSoC as a mentor.
Looking at someone else's code objectively.
Ah, I see.



### Impact

The most clear impact is that in both of the cases where we've written a substantial application, we've basically had to tear it down and start again.

## Root Cause(s)

Scaling Elm - It's just function composition! Scales perfectly in maths, less so in humans.

tuple return types are a PITA.

In order view construction

Msg's as an ADT

One big Model.

## Lessons Learned

A case where modularity has been working shockingly well for years: Scenes.


## Future direction

Elm development has slowed, feels like they've reached the natural conclusion of what can be done with the arch, lang, principles. We're using Scala and don't have the principles, so we can carry on.

Compare Elm with a tree of stateful nodes

