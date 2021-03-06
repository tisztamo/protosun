"use strict";

function Renderer(simulation, viewElement) {
  SimulationObserver.call(this, simulation);
  this.simulation = simulation;
  this.viewElement = viewElement;
  this.redrawNeeded = true;
  this.viewPort = new DOMViewPort(viewElement);
  this.camera = null;
  this.stopped = false;
}

Renderer.prototype.start = function () {
  window.requestAnimationFrame(this.tick.bind(this));
  this.stopped = false;
};

Renderer.prototype.stop = function () {
  this.unbindFromSimulation();
  this.viewPort.freeResources();
  this.stopped = true;
};

Renderer.prototype.tick = function () {
  if (this.stopped) {
    return;
  }
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

Renderer.prototype.setCamera = function (camera) {
  this.camera = camera;
};

Renderer.prototype.spaceObjectAdded = function () {
  this.redrawNeeded = true;
};

Renderer.prototype.spaceObjectRemoved = function () {
  this.redrawNeeded = true;
};