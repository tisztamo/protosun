"use strict";

function Missile(pos, v, heading, lifeSteps, fuel) {
  SpaceObject.call(this, pos, v, 0.001, heading);
  this.lifeSteps = lifeSteps || 480;
  this.fuel = fuel || 55;
  this.detonated = false;
  this.engineRunning = true;
}

Missile.prototype = new SpaceObject();
Missile.prototype.constructor = Missile;

Missile.prototype.mainEnginePower = 0.0001;

Missile.prototype.oneStep = function () {
  SpaceObject.prototype.oneStep.call(this);
  --this.lifeSteps;
  if (this.lifeSteps <= 0 && !this.detonated) {
    this.simulation.removeSpaceObject(this);
  }
  if (this.engineRunning) {
    this.stepForce.add(Vector.createFromPolar(this.heading, this.mainEnginePower));
    if (--this.fuel <= 0) {
      this.engineRunning = false;
    }
  }
};

Missile.prototype.actOn = function (another, distance) {
  if (distance < 30 && !this.detonated && !another.permeable) {
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