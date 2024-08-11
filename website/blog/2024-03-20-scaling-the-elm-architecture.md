---
title: Scaling the Elm architecture
author: Dave Smith
authorURL: http://twitter.com/davidjamessmith
authorTwitter: davidjamessmith
authorImageURL: /img/davesmith00000.png
---

In our last post, [Deriving the Elm Architecture](2024-03-05-deriving-the-elm-architecture.md), we introduced The Elm Arcitecture (or TEA pattern) by building it up from scratch based on a set of principles and needs.

Once people have got to grips with building basic apps using this architechural pattern, the next question that comes up is "How do I scale it?", often disgusied as "How do I build components?"

In this post we'll look at scaling the Elm architexture using a few notions of a component, which in our case is really just another, smaller Elm app, mechnically wired into it's parent.

<!--truncate-->

## The Scaling Problem

### Setting the scene

Recall from [our last post](2024-03-05-deriving-the-elm-architecture.md), that the Elm architecture is built from a blob of state, and few pure functions.

At the end of the post, we had those functions defined in our psuedo-Tyrian style as follows:

```scala
// The init[ialisation] function that creates our model and optionally runs a side-effect.
def init: (Model, Cmd[IO, Msg]) = ???

// The update function, which takes a model and a message, and makes a new model (and maybe performs a side effect) based on them.
def update(model: Model): Msg => (Model, Cmd[IO, Msg]) = ???

// The view function, which converts our model into HTML to present to our user.
def view(model: Model): Html[Msg] = ???

// The subscriptions function, used to listen to events from outside our application.
def subscriptions(model: Model): Sub[IO, Msg] = ???
```

For the purposes of this post, let's simplify that by removing all the machinery to do with side effects. The principals discussed here still apply, but it cuts down the noise. Here are our new functions:

```scala
// The init function that creates our model.
def init: Model = ???

// The update function, which takes a model and a message, and makes a new model.
def update(model: Model): Msg => Model = ???

// The view function, which converts our model into HTML to present to our user.
def view(model: Model): Html[Msg] = ???
```

That's better. With these few functions we can create a `Model`, update it, render it, and respond to user interations like button clicks, which produce `Msg`s.

### The Counter App

Despite having removed all the side effecting facilities from our code, it is still complete enough to build simple self-contained applications.

The canonical Elm architecture example application is a 'Counter'. A number rendered as text, and two buttons that increment and decrement that number when the user clicks on them.

Here it is in psuedo-Tyrian-Scala using the functions previously defined.

```scala
object App extends TyrianLikeApp:

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

- There is a `Model` with a `count` in it that is an `Int`, holding the current count.
- We've defined a `Msg` which is an enum/ADT of events to tell our app to increment or derement the number.
- The model is initialised to `0`.
- The model is rendered as a minus button, then the count, followed by a plus button.
- When either button is clicked, they fire one of the `Msg`s.
- That triggers `update` when the `Msg` is used to alter the model accordingly.
- The new model is re-rendered.
- `TyrianLikeApp` is a made up runtime that theorectically brings all this together into a working application.

So far so good.

### Many Counters

What if we wanted more than one counter? How could we model that?

#### A Terrible First Attempt

Perhaps our first attempt would be to update our Model to using a `List[Int]` to model many counters:

```scala
final case class Model(counters: List[Int])
```

Unfortunately this isn't enough, because we're going to need to know which counter value to update, in other words, did someone increment the 3rd or the 4th counter? This gives us something like this:

```scala
final case class Counter(id: Int, count: Int)

final case class Model(counters: List[Counter])
```

Let's see a full psuedo-implementation with a fixed number of five counters:

```scala
object App extends TyrianLikeApp:

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
          else c
        }
      )

    case Msg.Decrement(id) =>
      model.copy(
        counters = model.counters.map { c =>
          if c.id == id then c.copy(count = c.count - 1)
          else c
        }
      )

  def view(model: Model): Html = 
    div(
      model.counters { c =>
        div(
          button(onClick(Msg.Decrement(c.id)))("-"),
          div(p(s"Count: ${c.count}")),
          button(onClick(Msg.Increment(c.id)))("+")
        )
      }
    )

final case class Model(counters: List[Counter])

final case class Counter(id: Int, count: Int)

enum Msg:
  case Increment(id: Int)
  case Decrement(id: Int)
