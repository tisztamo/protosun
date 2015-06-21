"use strict";

// Function.name (for IE). Source: http://matt.scharley.me/2012/03/09/monkey-patch-name-ie.html
if (Function.prototype.name === undefined && Object.defineProperty !== undefined) {
    Object.defineProperty(Function.prototype, 'name', {
        get: function() {
            var funcNameRegex = /function\s([^(]{1,})\(/;
            var results = (funcNameRegex).exec((this).toString());
            return (results && results.length > 1) ? results[1].trim() : "";
        }
    });
}"use strict";

function GameEngine(fps) {
  this.fps = fps || 30;
}

GameEngine.prototype.start = function () {
  setInterval(this.oneStep.bind(this),
    1000 / this.fps);
};

GameEngine.prototype.oneStep = function () {
  console.log("Default oneStep, you have to override it");
};"use strict";

function Simulation(fps) {
  GameEngine.call(this, fps);
  this.spaceObjects = [];
  this.renderer = null;
}

Simulation.prototype = new GameEngine();
Simulation.prototype.constructor = Simulation;

Simulation.prototype.start = function () {
  this.setUpModel();
  GameEngine.prototype.start.call(this);
};

Simulation.prototype.setRenderer = function (renderer) {
  this.renderer = renderer;
};

Simulation.prototype.setUpModel = function () {
  console.log("Default setUpModel, you have to override it!");
};

Simulation.prototype.addSpaceObject = function (spaceObject) {
  this.spaceObjects.push(spaceObject);
  if (this.renderer) {
    this.renderer.spaceObjectAdded(spaceObject);
  }
};

Simulation.prototype.oneStep = function () {
  var length = this.spaceObjects.length;
  var spaceObjects = this.spaceObjects;
  for (var i = 0; i < length; i++) {
    for (var j = i + 1; j < length; j++) {
      SpaceObject.actGravityForce(spaceObjects[i], spaceObjects[j]);
    }
    spaceObjects[i].oneStep();
  }
  this.renderer.oneStepTaken();
};"use strict";

function Vector(x, y) {
  this.x = x;
  this.y = y;
}

Vector.prototype.add = function (another) {
  this.x += another.x;
  this.y += another.y;
  return this;
};

Vector.prototype.multiply = function (scalar) {
  this.x *= scalar;
  this.y *= scalar;
  return this;
};

Vector.prototype.distanceFrom = function (another) {
  var xDiff = another.x - this.x,
    yDiff = another.y - this.y;
  return Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2));
};

Vector.prototype.length = function () {
  return this.distanceFrom(Vector.zero);
};

Vector.prototype.substractToNew = function (another) {
  return new Vector(this.x - another.x, this.y - another.y);
};

Vector.prototype.toUnitVector = function () {
  return this.multiply(1 / this.length());
};

Vector.prototype.toString = function () {
  return "(" + this.x + ", " + this.y + ")";
};

Vector.zero = new Vector(0, 0);"use strict";

function SpaceObject(pos, v, mass) {
  this.pos = pos;
  this.v = v;
  this.mass = mass || 1;
  this.reciprocalMass = 1 / this.mass;
  this.stepForce = new Vector(0, 0);
  this.id = SpaceObject.prototype.getNextId();
}

SpaceObject.G = 100;

SpaceObject.actGravityForce = function (spaceObject1, spaceObject2) {
  var distance = spaceObject1.pos.distanceFrom(spaceObject2.pos);
  if (distance < 2) {
    return;
  }
  var forceMagnitude = spaceObject1.mass * spaceObject2.mass * SpaceObject.G / Math.pow(distance, 2);
  var forceDirection = spaceObject1.pos.substractToNew(spaceObject2.pos).toUnitVector();
  var force = forceDirection.multiply(forceMagnitude);
  spaceObject2.stepForce.add(force);
  spaceObject1.stepForce.add(force.multiply(-1));
};

SpaceObject.prototype.nextId = 1;

SpaceObject.prototype.getNextId = function () {
  var id = "SO" + SpaceObject.prototype.nextId;
  SpaceObject.prototype.nextId += 1;
  return id;
};

SpaceObject.prototype.oneStep = function () {
  this.v.add(this.stepForce.multiply(this.reciprocalMass));
  this.pos.add(this.v);
  this.stepForce = new Vector(0, 0);
};"use strict";

function Star(pos, v, mass) {
  SpaceObject.call(this, pos, v, mass);
}

Star.prototype = new SpaceObject();
Star.prototype.constructor = Star;"use strict";

function Planet(pos, v, mass) {
  SpaceObject.call(this, pos, v, mass);
}

Planet.prototype = new SpaceObject();
Planet.prototype.constructor = Planet;"use strict";

function Moon(pos, v, mass) {
  SpaceObject.call(this, pos, v, mass);
}

Moon.prototype = new SpaceObject();
Moon.prototype.constructor = Moon;"use strict";

function Renderer(simulation) {
  this.simulation = simulation;
  this.redrawNeeded = true;
  if (simulation) {
    simulation.setRenderer(this);
  }
}

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

Renderer.prototype.redraw = function () {
  console.log("Override redraw!");
};

Renderer.prototype.oneStepTaken = function () {
  this.redrawNeeded = true;
};

/*jshint -W098 */

Renderer.prototype.spaceObjectAdded = function (spaceObject) {
  this.redrawNeeded = true;
};

Renderer.prototype.spaceObjectRemoved = function (spaceObject) {
  this.redrawNeeded = true;
};"use strict";

function DOMRenderer(simulation, targetElement) {
  Renderer.call(this, simulation);
  this.targetElement = targetElement;
  this.views = [];
}

DOMRenderer.prototype = new Renderer();

DOMRenderer.prototype.redraw = function () {
  var length = this.views.length;
  for (var i = 0; i < length; i++) {
    this.updateView(this.views[i]);
  }
};

DOMRenderer.prototype.spaceObjectAdded = function (spaceObject) {
  Renderer.prototype.spaceObjectAdded.call(this, spaceObject);

  var view = this.createView(spaceObject.constructor.name.toLowerCase(), spaceObject);
  this.views.push(view);

  this.targetElement.appendChild(view);
};

DOMRenderer.prototype.createView = function (templateid, spaceObject) {
  var template = document.getElementById(templateid);
  var view = template.cloneNode(true);
  view.id = spaceObject.id;
  view.model = spaceObject;
  view.classList.remove("template");
  return view;
};

DOMRenderer.prototype.updateView = function (view) {
  var spaceObject = view.model;
  view.style.top = spaceObject.pos.y + "px";
  view.style.left = spaceObject.pos.x + "px";
};