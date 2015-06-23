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

  var view = this.createView(spaceObject.constructor.name.toLowerCase(), spaceObject);
  this.views.push(view);

  this.targetElement.appendChild(view);
};

DOMRenderer.prototype.createView = function (templateid, spaceObject) {
  var template = document.getElementById(templateid);
  var view = template.cloneNode(true);
  view.id = spaceObject.id;
  view.model = spaceObject;
  view.rotatedElement = view.getElementsByClassName("rotate").item(0);
  view.classList.remove("template");
  return view;
};

DOMRenderer.prototype.updateView = function (view) {
  var spaceObject = view.model;
  var style = view.style;
  var transform = "rotate(" + (Math.PI / 2 + spaceObject.heading) + "rad)";
  style.top = spaceObject.pos.y + "px";
  style.left = spaceObject.pos.x + "px";
  if (view.rotatedElement) {
    var rotatedStyle = view.rotatedElement.style;
    rotatedStyle.webkitTransform  = transform;
    rotatedStyle.mozTransform  = transform;
    rotatedStyle.msTransform  = transform;
    rotatedStyle.transform  = transform;    
  }
};