```

This looks kind of ok, let us add some logic so that we can add and remove counters.

```scala
object App extends TyrianLikeApp:

  def init: Model =
    Model(
      counters = List(
        Counter(0, 0),
        Counter(1, 0),
        Counter(2, 0),
        Counter(3, 0),
        Counter(4, 0)
      ),
      counterCount = 5
    )

  def update(model: Model): Msg => Model =
    case Msg.Add =>
      model.copy(
        counters = Counter(model.counterCount, 0) :: model.counters,
        counterCount = model.counterCount + 1
      )

    case Msg.Remove =>
      model.copy(counters = model.counters.drop(1))

    case Msg.Increment(id) =>
      model.copy(
        counters = model.counters.map { c =>
          if c.id == id then c.copy(count = c.count + 1)
          else c
        }
      )

    case Msg.Decrement(id) =>
      model.copy(
        counters = model.counters.map { c =>
          if c.id == id then c.copy(count = c.count - 1)
          else c
        }
      )

  def view(model: Model): Html = 
    div(
      List(
        button(onClick(Msg.Add))("Add"),
        button(onClick(Msg.Remove))("Remove")
      ) ++
        model.counters { c =>
          div(
            button(onClick(Msg.Decrement(c.id)))("-"),
            div(p(s"Count: ${c.count}")),
            button(onClick(Msg.Increment(c.id)))("+")
          )
        }
    )

final case class Model(counters: List[Counter], counterCount: Int)

final case class Counter(id: Int, count: Int)

enum Msg:
  case Increment(id: Int)
  case Decrement(id: Int)
  case Add
  case Remove
```

To make this work, we've introduced a way to make new counter id's (alternatively, we could use a UUID or something), and some new events that add and remove the counter at the head of the list.

This too, looks like it's going to work... but notice that it's starting to _feel_ a little complicated. Why is that?

The problem is that even in this toy example, we're slowly losing "local reasoning", i.e. it's getting harder and hard to understand each piece of the application. Our main application logic is muddled into our counter logic, and we need to perform increasing amounts of mental gymnastics to follow the lifecycle of our application.

Another way to think of this is that we're simply making each of our original functions bigger with every new feature we add, and literally moving the details that make up each process apart 'spatially' in our code.

Possibly worse, everything is flat. Adding new features, state, and message types means updating everything.

This is not sustainable, so what do we do?

## Intervention: Home Truths and Trade-Offs

The Elm architecture _is_ one blob of central state, and a few pure functions that initialise, modify, and present that state.

This bring some benefits and some challenges when compared to other frontend architectural styles where the state is distributed:

Pros:

- Trivial model serialisation e.g. for hot-reloading or saving game state.
- Pure functions for easy testing.
- _Potentially_ exhaustive checking of `Msg`s and better correctness.

Cons:

- No baked-in notion of self contained 'component' objects with isolated local state.
- Adding a new component means updating the global state and global `Msg` types, to some extent.

We cannot fully get away from those facts of life, so our goal is to final design patterns that keep the good, and minimise the pain of the bad.

## The Notion of a Component

Before we can solve our scaling problem with components, we need to talk about what components actually are. You may think you already know, but beware! Components in the Elm architecture aren't quite like the components you've likely seen elsewhere.

When people use the term 'component', what they really mean is "a self contained lump of state with modification and presentation logic." However, we cannot divide up our state and spread it across the application, so this notion of components is out.

Let's think about our `Counter` type again, here it is:

```scala
final case class Counter(id: Int, count: Int)
```

A tradiational OO-esque mutable component version of that might look like this:

```scala
final case class Counter(id: Int, var count: Int):
  def setCount(newCount: Int): Unit =
    count = newCount
  def increment: Unit =
    setCount(count + 1)
  def decrement: Unit =
    setCount(count - 1)

  def getCount: Int =
    count

  def view: Html[Msg] =
    div(
      button(onClick(Msg.Decrement(id)))("-"),
      div(p(s"Count: ${count}")),
      button(onClick(Msg.Increment(id)))("+")
    )
