---
title: Deriving the Elm Architecture
author: Dave Smith
authorURL: http://twitter.com/davidjamessmith
authorTwitter: davidjamessmith
authorImageURL: /img/davesmith00000.png
---

Indigo and Tyrian are both based on flavours of the Elm architecture; But why that architecture pattern, and how does it work?

In this post, we define some desired principles of how we'd like to program a Graphical User Interface (GUI), and watch the Elm architecture's API inevitably emerge.

<!--truncate-->

## Background

The Elm Architecture, affectionately called the TEA pattern, is the architectural pattern borne out of the Elm programming language.

Elm tends to polarise opinions, but in my view, whether you love Elm-the-language or not, the architecture itself is the best GUI architecture pattern anyone has come up with so far.

Let's dig in to how it comes about.

## First Principles: How do _I_ want to program GUIs?

This is a question that I feel not enough people ask themselves, or perhaps are not in a position to ask. It's very easy to jump on the bandwagon of the latest popular framework when _employment_ is a concern, but what if it wasn't? What would an _ideal_ way to build WebApps look like for you, personally? What do you value?

Selfishly, my answer to that question is this:

> I want to build GUI applications out of pure, referentially transparent functions operating on immutable data and static types. Where data and presentation are strictly separate concerns, and events all flow in one direction.

The hope is that this will allow the program the scale by simple function composition, and allow the compiler / typechecker to provide a lot of mechnical assistance to aid correctness. It should also make testing, and our ability to reason about the program, fairly straight-forward.

The Elm architecture ticks all of those boxes, but as with all things, there are tradeoffs. The drawbacks as I see them, are as follows:

1. Explicitly managing the lifecycle of effects is more difficult. (e.g. Cancellations)
2. In complex cases, rendering performance will be slower than other solutions.

The rationale for those drawbacks being acceptable comes back to the question of "what do you value?" Do you value absolute control with maximum performance, and accept increased general complexity; Or do you value developer productivity, and are happy to sacrifice some application performance to get it?

I value developer productivity and programming enjoyment, specifically answering the points above:

1. I believe that managing effect life cycles is less common on the frontend (apps / games) than the backend (services). So I'll happily take a simpler application lifecycle in the general case, and accept doing a little extra work when I really need it.
2. I highly value presentation being utterly divorced from application state, and I do not want to manage a node tree where I must add and remove child nodes and so on. All I want to do is have a function that takes the model / state and converts/maps it into something that can be rendered, and for that, I'm willing to accept some performance loss in scenarios not considered "normal" use.

## Arriving at the Elm architecture, based on need

We'll loosely base all examples here on Tyrian-esque web apps, because Tyrian is closer to the canonical TEA pattern than Indigo is, for reasons beyond the scope of this post.

That said, this is a general purpose pattern and can apply to any sort of graphical application.

We're going to build up the architecture's APIs from scratch, based on the basic _needs_ of any GUI application:

1. The need to present something onto the screen
2. The need to base our presentation on data
3. The need to be able to update our data
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

We'd like to move that "1" out of there so that it isn't hardcoded, and for that we'll need a model (in reassuringly familiar MVC parlance). Here is the model:

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

These 'potential' updates are all well and good, but something has to trigger them, right? How about a couple of buttons? We'll need to improve our `Html` type a bit, to `Html[Msg]` but then we can have a view function like this:

```scala
  def view(model: Model): Html[Msg] = 
    div(
      button(onClick(Msg.Decrement))("-"),
      div(p(s"Count: ${model.count}")),
      button(onClick(Msg.Increment))("+")
    )
```

And now, through the magical machinations of the `TyrianIOApp` runtime, when someone clicks a button, a `Msg` is generated that gets fed into the update function, which changes the model, and the model gets fed into the view which renders it.

### Let's review

Looks pretty good so far! All our functions are pure and based on immutable data, and it works too! By simply doing the next obvious thing to our application API, we've managed to:

1. Initialise a model
2. Render it
3. Accept user input
4. Update the model
5. Re-render

Note how deterministic, decoupled, and testable all this is, too!

- Want to test a model update? Call `update` with a known model and message, and you should always get the same result.
- Want to test the rendering? Give `view` a known model and you should get the same HTML representation every time.
- Events/messages always and only ever go from the view, back around to the update function.

