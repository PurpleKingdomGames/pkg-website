---
title: Deriving the Elm Architechure
author: Dave Smith
authorURL: http://twitter.com/davidjamessmith
authorTwitter: davidjamessmith
authorImageURL: /img/davesmith00000.png
---

Indigo and Tyrian are both built on top of flavours of the Elm architecture; But why that architecture pattern, and how does it work?

In this post, we start with our desired first principles of a framework designed for programming a Graphical User Interface (GUI), and watch the Elm architecture's API inevitably emerge.

<!--truncate-->

## Background

The Elm Architecture, affectionately called the TEA pattern, is the architectural pattern borne out of the Elm programming language.

Elm, in combination with the official architecture, is opinionated to the extent that it tends to polarise opinions. In my view, whether you love Elm the language or not, the architecture itself is the best GUI architecture pattern anyone has come up with so far.

Let's dig in to how it comes about.

## First Principles: How do _I_ want to program GUIs?

This is a question that I feel not enough people ask themselves, or perhaps are not in a position to ask. It's very easy to jump on the bandwagon of the latest popular framework when _employment_ is a concern, but what if it wasn't? What would an _ideal_ way to build WebApps look like for you, personally? What do you value?

My answer to that question is this:

> I desire to build GUI applications out of pure, referentially transparent functions operating on immutable data, with a unidirectional data flow, where data and presentation are strictly separate concerns.

Why do I want this? Well, I want..

- ..to be able to scale the program by simple function composition
- ..to be able to test the code easily
- ..to be able to comfortably reason about the application's lifecycle, so that I know what is going on.

The Elm architecture ticks all of those boxes, but as with all things, there is a tradeoff. The drawbacks as I see them, are as follows:

1. Effects with lifecycles being harder to manage. (e.g. Cancellations)
2. In complex cases, rendering performance will be slower that other solutions.

The rationale for those drawbacks being acceptable is a question of what you value; I frame it in terms of what abstraction level you prefer to work at. Do you value absolute control with maximum performance and accept increased general complexity, or do you value developer productivity more and are happy to sacrifice some performance to get it?

I value the latter more than the former, specifically answering the points above:

1. I believe that managing effect life cycles is less common on the frontend than the backend. So I'll take a simpler application lifecycle in the general case, and accept doing some extra work when I really need it.
2. I highly value presentation being utterly divorced from application state, and I do not want to manage a node tree where I must add and remove child nodes and so on. All I want to do is have a function that takes the model / state and converts it into something that can be rendered, and for that, I'm willing to accept a slight performance loss. _That is, as long as under normal usage the performance loss is not noticable._

## Arriving at the Elm architecture, based on need

We'll loosely base all examples here on Tyrian-esque web apps, because Tyrian is closer to the cannonical TEA pattern than Indigo is for reasons beyond the scope of this post.

That said, this is a general purpose pattern and can apply to any sort of graphical application, be it for example web, games, or mobile apps.

We'll going to build up the architecure based on our _needs_:

1. The need to draw something onto the screen
2. The need to performing the draw based on values that could change
3. The need to be able to update those values
4. The need to be able to trigger updates based on interactions / user input
5. The need to interact with the outside world, e.g. networking and IO.
6. The need to listen to things happening outside our application, e.g. browser events

### Need 1: To draw something

Let's draw HTML with a function:

```scala
object App:

  def view: Html = 
    div(p("Count: 1"))
```

This is a function, despite the lack of arguments. Think of it as a thunk: `() => Html`

### Need 2: Remove the hardcoded values

We'd like to move that `1` out of there so that it isn't hardcoded, and for that we'll need a model (in reasuringly familiar MVC parlance). Here is the model:

```scala
final case class Model(count: Int)
```

We'll need to initialise the model somewhere, and because we want pure functions, we'll also need to give it to the view function.

```scala
object App extends TyrianIOApp:

  def init: Model =
    Model(1)

  def view(model: Model): Html = 
    div(p(s"Count: ${model.count}"))
```

So now we have two functions:

- `init` which is `() => Model`
- `view`, which is `Model => Html`

Notice that I've included `TyrianIOApp`. This is the runtime of our application, don't worry about it, it's just the thing that calls these pure functions at the right times. In this case, all it would need to do is `view(init)`.

I've used the real `TyrianIOApp` term to hopefully avoid confusion. Indigo uses other terms like `IndigoGame`, and don't forget that Tyrian also supports ZIO with `TyrianZIOApp`.

### Need 3: Updating the model

The static number in our model isn't much use unless we can update it somehow. We need another function that knows how to do that, i.e. `Model => Model`