```

The present function looks promising as it's just a pure function. It has to send that ID along with its messages because the rendered HTML won't be able to access the component's state. Arguably this is contrived, perhaps in JavaScript we'd have set up a listener and supplied an object reference or something, but this will do for illustrative purposes.

The getters and setters imply that this is in some sort of mutable array, and that all of the logic still lives outside the component. All we've really done is encapsulate the state with some modifier methods.

We have managed to keep the state and the view together though, so that's an improvement, but we can do better!

First up some low hanging fruit: It should be immutable.

```scala
final case class Counter(id: Int, count: Int):
  def setCount(newCount: Int): Counter =
    this.copy(count = newCount)
  def increment: Counter =
    setCount(count + 1)
  def decrement: Counter =
    setCount(count - 1)

  def getCount: Int =
    count

  def view: Html[Msg] =
    div(
      button(onClick(Msg.Decrement(id)))("-"),
      div(p(s"Count: ${count}")),
      button(onClick(Msg.Increment(id)))("+")
    )
```

Next, let's make a mini-Elm architecture, just for the component, starting with the view function:

```scala
final case class Counter(id: Int, count: Int):
  def setCount(newCount: Int): Counter =
    this.copy(count = newCount)
  def increment: Counter =
    setCount(count + 1)
  def decrement: Counter =
    setCount(count - 1)

  def getCount: Int =
    count

object Counter:

  def view(model: Counter): Html[Msg] =
    div(
      button(onClick(Msg.Decrement(id)))("-"),
      div(p(s"Count: ${model.count}")),
      button(onClick(Msg.Increment(id)))("+")
    )
```

Then we could give it an `init` function:

```scala
final case class Counter(id: Int, count: Int):
  def setCount(newCount: Int): Counter =
    this.copy(count = newCount)
  def increment: Counter =
    setCount(count + 1)
  def decrement: Counter =
    setCount(count - 1)

  def getCount: Int =
    count

object Counter:

  def init(id: Int): Counter = 
    Counter(id, 0)

  def view(model: Counter): Html[Msg] =
    div(
      button(onClick(Msg.Decrement(id)))("-"),
      div(p(s"Count: ${model.count}")),
      button(onClick(Msg.Increment(id)))("+")
    )
```

Then we should delegate updates to it, too:

```scala
final case class Counter(id: Int, count: Int)

object Counter:

  def init(id: Int): Counter = 
    Counter(id, 0)

  def update(model: Counter): Msg => Counter =
    case Msg.Increment(id) if id == model.id =>
      model.copy(count = model.count + 1)

    case Msg.Decrement(id) if id == model.id =>
      model.copy(count = model.count - 1)

    case _ =>
      model

  def view(model: Counter): Html[Msg] =
    div(
      button(onClick(Msg.Decrement(id)))("-"),
      div(p(s"Count: ${model.count}")),
      button(onClick(Msg.Increment(id)))("+")
    )
```

This is much better. Now we have all the logic of the counter, it's state, and it's presentation all represented together without being muddled into the application details.

Unfortunately, we've had to include a nasty catch all of `case _ => model` on the update function. This is because of that `id` value that the application needs. Our component doesn't need it though... what if we just got rid of it?

```scala
final case class Counter(count: Int)

object Counter:

  enum Msg:
    case Increment, Decrement

  def init: Counter = 
    Counter(0)

  def update(model: Counter): Msg => Counter =
    case Msg.Increment =>
      model.copy(count = model.count + 1)

    case Msg.Decrement =>
      model.copy(count = model.count - 1)

  def view(model: Counter): Html[Msg] =
    div(
      button(onClick(Msg.Decrement))("-"),
      div(p(s"Count: ${model.count}")),
      button(onClick(Msg.Increment))("+")
    )
```

That's much cleaner, we're removed the ID fields and introduced a local `Msg` enum specifically for `Counter`s that don't take an ID ...but wait a minute! How is that going to work? Well in the case of counters specifically we can just rely on the order of the counters. This won't always work, of course, sometimes you need an ID.

By now you may be wondering what this looks like as part of our application code, let's update that now making use of the `Counter` previously defined.

```scala
object App extends TyrianLikeApp:

  def init: Model =
    Model(
      counters = List(
        Counter.init,
        Counter.init,
        Counter.init,
        Counter.init,
        Counter.init
      )
    )

  def update(model: Model): Msg => Model =
    case Msg.Add =>
      model.copy(
        counters = Counter.init :: model.counters
      )

    case Msg.Remove =>
      model.copy(counters = model.counters.drop(1))

    case Msg.Modify(id, msg) =>
      model.copy(
        counters = model.counters.zipWithIndex.map { case (c, i) =>
          if i == id then Counter.update(c)(msg)
          else c
        }
      )

  def view(model: Model): Html = 
    div(
      List(
        button(onClick(Msg.Add))("Add"),
        button(onClick(Msg.Remove))("Remove")
      ) ++
        model.counters.zipWithIndex { case (c, i) =>
          Counter.view(c).map(msg => Msg.Modify(i, msg))
        }
    )

