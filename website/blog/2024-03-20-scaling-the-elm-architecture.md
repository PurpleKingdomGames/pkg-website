---
title: Scaling the Elm architecture
author: Dave Smith
authorURL: http://twitter.com/davidjamessmith
authorTwitter: davidjamessmith
authorImageURL: /img/davesmith00000.png
---

In our last post, [Deriving the Elm Architecture](2024-03-05-deriving-the-elm-architecture.md), we introduced The Elm Arcitecture (or TEA pattern) by building it up from scratch based on a set of principles and needs.

The most common question that comes up next, once people have got to grips with a basic app in this style, is: "How do I build components?"

Components is a word with many meanings, but most people either mean:

1. "Web components", which are predefined components from a third party library designed to help you make pretty forms and effects quickly with minimal styling. For example, [Material UI](https://m3.material.io/).

2. A _reusable_ chunk of code that encapsulate the state, behaviour and presentation of some, typically interactive, element. For example, a button, a bullet, or a bolshy baboon.

In this post we'll be exploring at that second point by looking into how we can organise our code when scaling up the Elm architecture.

<!--truncate-->

## The Scaling Problem

### Setting the scene

Recall from [our last post](2024-03-05-deriving-the-elm-architecture.md), that the Elm architecture is built from a blob of state, and few pure functions.

At the end of the post, we had those functions defined in our psuedo-Tyrian style as follows:

```scala
// The init[ialisation] function that creates our model and optionally runs a side-effect.
def init: (Model, Cmd[IO, Msg]) = ???

// The update function, which takes a model and a message, and makes a new model (and maybe side effect) based on them.
def update(model: Model): Msg => (Model, Cmd[IO, Msg]) = ???

// The view function, which converts our model into, in this case, HTML to present to our user.
def view(model: Model): Html[Msg] = ???

// The subscriptions function, used to listen to events from outside our application.
def subscriptions(model: Model): Sub[IO, Msg] = ???
```

Let's simplify that for our purposes today, by removing all the machinery to do with side effects. The principals discussed here still apply, but it cuts down the noise. Here are our new functions:

```scala
// The init[ialisation] function that creates our model.
def init: Model = ???

// The update function, which takes a model and a message, and makes a new model.
def update(model: Model): Msg => Model = ???

// The view function, which converts our model into, in this case, HTML to present to our user.
def view(model: Model): Html[Msg] = ???
```

That's better. With these few functions we can create a `Model`, update it, render it, and respond to user interations like button clicks, which produce `Msg`s.

### The Counter App

The canonical Elm arch application is a 'Counter'. A number rendered as text, and two buttons that increment and decrement that number when the user clicks on them. Here it is in psuedo-Tyrian-scala using the functions previously defined.

```scala
object App extends TyrianIOApp:

  def init: Model =
    Model(0)

  def update(model: Model): Msg => Model =
    case Msg.Increment =>
      model.copy(count = model.count + 1)

    case Msg.Decrement =>
      model.copy(count = model.count - 1)

  def view(model: Model): Html = 
    div(
      button(onClick(Msg.Decrement))("-"),
      div(p(s"Count: ${model.count}")),
      button(onClick(Msg.Increment))("+")
    )

final case class Model(count: Int)

enum Msg:
  case Increment, Decrement
```

Let's walk through it:

- There is a `Model` with a `count` in it that is an `Int`
- We've defined a `Msg` which is an enum/ADT of events to tell our app to increment or derement the number.
- The model is initialised to `0`.
- The model is rendered as a minus button, then the count, followed by a plus button.
- When either button is clicked, they fire one of the `Msg`s.
- That triggers `update` when the `Msg` is used to alter the model accordingly.
- The new model is re-rendered.

### Five Counters

// TODO. Same app but with the functions naively scaled up.

```scala
object App extends TyrianIOApp:

  def init: Model =
    Model(
      List(
        Counter(0, 0),
        Counter(1, 0),
        Counter(2, 0),
        Counter(3, 0),
        Counter(4, 0)
      )
    )

  def update(model: Model): Msg => Model =
    case Msg.Increment(id) =>
      model.copy(
        counters = model.counters.map { c =>
          if c.id == id then c.copy(count = c.count + 1)
        }
      )

    case Msg.Decrement(id) =>
      model.copy(
        counters = model.counters.map { c =>
          if c.id == id then c.copy(count = c.count - 1)
        }
      )

  def view(model: Model): Html = 
    div(
      model.counters { c =>
        button(onClick(Msg.Decrement(c.id)))("-"),
        div(p(s"Count: ${c.count}")),
        button(onClick(Msg.Increment(c.id)))("+")
      }
    )

final case class Model(counters: List[Counter])

final case class Counter(id: Int, count: Int)

enum Msg:
  case Increment(id: Int), Decrement(id: Int)
```
