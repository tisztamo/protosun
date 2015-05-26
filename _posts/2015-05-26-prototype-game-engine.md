---
layout: post
title: A Prototype Game Engine
---

The heart of a game engine is the scheduler which ensures that game time pass independently of hardware performance and any event happening inside or outside the simulation. 

> Geek Note: Although we develop a space  game, we do not want to simulate [time dilation](http://en.wikipedia.org/wiki/Time_dilation) so a simple timer will fulfil our needs.

The full code of the scheduler and its usage:

### gameengine.js: ###

{% highlight javascript %}
    function GameEngine(fps) {
        this.fps = fps || 30;
    }

    GameEngine.prototype.start = function () {
        setInterval(this.oneStep.bind(this),
            1000 / this.fps);
    };

    GameEngine.prototype.oneStep = function () {
        console.log("Default oneStep, you have to override it");
    };
 {% endhighlight %}
 
#### main.js: ####
{% highlight javascript %}
    var simulation = new GameEngine(30);
    
    simulation.oneStep = function () {
        console.log("Overridden onStep");
    };

    simulation.start();
{% endhighlight %}

The code is short but if you are a beginner you may need some clarification. Let's go through!

### Constructor function ###

I have implemented the scheduler using the constructor pattern, you can think of this as a class if you are familiar with classical OOP concepts. JavaScript (ES5) doesn't have the notion of a class but it has a very flexible prototype system which allows us to construct this class-like formation:

    function GameEngine(fps) {
        this.fps = fps || 30;
    }

This is the constructor of our "class". It is just a function, it will be used as a constructor when we call it with the `new` operator.

- It takes an optional parameter and stores it in the object.
- The `this` keyword refers to the object under creation.
- We use of the || operator to define the default value of property `fps` as it will return the parameter `fps` when it is defined and 30 if not.
- Although this is a fairly common trick I have to warn you: The exact truth is that || is a simple boolean operator which returns its first argument when it is truthy and the second if not ([more info about truthiness](https://developer.mozilla.org/en-US/docs/Glossary/Truthy)). This means for us that it is impossible to set `fps` to 0: If you try it, it will be set to the default value as 0 is falsy. So you should use this || trick only if falsy values are invalid for that parameter.
- Note the upper camel case, it is recommended as it is the only way to know this is a constructor. You should never call constructors directly because they will try to construct the global `window` object.

### Prototype ###

We can define methods of the "class" by adding them to the automatically defined prototype property of the constructor:

    GameEngine.prototype.start = function () {
        ...
    };

Every object has a prototype which is an another object. If we access a property of an object which is not defined in that object then the prototype of the object will be checked for the property. The runtime will travel through the prototype chain up to the root Object. If it finds the property somewhere it will return it.

If an object is created using a constructor then its prototype will be set to the value stored in the prototype property of the constructor. 

So if we attach anything to the prototype property of the `GameEngine` contructor, that thing will be available in every GameEngine object through the prototype chain:

    var simulation = new GameEngine();
    simulation.start();

> Geek Note: You may have noticed that there is a difference between "the prototype" and "the `prototype` property". Strangely enough the prototype of an object is not stored in its `prototype` property but in its `__proto__` property. Every object has a prototype (thus a `__proto__` property) but only functions have the `prototype` property which will be used only if the function is called as a constructor. Fortunately you don't often need to access the prototype of an object so you may live happy without knowing this.

A simple but powerful mechanism. So powerful that it is hard to understand. You can think of the prototype of the constructor as if it were the class, that will be enough to use it. If yo do not like to think to a thing as if it were something else then you can learn all the details of prototypes from Angus Croll's great article: [https://javascriptweblog.wordpress.com/2010/06/07/understanding-javascript-prototypes/]

### The *this* nightmare

Let's see the content of the start method:

    GameEngine.prototype.start = function () {
        setInterval(this.oneStep.bind(this),
            1000 / this.fps);
    };

The easy part: setInterval is an internal function which sets up a scheduler in the runtime which will call the given function (first parameter) regularly. The second parameter is the time between two calls in milliseconds. `1000 / this.fps` is the number of milliseconds we have to wait betwen two calls to receive this.fps call per second.

The strange thing here is the expression `this.oneStep.bind(this)` which is the function to get called regularly. `this.oneStep` is a reference to the oneStep method defined later, doing nothing at the time: 

    GameEngine.prototype.oneStep = function () {
        console.log("Default oneStep, you have to override it");
    };

So why we don't just write `setInterval(this.oneStep, 1000 / this.fps)`? The problem is with `this`: it works a 'bit' counter-intuitive:
- As said before in the constructor it refers to the object under construction. 
- When you call a method on an object, e.g. `simulation.start()` then it will point to that object. So it works as expected most of the time.
- But when you call a function without knowing the object then `this` will point to the global `window` object.

The problem is that if you get a reference to a method of an object then it is in reality a reference to a function without any knowledge of the object (Most of the time the method is not an own property of the object but lies somewhere on the prototype chain). If you later call that function reference then the value of `this` will be lost and it will point to `window`.

And this is exactly what happens when you call `setInterval`: it accepets a function reference and will call it directly, resulting `this` pointing to `window`. But we will need a reference to our GameEngine object so we have to do something.

> Geek Note: Again a powerful but hard to understand concept. This time so powerful that most of us have shot himself in the foot with it several times. You may call it bad language design but your mother would answer: Cook with what you have!

To solve this problem I have used the `bind` method on the original function: `this.oneStep.bind(...)` which returns a new function which does only one thing: it will call the original function with this pointing to where we want (first parameter). In our case it is the current value of `this` as we just want to preserve its value. So `this.oneStep.bind(this)` is almost the same as `this.oneStep` except that `this` will be preserved when this reference is given to setInterval. You have to learn this: It is not just about setInterval but it will be the case with every callback - and we will have a lot.