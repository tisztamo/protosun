"use strict";

function Earth(pos, v, mass, radius) {
  SpaceObject.call(this, pos, v, mass);
  this.radius = radius;
  SimulationCenter.call(this);
}

Earth.prototype = new SpaceObject();
Earth.prototype.constructor = Earth;

Earth.prototype.actOn = function (another, distance) {
  if (!another.permeable && distance < this.radius) {
    var detonation = new Detonation(another.pos.clone(), Vector.zero.clone());
    this.simulation.addSpaceObject(detonation);
    this.simulation.removeSpaceObject(another);
  }
};

SimulationCenter.mixInto(Earth);