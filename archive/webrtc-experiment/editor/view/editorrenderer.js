"use strict";

function EditorRenderer(editor, containingViewOrElement) {
  CanvasRenderer.call(this, editor.simulation, containingViewOrElement, "EditorArea");
  this.editor = editor;

  this.forecastSteps = 1200;
  this.forecaster = new Forecaster(editor.simulation, this.forecastSteps);
}

EditorRenderer.prototype = Object.create(CanvasRenderer.prototype);
EditorRenderer.prototype.constructor = EditorRenderer;

EditorRenderer.prototype.redraw = function () {
  CanvasRenderer.prototype.redraw.call(this);
  this.renderForecast();
};

EditorRenderer.prototype.stop = function () {
  CanvasRenderer.prototype.stop.call(this);
  this.forecaster = null;
};

CanvasView.loadImage("selected");

EditorRenderer.prototype.updateView = function (view) {
  CanvasRenderer.prototype.updateView.call(this, view);
  try {
    if (view.model === this.editor.selectedObject) {
      view.drawPart({
        image: CanvasView.loadImage("selected"),
        width: view.model.radius * 2.2,
        height: view.model.radius * 2.2
      });
    }
  } catch (e) {
    console.error(e);
  }
};

EditorRenderer.prototype.createColors = function () {
  var baseColors = {
    Planet: "blue",
    Star: "orange",
    SpaceShip: "yellow",
    Moon: "gray"
  };
  var colors = {};
  this.simulation.spaceObjects.forEach(function (spaceObject) {
    colors[spaceObject.id] = baseColors[spaceObject.constructor.name] || "white";
  });
  return colors;
};

EditorRenderer.prototype.renderForecast = function () {
  this.forecaster.steps = this.forecastSteps;
  var forecast = this.forecaster.createForecast();
    var colors = this.createColors();
  for (var id in forecast) {
    this.ctx.strokeStyle = colors[id];
    this.ctx.beginPath();
    var line = forecast[id];
    for (var i = 0; i < line.length; ++i) {
      var pos = this.viewPort.projectToView(line[i]);
      this.ctx.lineTo(pos.x, pos.y);
    }
    this.ctx.stroke();
  }
};

EditorRenderer.prototype.nearestObject = function (clientX, clientY) {
  var pos = this.viewPort.projectToModel(new Vector(clientX, clientY));
  var minDistance = Infinity;
  var found = null;
  for (var i = 0; i < this.views.length; ++i) {
    var spaceObject = this.views[i].model;
    var distance = spaceObject.pos.distanceFrom(pos) - spaceObject.radius;
    if (distance < minDistance) {
      minDistance = distance;
      found = spaceObject;
    }
  }
  return found;
};

EditorRenderer.prototype.clickedObject = function (clientX, clientY) {
  var spaceObject = this.nearestObject(clientX, clientY);
  var pos = this.viewPort.projectToModel(new Vector(clientX, clientY));
  if (!spaceObject || spaceObject.pos.distanceFrom(pos) > 10 + spaceObject.radius) {
    return null;
  }
  return spaceObject;
};