```scala
object App extends TyrianIOApp:

  def init: Model =
    Model(1)

  def update(model: Model): Model =
    model

  def view(model: Model): Html = 
    div(p(s"Count: ${model.count}"))

final case class Model(count: Int)
```

Hmmm. That's not quite good enough is it? On what basis are we doing the update and when? We need some sort of 'message' to tell the update function to do some work. Let's go with this:

```scala
enum Msg:
  case Increment, Decrement
```

Which gives us a function `Model => Msg => Model`, like so:

```scala
object App extends TyrianIOApp:

  def init: Model =
    Model(1)

  def update(model: Model): Msg => Model =
    case Msg.Increment =>
      model.copy(count = model.count + 1)

    case Msg.Decrement =>
      model.copy(count = model.count - 1)

  def view(model: Model): Html = 
    div(p(s"Count: ${model.count}"))

final case class Model(count: Int)

enum Msg:
  case Increment, Decrement
```

### Need 4: Triggering an update

These potential updates are all well and good, but something has to trigger them, right? How about a couple of buttons? We'll need to improve our `Html` type a bit, to `Html[Msg]` but then we can have a view function like this:

```scala
  def view(model: Model): Html[Msg] = 
    div(
      button(onClick(Msg.Decrement))("-"),
      div(p(s"Count: ${model.count}")),
      button(onClick(Msg.Increment))("+")
    )
```

And now, through the magical machinations of the `TyrianIOApp` runtime, when someone clicks a button, a `Msg` is generated that gets fed into the update function, which changes the model, and the model gets fed into the view which renders it.

### So.. are we done?

Looks pretty good so far! All our functions are pure and based on immutable data, and it works too! By simply doing the next obvious thing to our application API, we've managed to:

1. Initialise a model
2. Render it
3. Accept user input
4. Update the model
5. Re-render

Note how deterministic and testible all this is, too.

- Want to test a model update? Call `update` with a known model and message, and you should always get the same result.
- Want to test the rendering? Give `view` a known model and you should get the same HTML representation every time.

Our API is still nice and simple, and covers the requirements for a basic GUI app doesn't it? What else is there?

> Note that this section is true for Tyrian, but is where Indigo begins to deviate from the traditional Elm architecture. This section is still worth understanding, but if you're specifically interested in Indigo, don't be surprised when you don't see this there.

### Need 5: Side effects

Unfortunately our elegant little architecture won't be enough for anything beyond trivial applications. In the real world of web apps and GUIs, you need to be able to perform 'side effects'.

Side effects are anything that breaks out of your nice comfortable application loop and interacts with the outside world in some way. Examples include such activities as writing logs, making HTTP calls, calling JavaScript, and saving data to local storage.

Ok, first question: _When_ are we going to want to do side effects? Instinctively you'd probably say "for example, when someone presses a button" or "as a result of some calculation".

In our current set up, pressing a button produces a `Msg`, so maybe we could generalise that to "after we process a message"?

There is one other time you might want to perform a side effect too, which is on application start up. Perhaps you need to call a web service to load some data to populate the home page of your app. You don't want to wait for a user interaction, you just want to do it immediately.

So if fact, we'd like to be able to run a side effect _whenever we produce a model_.

#### Cmd (Command)

Side effects are encoded into 'Commands' (Cmd). There are a range of predefined `Cmd`'s, but what they do is wrap up a side effect that produces some result (or not), in the form of some effectful monad (in Tyrian, that's `IO` or `ZIO`).

Here are a few examples:

- `Cmd.None` - Is our identity command that does nothing
- `Cmd.Emit(msg)` - Simply produces another `Msg` in order to trigger another update
- `Cmd.SideEffect(...)` - Is typically used for fire-and-forget actions
- `Cmd.Run(task, toMessage)` - Run's an effect and turns the result into a `Msg`.

There are specialised `Cmd`s, like `Logger` and `Http`, but if we wanted to make one that just prints to the console, we could simply do this:

`Cmd.SideEffect(println("Hello, World!"))`

There are also `Cmd`'s for combining `Cmd`s, like `Cmd.Combine` and `Cmd.Batch`.

#### Adding Cmds to our architecture

Taking the `init` function as an example, we currently have this:

```scala
  def init: Model =
    Model(1)
```

But now we want to produce a `Model`, and a `Cmd`, which we can do as follows:

```scala
  def init: (Model, Cmd[IO, Msg]) =
    (Model(1), Cmd.None)
```

Easy enough, let's do the same thing with update, and print the count to the console when it changes:

