"use strict";

function SpaceShip(pos, v, mass, heading) {
  SpaceObject.call(this, pos, v, mass, heading);
  this.engineRunning = false;
}

SpaceShip.prototype = new SpaceObject();
SpaceShip.prototype.constructor = SpaceShip;

SpaceShip.prototype.mainEnginePower = 0.001;
SpaceShip.prototype.rotationEnginePower = 0.03;

SpaceShip.prototype.oneStep = function () {
  if (this.engineRunning) {
    this.stepForce.add(Vector.createFromPolar(this.heading, this.mainEnginePower));
  }
  
  SpaceObject.prototype.oneStep.call(this);
};

SpaceShip.prototype.startRotationLeft = function () {
  this.angularSpeed = -this.rotationEnginePower;
};

SpaceShip.prototype.startRotationRight = function () {
  this.angularSpeed = this.rotationEnginePower;
};

SpaceShip.prototype.stopRotation = function () {
  this.angularSpeed = 0;
};

SpaceShip.prototype.startEngine = function () {
  this.engineRunning = true;
};

SpaceShip.prototype.stopEngine = function () {
  this.engineRunning = false;
};

SpaceShip.prototype.launchMissile = function () {
  var direction = Vector.createFromPolar(this.heading, 1);
  var pos = this.pos.clone().add(direction.clone().multiply(40)).add(this.v);
  var v = this.v.clone().add(direction.clone().multiply(3));
  var missile = new Missile(pos, v, this.heading);
  this.simulation.addSpaceObject(missile);
};