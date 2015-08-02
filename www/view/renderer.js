"use strict";

function Renderer(simulation) {
  this.simulation = simulation;
  this.redrawNeeded = true;
  this.viewPort = new ViewPort();
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
};