Our API is still nice and simple, and at first glance, seems to cover all the requirements for a basic GUI app. A calculator, perhaps, or a simple game.

> Note that everything up to this point is true for Tyrian and Indigo, but this is where Indigo begins to deviate from the traditional Elm architecture. The up-coming concepts are still worth understanding even if you're more interested in Indigo than Tyrian.

### Need 5: Side effects

Unfortunately our elegant little architecture won't be enough for anything beyond simple applications.

In the real world of web apps and GUIs, you usually need to be able to perform 'side effects' in order to do more meaningful work.

Side effects are anything that breaks out of your nice comfortable application loop and interacts with the outside world in some way. Examples include such activities as writing logs, making HTTP requests, calling JavaScript, and saving data to local storage.

Ok, first question: _When_ are we going to want to do side effects? Instinctively you'd probably say something like "when someone presses a button" or "as a result of some calculation".

In our current setup, pressing a button produces a `Msg`, so maybe we could generalise that to "after we process a message"?

...but there is one other time you might want to perform a side effect too, which is on application startup. Perhaps you need to call a web service to load some data to populate the homepage of your app. You don't want to wait for a user interaction, you want to do it immediately.

So in fact, we'd like to be able to run a side effect _whenever we produce a model_.

#### Cmd (Command)

Side effects are encoded into 'Commands' (`Cmd`). There are a range of predefined `Cmd`'s, but what they do is wrap up a side effect that produces some result (or not), in the form of some effectful monad (in Tyrian, that's `IO` or `ZIO`).

Here are a few examples:

- `Cmd.None` - Is an identity command that does nothing.
- `Cmd.Emit(msg)` - Simply produces another `Msg` in order to trigger another update.
- `Cmd.SideEffect(...)` - Is typically used for fire-and-forget actions.
- `Cmd.Run(task, toMessage)` - Runs an effect and turns the result into a `Msg`.

If we wanted to make a command that just prints to the console, we could simply do this:

`Cmd.SideEffect(println("Hello, World!"))`

There are also `Cmd`'s for combining `Cmd`s, like `Cmd.Combine` and `Cmd.Batch`.

#### Adding Cmds to our architecture

Taking the `init` function as an example, we currently have this:

```scala
  def init: Model =
    Model(1)
```

But now we want to produce a `Model`, and a `Cmd`, which we can do by returning a tuple:

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

As with `Cmd`s, there are a range of built-in `Sub` types, but a simple example might be `Sub.fromEvent(eventName, eventTarget)(toMessage)`, which is used to listen for browser events. When an event is collected, it is converted into a `Msg` and passed to our `update` function, as usual.

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

In this example, I've added the final part of the API, `subscriptions`, but in this case we aren't listening to anything.

## Turning it into a real Tyrian app

What we have created is a hypothetical app based on the principles of the Elm architecture. How far from a real, working web app is it?

Pretty close! Here is the real version, which you can try for yourself if you head over to [scribble.ninja](https://scribble.ninja/) and paste it into the editor.

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

All GUI applications follow the same basic principles. Elm may be relatively new, but you can look right back to the MVC pattern and find the same needs being met:

You need to accept input from the user and the world, you need to convert the input into model/state updates, you need to render the model into a view, and you need to be able to subsequently affect the outside world and feedback into the loop.

All GUI design patterns / architectures work like this, but they differ in the details and the focus / importance they place on the different relationships between the core pillars of the Model, View, and Controller, and the exact forms those things take.

As a thought exercise: Consider how these things manifest in the API's of other popular frontend solutions you may be familiar with. What are the implications of a more tightly coupled view and state? What kind of apps are possible with a weaker / strong notion of the controller? What happens to rendering and testing, when you start using reactive values / data-binding? None of these considerations are right or wrong, but they all represent trade-offs that will affect your experience and enjoyment when developing in these frameworks.

In technical terms, the Elm architecture emphasises the importance of decoupling the state, from the presentation, from the update lifecycle. It's elegant use of pure functions, immutable data, and unidirectional event flows produce an architecture pattern that, in terms of being able to reason about and test your application, I think is hard to beat. More than that, on a human level, I think it potentially offers the most pleasant and enjoyable way to build complex GUI applications.

The next conceptual challenge is how to scale it.
