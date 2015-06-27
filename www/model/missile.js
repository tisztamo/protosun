"use strict";

function Missile(pos, v, heading, lifeSteps) {
  SpaceObject.call(this, pos, v, 0.001, heading);
  this.lifeSteps = lifeSteps || 480;
  this.detonated = false;
}

Missile.prototype = new SpaceObject();
Missile.prototype.constructor = Missile;

Missile.prototype.oneStep = function () {
  SpaceObject.prototype.oneStep.call(this);
  if (--this.lifeSteps <= 0 && !this.detonated) {
    this.detonate();
  }
};

Missile.prototype.actOn = function (another, distance) {
  if (distance < 20 && !this.detonated) {
    this.detonate(another);
  }
};

Missile.prototype.detonate = function (spaceObjectHit) {
  if (this.detonated) {
    return;
  }
  spaceObjectHit = spaceObjectHit || this;
  this.detonated = true;
  var detonation = new Detonation(spaceObjectHit.pos.clone(), Vector.zero.clone());
  this.simulation.addSpaceObject(detonation);
  this.simulation.removeSpaceObject(this);
  if (!(spaceObjectHit instanceof Star)) {
    this.simulation.removeSpaceObject(spaceObjectHit);
  }
};