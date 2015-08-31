"use strict";

/**
* Marks the SpaceObject as the center of the simulation, for optimization purposes.
* Silently removes SpaceObjects from the simulation when they are
* too far from this object.
* Only one object with this capability should be added to a simulation.
* @TODO the SpaceShip is also removed silently, which should be handled with game over or so.
* jsdoc limitation: cannot document mixin initialization params, check the source for more info!
* @param {number} maxDistance The radius of the simulation, object farer from the simulation center will be removed silently.
* @mixin
*/
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