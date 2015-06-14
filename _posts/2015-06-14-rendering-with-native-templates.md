---
layout: post
title: Rendering from HTML templates
git_tag: 20150614_rendering
image: 2015/native_american.jpg
---

We will finally see something on the screen! Logic-less templates are sexy, so we give them a try in the form of 'native' HTML templates.  Today we will build the view of our MVC design so that the simulation will come to life.

### Separation of concerns

We want to separate the presentation from the model, so we have to implement MVW ([Model-View-Whatever](https://plus.google.com/+AngularJS/posts/aZNVhj355G2)). As data binding is not readily available, the design tends towards classic MVC.

> `Object.observe()` is coming in ES7, usable polyfills are already available so we could create a more modern, MVVM-like architecture based on data binding. But we do not need it: Our model changes all the time and the view has to be fully rerendered in every round. I think that data binding would add nothing else than complexity and performance burden.

We call the view `Renderer`. It registers to `Simulation` (the model) and receives updates from it directly. 

```javascript
function Renderer(simulation) {
  this.simulation = simulation;
  this.redrawNeeded = true;
  if (simulation) {
    simulation.setRenderer(this);
  }
}

Renderer.prototype.oneStepTaken = function () {
  this.redrawNeeded = true;
};

Renderer.prototype.spaceObjectAdded = function (spaceObject) {
  this.redrawNeeded = true;
};
```

`Renderer` is an abstract 'class', the concrete rendering will be done in `DOMRenderer`. This will allow us to have separate implementations, for example, we may later want to switch to `<canvas>` based rendering.

> This is a simplified observer pattern, with only one observer per subject. If you are interested in design patterns, you may find useful this book: [Learning JavaScript Design Patterns](http://addyosmani.com/resources/essentialjsdesignpatterns/book/)

### Scheduling animations: requestAnimationFrame

`requestAnimationFrame()` is an API in the browser to avoid unnecessary DOM updates.

If we change something in the DOM, it doesn't trigger redrawing the UI. Redraw happens independently, usually at a constant rate. So if we overwrite our recent changes in the DOM before the next redraw, our first work will be lost without being ever drawn.

To avoid this, we can use `requestAnimationFrame()`: It accepts a callback which will be called just *before* the next redraw. We do the DOM manipulation in this callback, but only when the model has changed since the last redraw.

```javascript
Renderer.prototype.start = function () {
  window.requestAnimationFrame(this.tick.bind(this));
};

Renderer.prototype.tick = function () {
  if (this.redrawNeeded) {
    this.redraw();
    this.redrawNeeded = false;
  }
  window.requestAnimationFrame(this.tick.bind(this));
};
```

### HTML templates

We will use fragments of the HTML code as templates, simply cloning them and connecting with the model.

So a template looks like this:

```html
<div class="template spaceobject" id="spaceobject">
  <img src="img/spaceobject.png">
</div>
```
> Although this is a rarely used approach currently, it works for us and this points to the future direction of the standard.
> 
> The already widely supported `<template>` element is aimed definitely to the same. I decided not to use it because it needs some time to get prevalent, and because it has a feature which prevents automatic preloading of images inside templates - which may be good for most cases but not for a game.

Rendering of templates is simply turned off using CSS:

```css
.template {
  display: none;
}
```

The JavaScript which instantiates a template:

```javascript
DOMRenderer.prototype.createView = function (templateid, spaceObject) {
  var template = document.getElementById(templateid);
  var view = template.cloneNode(true);
  view.id = spaceObject.id;
  view.model = spaceObject;
  view.classList.remove("template");
  return view;
};
```

It looks for the template element, creates a deep clone of it and connects it to the model object (`spaceObject`) it represents. The connection is, of course, one-way, the model doesn't know anything about the view.

`createView` also removes the CSS class 'template' from the cloned node, allowing it to be displayed by the browser. I used `classList` which is way more convenient than `className`. It is not supported in old browsers (e.g. IE9), but polyfills are available. The `id` of the cloned element must be also changed because it is the same as the id of the template. We set it to the unique id of the model object, which is generated for every `SpaceObject` at creation.

The cloned node is not yet part of the DOM, it has to be added to the DOM as a child of an element. The full code of `spaceObjectAdded`, which handles the addition of a new  `SpaceObject`  to `Simulation`:

```javascript
DOMRenderer.prototype.spaceObjectAdded = function (spaceObject) {
  Renderer.prototype.spaceObjectAdded.call(this, spaceObject);

  var view = this.createView("spaceobject", spaceObject);
  this.views.push(view);

  this.targetElement.appendChild(view);
};
```

The instantiated templates are collected in the `views` array. `targetElement` is the DOM element used as the root of the renderer. The only missing but important thing is to regularly update the view, based on model data:

```javascript
DOMRenderer.prototype.updateView = function (view) {
  var spaceObject = view.model;
  view.style.top = spaceObject.pos.y + "px";
  view.style.left = spaceObject.pos.x + "px";
};
```

For the sake of simplicity, I use the model coordinates directly. Later some projection will be needed.

### Conclusion

We were able to separate the view and the model and we have also saved us from creating node hierarchies with the DOM API. Instead, we use HTML templates. They work like a charm!

Today space objects started to fly out from the screen and I am sure that in the next post we will have real fun playing with our solar system simulator, adding new planets - or even stars - and watching what happens.