final case class Model(counters: List[Counter])

enum Msg:
  case Modify(id: Int, msg: Counter.Msg)
  case Add
  case Remove
```

The main application is now only concerned with running with top level application, and delegating all counter level stuff to the counters. It still feels a little too involved though. After all, it still needs to know about adding, removing, and modifying the list of components. Lets try and encapsulate all of that in a new component and further clean up our app:

```scala
/** Our top level application, which hands off to the counter manager to manage itself. */
object App extends TyrianLikeApp:

  def init: Model =
    Model(CounterManager.init)

  def update(model: Model): Msg => Model =
    case Msg.UpdateCounterManager(msg) =>
      model.copy(counterManager = model.counterManager.update(msg))

  def view(model: Model): Html[Msg] = 
    model.counterManager.view

final case class Model(counterManager: CounterManager)

enum Msg:
  case UpdateCounterManager(msg: CounterManager.Msg)

/** Encapsulates the business of managing, updating and presenting a number of Counter instances. */
final case class CounterManager(counters: List[Counter]):
  // Note these helper methods that just delegate to the pure function
  // versions in the companion object. Not necessary, but it allow you to
  // call, e.g. `model.counterManager.view` instead of
  // `CounterManager.view(model.counterManager)`, which I think is nicer.
  def update(msg: CounterManager.Msg): CounterManager =
    e => CounterManager.update(this)(e)

  def view: Html[Msg] =
    CounterManager.view(this)

object CounterManager:

  enum Msg:
    case Modify(id: Int, msg: Counter.Msg)
    case Add
    case Remove

  val init: CounterManager =
    CounterManager(
      counters = List(
        Counter.init,
        Counter.init,
        Counter.init,
        Counter.init,
        Counter.init
      )
    )

  def update(model: CounterManager): Msg => CounterManager =
    case Msg.Add =>
      CounterManager.copy(
        counters = Counter.init :: model.counters
      )

    case Msg.Remove =>
      model.copy(counters = model.counters.drop(1))

    case Msg.Modify(id, msg) =>
      model.copy(
        counters = model.counters.zipWithIndex.map { case (c, i) =>
          if i == id then Counter.update(c)(msg)
          else c
        }
      )

  def view(model: CounterManager): Html = 
    div(
      List(
        button(onClick(Msg.Add))("Add"),
        button(onClick(Msg.Remove))("Remove")
      ) ++
        model.counters.zipWithIndex { case (c, i) =>
          Counter.view(c).map(msg => Msg.Modify(i, msg))
        }
    )

/** Encapsulates the business of updating and rendering a single counter. */
object Counter:

  opaque type Model = Int

  enum Msg:
    case Increment, Decrement

  def init: Model = 
    0

  def update(model: Model): Msg => Model =
    case Msg.Increment =>
      model + 1

    case Msg.Decrement =>
      model - 1

  def view(model: Model): Html[Msg] =
    div(
      button(onClick(Msg.Decrement))("-"),
      div(p(s"Count: ${model}")),
      button(onClick(Msg.Increment))("+")
    )
```

Our main application is now a mere dozen lines of code and everything else has been delegated. This still requires a bit of manual wiring, but each level is now pretty clean and tidy, is only concerned with it's own business logic, and is easier to locally reason about.

Critically, we have solved our original problem of the code feeling complex and unwieldy. All the same business logic is there, but it has been organised into local blocks and levels that are easy to think about and test on their own.

## ~Turtles~ Elm apps all the way down

The principle is to build Mini-Elm applications and combine them together mechnically.

The example above has the slightly bothersome requirement of ID's, which are needed to route messages from the view back to the next model update. This is a legitimate pattern, but it isn't always necessary.

Let's look at other formulations and examples of Elm-components. These case studies will come from Indigo (a game engine), which also uses a variation of the Elm architecture.

### Case: Sharing the model with Lenses



### Case: Custom models and Typeclasses


