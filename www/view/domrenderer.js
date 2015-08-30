"use strict";

function DOMRenderer(simulation, viewElement) {
  Renderer.call(this, simulation, viewElement);
  this.views = [];
  this.backgroundSpeedRatio = 2;
  this.defaultBgSize = 1024;
}

DOMRenderer.prototype = new Renderer();

DOMRenderer.prototype.redraw = function () {
  var shipModel = this.ship.model;
  this.camera.updateView();
  var length = this.views.length;
  for (var i = 0; i < length; i++) {
    this.updateView(this.views[i]);
  }
  this.updateBackground();
};

DOMRenderer.prototype.spaceObjectAdded = function (spaceObject) {
  Renderer.prototype.spaceObjectAdded.call(this, spaceObject);

  var view = this.createView(spaceObject.constructor.name.toLowerCase(), spaceObject);
  if (spaceObject instanceof SpaceShip) {
    this.ship = view;
  }
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
  view.physicalElement = view.getElementsByClassName("physicalview").item(0);
  view.classList.remove("template");
  this.viewElement.appendChild(view);
  this.views.push(view);
  return view;
};

DOMRenderer.prototype.updateView = function (view) {
  var spaceObject = view.model;
  var style = view.style;
  var projectedPos = this.viewPort.isInView(spaceObject.pos, spaceObject.radius);
  if (projectedPos) {
    style.left = projectedPos.x + "px";
    style.top = projectedPos.y + "px";
    if (view.physicalElement) {
      var transform = "rotate(" + spaceObject.heading + "rad)" + "scale(" + this.viewPort.viewScale + ")";
      var rotatedStyle = view.physicalElement.style;
      rotatedStyle.webkitTransform = transform;
      rotatedStyle.msTransform = transform;
      rotatedStyle.transform = transform;
    }
    style.display = "block";
    if (spaceObject instanceof Detonation) {
      this.updateDetonationView(view);
    } else if (spaceObject.mixinOverride && spaceObject.mixinOverride.EnginePowered) {
      this.updateEnginePoweredView(view);
    }
  } else {
    style.display = "none";
  }
};

DOMRenderer.prototype.updateBackground = function () {
  var center = this.viewPort.modelViewPort.center;
  var bgSizeRatio = 1 + (this.viewPort.viewScale - 1) / this.backgroundSpeedRatio;
  this.viewElement.style.backgroundPosition = Math.round(-center.x / this.backgroundSpeedRatio * bgSizeRatio) + "px " + Math.round(-center.y / this.backgroundSpeedRatio * bgSizeRatio) + "px";
  this.viewElement.style.backgroundSize = Math.round(bgSizeRatio * this.defaultBgSize) + "px";
};

DOMRenderer.prototype.updateEnginePoweredView = function (view) {
  if (view.model.engineRunning) {
    view.classList.add("enginerunning");
  } else {
    view.classList.remove("enginerunning");
  }
};

/*jshint -W098 */
DOMRenderer.prototype.updateDetonationView = function (view) {
  if (!view.classList.contains("detonated")) {
    // Reading clientHeight forces style recalculation which is needed
    // to start the transition
    var forceStyleRecalc = view.clientHeight != 0.001;
    view.classList.add("detonated");
  }
};