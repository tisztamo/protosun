"use strict";

function SpaceShip(pos, v, mass, heading, enginePower, fuel) {
  SpaceObject.call(this, pos, v, mass, heading);
  EnginePowered.call(this, enginePower, fuel);
  MissileLauncher.call(this);
}

SpaceShip.prototype = new SpaceObject();
SpaceShip.prototype.constructor = SpaceShip;

EnginePowered.mixInto(SpaceShip);
MissileLauncher.mixInto(SpaceShip);

SpaceShip.prototype.rotationEnginePower = 0.08;

SpaceShip.prototype.startRotationLeft = function () {
  this.angularSpeed = -this.rotationEnginePower;
};

SpaceShip.prototype.startRotationRight = function () {
  this.angularSpeed = this.rotationEnginePower;
};

SpaceShip.prototype.stopRotation = function () {
  this.angularSpeed = 0;
};