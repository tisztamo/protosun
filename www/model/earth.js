"use strict";

function Earth(pos, v, mass, radius) {
  SpaceObject.call(this, pos, v, mass);
  this.radius = radius;
  SimulationCenter.call(this);
}

Earth.prototype = Object.create(SpaceObject.prototype);
Earth.prototype.constructor = Earth;

Earth.prototype.isIndestructible = true;

Earth.prototype.oneStep = function () {
  this.stepForce = Vector.zero.clone();
  SpaceObject.prototype.oneStep.call(this);
};

Earth.prototype.actOn = function (another, distance) {
  if (!another.permeable && distance < this.radius + another.radius - 10) {
    var detonation = new Detonation(another.pos.clone(), Vector.zero.clone());
    this.simulation.addSpaceObject(detonation);
    this.simulation.removeSpaceObject(another);
  }
};
