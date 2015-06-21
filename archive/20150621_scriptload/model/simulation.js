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
  var spaceObjects = this.spaceObjects;
  for (var i = 0; i < length; i++) {
    for (var j = i + 1; j < length; j++) {
      SpaceObject.actGravityForce(spaceObjects[i], spaceObjects[j]);
    }
    spaceObjects[i].oneStep();
  }
  this.renderer.oneStepTaken();
};