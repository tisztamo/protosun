---
layout: post
title: Controlling a spaceship
previous_git_tag: 20150621_scriptload_fix
git_tag: 20150627_spaceship_fix
image: 2015/controller.jpg
image_source: https://en.wikipedia.org/wiki/Launch_Control_Center#/media/File:S-IB_Networks_panel.jpg
---

Time to transform the simulation into a game: We will create a spaceship and control it using the keyboard. To do this, we will learn how to use DOM events, CSS transforms, and transitions.

### Rotation modeling

To remain close to the reality, and to have fun with controlling, the spaceship will be equipped with a main [propulsion engine](https://en.wikipedia.org/wiki/Spacecraft_propulsion). The engine can accelerate only to the direction (heading) of the spaceship. Spaceships have no break.

Other `SpaceObject`s may also have a heading property, so we add it to the base 'class', along with `angularSpeed`, which is the speed of the rotation:

```diff
function SpaceObject(pos, v, mass, heading, angularSpeed) {
   this.pos = pos;
   this.v = v;
   this.mass = mass || 1;
   this.reciprocalMass = 1 / this.mass;
+  this.heading = heading || 0;
+  this.angularSpeed = angularSpeed || 0;
   this.stepForce = new Vector(0, 0);
   this.id = SpaceObject.prototype.getNextId();
}
 
SpaceObject.prototype.oneStep = function () {
   this.v.add(this.stepForce.multiply(this.reciprocalMass));
   this.pos.add(this.v);
+  this.heading += this.angularSpeed;
   this.stepForce = new Vector(0, 0);
 };
```

### Rotation rendering

To have a bit of flexibility, we rotate only part of the spaceship view. This will allow displaying extra information independently from the heading of the object. (Eg. a small bar displaying shield power or player name)

We mark the rotated part of the view with the `rotated` CSS class in the template:

```HTML
<div class="template spaceobject spaceship" id="spaceship">
  <div class="rotated">
    <img src="img/spaceship.png" width="20">
  </div>
</div>
```

And we find it based on the class in `DOMRenderer.createview()`. The rotation feature is available for every view:

```diff
DOMRenderer.prototype.createView = function (templateid, spaceObject) {
  var template = document.getElementById(templateid);
  var view = template.cloneNode(true);
  view.id = spaceObject.id;
  view.model = spaceObject;
+  view.rotatedElement = view.getElementsByClassName("rotated").item(0);
...
  return view;
};
```

Only one element can be marked with `rotated`, but it can be the root of a subtree if we want to rotate multiple elements. We store a direct reference to the rotated element in the view, as finding it every time would be expensive.

> [getElementsByClassName()](https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementsByClassName) called on an element finds every children of the element which has the given CSS class. It returns a [HTMLCollection](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCollection), an array-like object.

CSS allows us to rotate any element using the `transform` property, we just need to define the rotation angle.

```diff
DOMRenderer.prototype.updateView = function (view) {
  var spaceObject = view.model;
  view.style.left = spaceObject.pos.x + "px";
  view.style.top = spaceObject.pos.y + "px";
+  if (view.rotatedElement) {
+    var transform = "rotate(" + spaceObject.heading + "rad)";
+    view.rotatedElement.style.transform = transform;
+  }
};
```

> The `transform` property allows other [transformation functions](https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function), most notably translating and scaling.

### Vendor-prefixed CSS properties

`transform` is one of the relatively new CSS properties. Although every browser supports it, some of them need a so-called vendor-specific prefix, like `-webkit-` or `-ms-`. Those browsers don't understand the `transform` property directly, only its vendor-specific counterpart, e.g. `-webkit-transform`. This means that besides to the original `transform` rule, we have to include every vendor-prefixed form of the same rule in our CSS (this time in JavaScript).

```javascript
var transform = "rotate(" + spaceObject.heading + "rad)";
var rotatedStyle = view.rotatedElement.style;
rotatedStyle.webkitTransform = transform;
rotatedStyle.mozTransform = transform;
rotatedStyle.msTransform = transform;
rotatedStyle.transform = transform;
```


> You may think that this is something against you and common sense. The reason is that browsers implement functionality *before* it gets standardized. The syntax and semantics of the property may change during the standardization process, but changing the behavior of the same property is obviously not a good idea.
> 
> So browsers may behave differently when a prefixed version is used, and they will support the non-prefixed version only after standardization is done. This method ensures that you can develop a single ruleset that works in every browser.

### Handling keyboard events

The Document Object Model allows registration of event listeners to any element, and it also specifies, how the event flows through the tree. The flow is a bit complicated for historical reasons; I will discuss it later.

We need to handle only keyboard events for now, but independently of the focused element, so we will attach our event listeners to the document.

```javascript
function KeyboardController(spaceShip) {
  this.spaceShip = spaceShip;
  document.addEventListener("keydown", this.keydownHandler.bind(this));
  document.addEventListener("keyup", this.keyupHandler.bind(this));
}
```

`keydown` and `keyup` are keyboard events representing press and release actions. There is also the `keypress` event which is a logical event, mainly for reporting auto-repeat. As we need very direct control, we use the lower lever events.

> Unfortunately, auto-repeat works strange, `keydown` or even `keyup` events may repeatedly be sent while the keyboard auto-repeats - it depends on the OS and the browser. But handling multiple pressed keys is always possible.

We just map the keyboard events to actions on the model:

```javascript
KeyboardController.prototype.keydownHandler = function (keyEvent) {
  switch (keyEvent.key) {
  case "ArrowRight":
    this.spaceShip.startRotationRight();
    break;
  case "ArrowLeft":
    this.spaceShip.startRotationLeft();
    break;
  case "ArrowUp":
    this.spaceShip.startEngine();
    break;
  }
};

KeyboardController.prototype.keyupHandler = function (keyEvent) {
  switch (keyEvent.key) {
  case "ArrowRight":
  case "ArrowLeft":
    this.spaceShip.stopRotation();
    break;
  case "ArrowUp":
    this.spaceShip.stopEngine();
    break;
  }
};
```

The event handler gets an `Event` object, this time a `KeyboardEvent`. For a long time, we used the `keyCode` property to identify the pressed key, but the new `key` property is a better and standard way. It is not yet implemented in every browser, but a good [polyfill is available](https://github.com/inexorabletash/polyfill/blob/master/keyboard.js), I have included it in the project.

The interesting part of `SpaceShip`:

```javascript
SpaceShip.prototype.mainEnginePower = 0.001;
SpaceShip.prototype.rotationEnginePower = 0.03;

SpaceShip.prototype.oneStep = function () {
  if (this.engineRunning) {
    this.stepForce.add(Vector.createFromPolar(this.heading, this.mainEnginePower));
  }
  SpaceObject.prototype.oneStep.call(this);
};

SpaceShip.prototype.startRotationLeft = function () {
  this.angularSpeed = -this.rotationEnginePower;
};

SpaceShip.prototype.startRotationRight = function () {
  this.angularSpeed = this.rotationEnginePower;
};

SpaceShip.prototype.startEngine = function () {
  this.engineRunning = true;
};

SpaceShip.prototype.stopEngine = function () {
  this.engineRunning = false;
};
```

> The physics of the rotation engine is not fully simulated, as it would render the game uncontrollable. The ship rotates while the engine is on and stops immediately when the key is released.

### Rendering the engine flame: View logic in logic-less templates

Displaying the flame of the main engine is a nice effect, and - as a visual feedback - it also helps the player learn driving the ship. The problem is that the flame has to be only displayed while the engine is running. We need a way to map the `engineRunning` property of `SpaceShip` to the displayed state of the flame.

> Logic-less templates aren't really logicless, they just contain less logic. Their goal is to prevent business logic to find its way into the template, but view-specific logic must be implemented somehow. Conditional display and iteration are available in every logic-less template language to support view logic implementation.

We are using native HTML templates, so we have to use HTML/CSS to specify as much view logic in the template as possible. In the current case, we just have to map a boolean property to a change in the display. CSS classes are for this:

```CSS
.flame {
  position: absolute;
  visibility: hidden;
}

.spaceship.enginerunning .flame {
  visibility: visible;
}
```

> The SpaceObject view is already absolutely positioned, adding this property to the flame has the effect that the flame is not counted in the dimension calculations of the view. This makes it easier to position and rotate the view.

The simplest way to map the property to the CSS class is direct manipulation based on the `SpaceObject` subtype:


```javascript
DOMRenderer.prototype.updateView = function (view) {
...
  if (spaceObject instanceof SpaceShip) {
    this.updateSpaceShipView(view);
  }
  
DOMRenderer.prototype.updateSpaceShipView = function (view) {
  if (view.model.engineRunning) {
    view.classList.add("enginerunning");
  } else {
    view.classList.remove("enginerunning");
  }
};
```

This method works for now, but of course we will improve it when we need to reuse this functionality.

### Animation of the flame

It would be great if the flame could animatedly grow when the engine is started. We can do that using CSS transitions.

When a transition rule applies to an element, it specifies the list of properties, which will be transitioned smoothly to their new value if they change. So the base rule is:

```CSS
.flame {
  opacity: 1;
  position: absolute;
  height: 0;
  visibility: hidden;
  transition-property: height, opacity;
  transition-duration: 0.2s;
}
```

It states that the flame is fully opaque, but its height is 0, so it won't be visible. If later a new rule also applies, like this one:

```CSS
.spaceship.enginerunning .flame {
  height: 100px;
  opacity: 0.5;
}
```

Which changes the height and opacity of the flame, thus it will trigger the transition. The browser will smoothly animate to the new height and opacity values. The effect is that the flame grows while its opacity goes from 1 to 0.5. The flame is brighter while small. This looks great and also allows other objects to show through the fully developed flame.

You may have noted that the selector of the rule is a bit strange. `".spaceship.enginerunning .flame"` select every elements with the `flame` class which is inside an element with both `spaceship` and `enginerunning` classes. We apply `enginerunning` on the full spaceship view from JavaScript without knowing how it will be displayed. This rule helps to separate low-level view description with high-level view logic.

> I have removed the `visibility` settings in favor of `height: 0`. This is because the transition from `visibility: visible` to `visibility: hidden` is not working, the flame just disappears. There is a [workaround for this](http://www.greywyvern.com/?post=337), but we do not need it.
 
### Conclusion

We have a working game! We have learned to do transitions without using JavaScript, and also to programmatically control the display, while specifying as much of the view behavior in HTML/CSS as possible. We will continue going on this way, separating programmable view logic from descriptive view rules while working with real logic-less templates.