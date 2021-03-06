"use strict";

function Detonation(pos, v) {
  SpaceObject.call(this, pos, v, -0.15);
  this.permeable = true;
  this.lifeSteps = 100;
}

Detonation.prototype = Object.create(SpaceObject.prototype);
Detonation.prototype.constructor = Detonation;

Detonation.prototype.oneStep = function () {
  this.stepForce = Vector.zero.clone();
  SpaceObject.prototype.oneStep.call(this);
  if (--this.lifeSteps <= 0) {
    this.simulation.removeSpaceObject(this);
  }
};

Detonation.createFromSpaceObject = function (spaceObject) {
  return new Detonation(spaceObject.pos.clone(), Vector.zero.clone());
};