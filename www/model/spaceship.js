"use strict";

function SpaceShip(pos, v, mass, heading) {
  SpaceObject.call(this, pos, v, mass, heading);
  this.engineRunning = false;
}

SpaceShip.prototype = new SpaceObject();
SpaceShip.prototype.constructor = SpaceShip;

SpaceShip.prototype.mainEnginePower = 0.003;
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