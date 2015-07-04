---
layout: post
title: Organizing and loading JavaScript files
git_tag: 20150621_scriptload_fix
previous_git_tag: 20150618_gravity
image: 2015/load.jpg
image_source: https://www.flickr.com/photos/usnavy/7970395398
---

Until now, we had ten `<script>` tags in the HTML to load source files from the root directory of the app. Although it is a very simple, standard, and working solution, we have to find a better one or we will have multiple problems:

- Having too much source files in a directory complicates finding a piece of code. The more files, the more hassle.
- Having too much `<script>` tags in the HTML quickly slows down the page load. The problem is that script loading is synchronous: most browsers pause parsing the page at every `<script>` tag and wait for the script to load. The reason is that the script may contain `document.write()` calls, which have to be injected into the HTML after the script tag. This means that scripts are loaded sequentially, lasting at least a ping time each. Not good. The solution is to concatenate scripts into a (few) large one before publishing.

### Directory structure

JavaScript gives us the flexibility to load anything from anywhere, but - as always - says nothing about how to do it, how to organize the code.

I have followed the road of Java, having one 'class' per file and nothing else. (Except main.js, which wires things together and starts the game).

We will organize the files based on their architectural role, creating separate directories for models, views, and controllers. A directory called 'util' will be also created for the rest. It will be easy to modify this structure later: We can simply move files without changing them.

### Namespaces

JavaScript has global variables but JavaScript libraries almost always use a root object like `$`, `google` or `_`. They store everything inside that object to avoid polluting the global namespace, which would lead to name collisions and hard-to-debug bugs. 

Unfortunately, this is az imperfect workaround for the problem that JavaScript lacks namespaces and imports. One problem is that you always have to write out the fully qualified names, like `new google.maps.LatLng()` (instead of `new LatLng()` after importing `google.maps`).

I do not like writing and reading long names and we aren't developing a library, so I have decided not to use namespaces in this project.

> You are free to think that this is bad design. We are "polluting" the global namespace with our 'classes'.
> The fear of name collision is so terrible that globals are considered evil in the JavaScript world. I agree with that in the case of variables. But if we are working on an application, not on a library, then I consider global functions, especially constructor functions ('classes') acceptable.
> 
> If every library uses a namespace object then we cannot collide with any 3rd party code in the app. If we want to factor out part of the code to a library, we have to create a namespace and use fully qualified names for every 'class' access.

But let's have a quick detour and see how you could use namespaces! You simply create a global namespace object and add 'classes' to it. E.g.:

 
```javascript
var protosun = protosun || {}; 
protosun.GameEngine = function (...) {}
```

You simply do this in every file; it auto-creates the namespace if it is not yet defined.

Then you can access the 'class' with its fully qualified name:

```javascript
var gameEngine = new protosun.GameEngine();
```

It is also possible to nest namespaces this way.

>  *Homework: Move every class to the namespace `protosun` and access them with fully qualified names using two regex search & replace!*

### Module loading

