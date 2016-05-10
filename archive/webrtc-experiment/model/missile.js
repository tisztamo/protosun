"use strict";

function Missile(pos, v, heading, lifeSteps, fuel) {
  SpaceObject.call(this, pos, v, 0.001, heading);
  EnginePowered.call(this, 0.0001, fuel || 60, true);
  this.radius = 10;
  this.lifeSteps = lifeSteps || 480;
  this.detonated = false;
  this.permeable = true;// The missile detonates from a distance, no collision check needed.
}

Missile.prototype = Object.create(SpaceObject.prototype);
Missile.prototype.constructor = Missile;

Missile.prototype.oneStep = function () {
  SpaceObject.prototype.oneStep.call(this);
  --this.lifeSteps;
  if (this.lifeSteps <= 0 && !this.detonated) {
    this.simulation.removeSpaceObject(this);
    this.detonate();
  }
};

Missile.prototype.actOn = function (another, distance) {
  if (distance < another.radius + this.radius && !this.detonated && !another.permeable) {
    this.detonate(another);
  }
};

Missile.prototype.detonate = function (spaceObjectHit) {
  if (this.detonated) {
    return;
  }
  spaceObjectHit = spaceObjectHit || this;
  this.detonated = true;
  var pos = spaceObjectHit.pos;
  if (spaceObjectHit.isIndestructible) {
    pos = this.pos;
  }
  var detonation = new Detonation(pos.clone(), Vector.zero.clone());
  this.simulation.addSpaceObject(detonation);
  this.simulation.removeSpaceObject(this);
  if (!spaceObjectHit.isIndestructible) {
    this.simulation.removeSpaceObject(spaceObjectHit);
  }
};