```scala
object App extends TyrianIOApp:

  def init: (Model, Cmd[IO, Msg]) =
    (Model(1), Cmd.None)

  def update(model: Model): Msg => (Model, Cmd[IO, Msg]) =
    case Msg.Increment =>
      val cmd = Cmd.SideEffect(println(s"Count: ${model.count}"))
      (model.copy(count = model.count + 1), cmd)

    case Msg.Decrement =>
      val cmd = Cmd.SideEffect(println(s"Count: ${model.count}"))
      (model.copy(count = model.count - 1), cmd)

  def view(model: Model): Html[Msg] = 
    div(
      button(onClick(Msg.Decrement))("-"),
      div(p(s"Count: ${model.count}")),
      button(onClick(Msg.Increment))("+")
    )

final case class Model(count: Int)

enum Msg:
  case Increment, Decrement
```

### Need 6: Listening for other inputs

`Cmd`'s allow our architecture to trigger events that make things happen, but if you were paying attention, you may have noticed that those sorts of effects are _always_ going to originate from a user interaction. Pressing a button, typing some text, dragging a slider and so on, can all trigger `Cmd`s, but what if you want to respond to non-user input and events?

What if you'd like to 'subscribe' to WebSocket events? What if you need a regular timer for running animation frames? What if the browser location changes and you need to show a different page?

'Subscribe' was the key word there, and we create subscriptions by providing a way to register `Sub`s.

As with `Cmd`s, there are a range of built-in `Sub` types, but a simple example might be `Sub.fromEvent(eventName, eventTarget)(toMessage)`, which is used to listen for browser events. When an event is collected, it is converted into a `Msg` and passed to our `update` function as usual.

Let's add this final requirement to our API, and our example:

```scala
object App extends TyrianIOApp:

  def init: (Model, Cmd[IO, Msg]) =
    (Model(1), Cmd.None)

  def update(model: Model): Msg => (Model, Cmd[IO, Msg]) =
    case Msg.Increment =>
      val cmd = Cmd.SideEffect(println(s"Count: ${model.count}"))
      (model.copy(count = model.count + 1), cmd)

    case Msg.Decrement =>
      val cmd = Cmd.SideEffect(println(s"Count: ${model.count}"))
      (model.copy(count = model.count - 1), cmd)

  def view(model: Model): Html[Msg] = 
    div(
      button(onClick(Msg.Decrement))("-"),
      div(p(s"Count: ${model.count}")),
      button(onClick(Msg.Increment))("+")
    )

  def subscriptions(model: Model): Sub[IO, Msg] =
    Sub.None

final case class Model(count: Int)

enum Msg:
  case Increment, Decrement
```

## Turning it into a real Tyrian app

What we have created is a hypothetical app based on the principles of the Elm architecture. How far from a real, working web app is it?

Pretty close! Here is the real version, which you can try for yourself if you head over to [scribble.ninja](https://scribble.ninja/).

```scala
package example

import cats.effect.IO
import tyrian.Html.*
import tyrian.*

import scala.scalajs.js.annotation.*

@JSExportTopLevel("TyrianApp")
object App extends TyrianIOApp[Msg, Model]:

  def router: tyrian.Location => Msg =
    Routing.none(Msg.NoOp)

  def init(flags: Map[String, String]): (Model, Cmd[IO, Msg]) =
    (Model(1), Cmd.None)

  def update(model: Model): Msg => (Model, Cmd[IO, Msg]) =
    case Msg.Increment =>
      val cmd: Cmd[IO, Msg] = Cmd.SideEffect(println(s"Count: ${model.count}"))
      (model.copy(count = model.count + 1), cmd)

    case Msg.Decrement =>
      val cmd: Cmd[IO, Msg] = Cmd.SideEffect(println(s"Count: ${model.count}"))
      (model.copy(count = model.count - 1), cmd)

    case Msg.NoOp =>
      (model, Cmd.None)

  def view(model: Model): Html[Msg] = 
    div(
      button(onClick(Msg.Decrement))("-"),
      div(p(s"Count: ${model.count}")),
      button(onClick(Msg.Increment))("+")
    )

  def subscriptions(model: Model): Sub[IO, Msg] =
    Sub.None

final case class Model(count: Int)

enum Msg:
  case Increment, Decrement, NoOp
```

## Summary

From our basic need of wanting to design a GUI API architecture that runs on pure functions and immutable data, we have built up a set of functions that have resulted in the Elm Architecture.

We haven't talked about how the runtime actually invoked these functions, though it isn't terribly complicated, nor have we discussed how the HTML represention is actually rendered to the browser by the VirtualDOM, or the implications of that.

We have shown the clean and elegant nature of the Elm architecture though. The next challenge, is scaling it.
