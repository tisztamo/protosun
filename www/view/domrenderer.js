"use strict";

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

  this.createView(spaceObject.constructor.name.toLowerCase(), spaceObject);
};

DOMRenderer.prototype.spaceObjectRemoved = function (spaceObject) {
  Renderer.prototype.spaceObjectRemoved.call(this, spaceObject);
  var i = this.views.length - 1;
  while (i >= 0) {
    if (this.views[i].model === spaceObject) {
      this.views[i].parentElement.removeChild(this.views[i]);
      this.views.splice(i, 1);
      return;
    }
    i--;
  }
};

DOMRenderer.prototype.createView = function (templateid, spaceObject) {
  var template = document.getElementById(templateid);
  var view = template.cloneNode(true);
  view.id = spaceObject.id;
  view.model = spaceObject;
  view.rotatedElement = view.getElementsByClassName("rotated").item(0);
  view.classList.remove("template");
  this.targetElement.appendChild(view);
  this.views.push(view);
  view.originX = view.clientWidth / 2;
  view.originY = view.clientHeight / 2;
  return view;
};

DOMRenderer.prototype.updateView = function (view) {
  var spaceObject = view.model;
  var style = view.style;
  var transform = "rotate(" + (Math.PI / 2 + spaceObject.heading) + "rad)";
  style.left = (spaceObject.pos.x - view.originX) + "px";
  style.top = (spaceObject.pos.y - view.originY) + "px";
  if (view.rotatedElement) {
    var rotatedStyle = view.rotatedElement.style;
    rotatedStyle.webkitTransform = transform;
    rotatedStyle.mozTransform = transform;
    rotatedStyle.msTransform = transform;
    rotatedStyle.transform = transform;
  }
  if (spaceObject instanceof Detonation) {
    this.updateDetonationView(view);
  } else if (spaceObject instanceof SpaceShip) {
    this.updateSpaceShipView(view);
  }
};

DOMRenderer.prototype.updateSpaceShipView = function (view) {
  if (view.model.engineRunning) {
    view.classList.add("enginerunning");
  } else {
    view.classList.remove("enginerunning");
  }
};

/*jshint -W098 */
DOMRenderer.prototype.updateDetonationView = function (view) {
  if (!view.classList.contains("detonated")) {
    var forceStyleRecalc = view.clientHeight != 0.001;
    view.classList.add("detonated");
  }
};