> JavaScript lacks the concept of modules, but great solutions were developed. One of the most successful module loaders is [require.js](http://requirejs.org/) which loads so-called AMD modules. A module is something like a namespace, but it can have dependencies and can export an interface. The loader calculates the correct order to load scripts based on the dependencies. A compression tool is also available to concatenate the scripts for fast loading in production.

> ES6 - the next version of JavaScript - has a native module system, but it is not yet implemented in browsers. Porting our solution to it will be easy once it becomes usable.

We will create a simple script loader, which loads scripts using an array of URLs. The heart of the loader is the following function, which loads one script:


```javascript
Loader.prototype.loadScript = function (url, success, fail) {
  var scriptElement = document.createElement("script");
  scriptElement.async = false;
  scriptElement.type = "text\/javascript";
  scriptElement.addEventListener("error", fail);
  scriptElement.addEventListener("load", success);
  document.head.appendChild(scriptElement);
  scriptElement.src = url;
};
```

It simply creates a `script` element pointing to the URL and appends it to the DOM. It also attaches event handlers for the `load` and `error` events. Setting async to false on a dynamically loaded script means that loading is async but execution will be in order.

We call this function on every URL and wait for every `load` event to fire:

```javascript
Loader.prototype.loadScripts = function (scriptUrls, cb) {
  if (!(scriptUrls instanceof Array)) {
    throw "scripts parameter must be an array";
  }
  this.toBeLoadedCount = scriptUrls.length;
  this.loadDoneCB = cb;
  console.log("Loading scripts: " + scriptUrls.join(' '));
  for (var i = 0; i < scriptUrls.length; ++i) {
    this.loadScript(scriptUrls[i], this.loadedCB.bind(this), this.failedCB.bind(this));
  }
};

Loader.prototype.loadedCB = function () {
  if (--this.toBeLoadedCount === 0) {
    if (typeof this.loadDoneCB === "function") {
      this.loadDoneCB();
    }
  }
};
```

Here we see some language constructs you may not be familiar with:

- The `instanceof` operator tests whether the object is an instance of a 'class'. (To be more precise: it *"tests whether an object has in its prototype chain the prototype property of a constructor"* ([MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/instanceof)). But who can understand that sentence?)
- The `typeof` operator returns a string containing the lowercase name of the type of the given operand. You can use it to differentiate between built-in types. If you give it any object, it will return "object" independently of the prototype chain. It even returns "object" for arrays. Its usage is pretty limited. [Read more about typeof on MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof)
- `throw` will throw an exception, which can be any type in JavaScript. You can catch exceptions with `try-catch` blocks. If you fail to catch an exception, the browser will log an error to the console and stop that script run. (But timers and event handlers will continue to fire). Here I use `throw` to report an invalid parameter, as it is easy to call this method mistakenly with one or more strings. If `scriptUrls` is a string, not an `Array`, then the cycle will go through its characters and will try to load one character long URLs. I do not want that.

### Separating development and production code loading

The following code loads `compressed.js` and runs the function `main()` after it. If it fails to load the script (e.g. it is missing), then it loads the original sources. This way in production it will load fast, but you can conveniently debug if you do not have `compressed.js`.

```javascript
var loader = new Loader();
loader.loadScript("compressed.js", main, function () {
  console.info("compressed.js not found, loading scripts in debug mode.");
  loader.loadScripts(["util/polyfills.js",
  "model/gameengine.js",
  "model/simulation.js",
  "model/vector.js",
  "model/spaceobject.js",
  "model/star.js",
  "model/planet.js",
  "model/moon.js",
  "view/renderer.js",
  "view/domrenderer.js"], main);
});
```

The simplest compression is to concatenate all your scripts into one. Order of scripts is important because every base 'class' have to come before its 'subclasses'.

The loader helps you to concatenate the scripts in the correct order by logging out the names. You can copy-paste the list from the js console to a `cat` command if you are using a Unix-like system. 

```
$ cat util/polyfills.js model/gameengine.js ... > compressed.js
```

A better way is to use the [Closure Compiler](https://developers.google.com/closure/compiler/) which also minifies the scripts:

```
$ java -jar compiler.jar util/polyfills.js model/gameengine.js ... > compressed.js
```

>Far from a full-featured build system, but it works for this small project, was an hour to write and its only dependency is the OS command shell.

> The HTML now contains only two `<script>` tags: for `loader.js` and `main.js`. In production, this means three script load, which is acceptable. Going down to two is easy but it disfigures the code. I think that going down to one is only possible if you maintain a separate branch for the production code, or if you use a build system that modifies your HTML and/or scripts.

### Conclusion

While working with JavaScript, we always have to balance between flexibility and structure. Or rather, we have to work continuously on adding structure. Today we have taken a big step, and we have also solved the problem of synchronous script loading - a terrible legacy from the good old nineties.