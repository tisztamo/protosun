"use strict";

function SimulationCenter(maxDistance) {
  this.maxDistance = maxDistance || Infinity;
}

Mixin.mixInto(SimulationCenter);

SimulationCenter.prototype.actOn = function (another, distance) {
  if (distance > this.maxDistance) {
    this.simulation.removeSpaceObject(another);
  }
  if (this.mixinOverride.SimulationCenter.actOn) {
    this.mixinOverride.SimulationCenter.actOn.call(this, another, distance);
  }
};