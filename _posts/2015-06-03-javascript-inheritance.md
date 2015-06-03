---
layout: post
title: Inheritance in JavaScript
git_tag: 20150603_simulation
image: 2015/drosophila.jpg
---


In the previous post, we have created the `GameEngine` prototype. Now we will create a "subclass" of it called `Simulation`, which will manage the game world.

We will learn creating subclasses, overriding methods and calling the overridden one. Enjoying JavaScript OOP remains a future plan...

Let's start with the weird stuff!

### Overriding methods after instantiation ###


As we have learned, inheritance is implemented between **objects** in JavaScript, with the prototype system. If we create an instance of `GameEngine`:

```javascript
var simulation = new GameEngine();
```

The newly created object looks like this:

![](../../../assets/article_images/2015/gameengine.png "GameEngine instance in console")

*Just open the javascript console at [http://tisztamo.github.io/protosun/www/index.html](http://tisztamo.github.io/protosun/www/index.html) and enter the code to see this.*

Its prototype is the `GameEngine` we have created. If we call `oneStep()` on it directly then the `oneStep` method of the prototype will  run because the object has no `oneStep` method but its prototype has:

![](../../../assets/article_images/2015/onestep.png "Default oneStep")

But we can easily give it an own `oneStep` method to override the default one:

```javascript
simulation.oneStep = function () {
  console.log("overridden oneStep");
};
```

Call `oneStep()` again and see the wonder:

![](../../../assets/article_images/2015/overridden.png "Overridden oneStep")

The object now looks a bit different, it has an own `oneStep` which overrides the old one in the prototype:

![](../../../assets/article_images/2015/modifiedsimulation.png "Modified GameEngine object")

This seems a bit hacky and not very usable as we don't usually want to change the behavior of objects after creation. Instead, we want to create different objects directly.


### Defining subclasses ###

We can define a "subclass" by creating a new prototype object from the original one and extending it. We will use the new prototype later to create objects.

```javascript
function Simulation() {
}

Simulation.prototype = new GameEngine();

Simulation.prototype.setUpModel = function () {
  this.spaceObjects = {};
};
```

The new thing here is that we set the prototype of `Simulation` to a new instance of `GameEngine` before adding methods. This way the `Simulation` prototype will have all the methods from `GameEngine` and the ones added later to it.

I have added a new method called `setUpModel`. An instance of `Simulation`:

![](../../../assets/article_images/2015/modifiedsimulation.png "Modified GameEngine object")

Overriding a method is as simple as defining it in the "subclass":

```javascript
Simulation.prototype.start = function () {
  this.setUpModel();
  GameEngine.prototype.start.call(this);
};
```

I have also called the original `start` with the bizarre syntax using `call`, which allows us to call a function directly and specify the value of `this`. It is similar to `bind`, except that it calls the function immediately, setting `this` to the given value. The result is that the method from the base "class" runs on the current object.

This is the way we call methods from the base class as there is no `super` in JavaScript.

### Overriding and chaining constructors ###

JavaScript has a surprise for us again: If we create a `new Simulation()`, it will work perfectly except one thing: The old `GameEngine` constructor will be called instead of the new `Simulation` (The prototype of the object is `Simulation`, but the base constructor runs).

The problem is that we have changed the prototype of `Simulation` to a `new GameEngine()`, and this also changes the constructor. If we want `new Simulation()` objects to be created with the `Simulation` constructor, we have to write one more line:

```javascript
Simulation.prototype.constructor = Simulation;
```

`constructor` is a predefined property of the prototype object, we have to point it to the new constructor function. After that only the new constructor will run, but we can call the old constructor from the new one, if we want.

Putting it all together, the code looks as follows:

```javascript
function Simulation(fps) {
  GameEngine.call(this, fps);
}

Simulation.prototype = new GameEngine();
Simulation.prototype.constructor = Simulation;

Simulation.prototype.setUpModel = function () {
  this.spaceObjects = {};
};

Simulation.prototype.start = function () {
  this.setUpModel();
  GameEngine.prototype.start.call(this);
};
```

Hard to believe, but it works as expected.

### Conclusion ###

Based on the prototype system we are able to create classes and subclasses with overridden virtual methods.

The syntax is sometimes weird, but the flexible toolset of JavaScript allows us to do tricky things, like changing the behavior of objects after creation.

We will see later that mastering the tool and use the tricks sparingly will lead to clear code and a lot of fun.