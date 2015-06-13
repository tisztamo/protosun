"use strict";

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
  for (var j = 0; j < length; j++) {
    this.spaceObjects[j].oneStep();
  }
  this.renderer.oneStepTaken();
};