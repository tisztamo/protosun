"use strict";

function SpaceShip(simulation, pos, v, mass, heading, enginePower, fuel) {
  SpaceObject.call(this, pos, v, mass, heading);
  EnginePowered.call(this, enginePower, fuel);
  MissileLauncher.call(this);
  this.radius = 20;
  var fps = simulation ? simulation.fps : 60;
  this.rotationEnginePower = 0.03 / fps * 100;
}

SpaceShip.prototype = Object.create(SpaceObject.prototype);
SpaceShip.prototype.constructor = SpaceShip;

SpaceShip.prototype.startRotationLeft = function () {
  this.angularSpeed = -this.rotationEnginePower;
};

SpaceShip.prototype.startRotationRight = function () {
  this.angularSpeed = this.rotationEnginePower;
};

SpaceShip.prototype.stopRotation = function () {
  this.angularSpeed = 0;
};