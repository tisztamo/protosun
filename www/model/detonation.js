"use strict";

function Detonation(pos, v) {
  SpaceObject.call(this, pos, v, -0.1);
  this.lifeSteps = 60;
}

Detonation.prototype = new SpaceObject();
Detonation.prototype.constructor = Detonation;

Detonation.prototype.oneStep = function () {
  this.stepForce = Vector.zero.clone();
  SpaceObject.prototype.oneStep.call(this);
  if (--this.lifeSteps <= 0) {
    this.simulation.removeSpaceObject(this);
  }
};
