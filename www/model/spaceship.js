"use strict";

function SpaceShip(pos, v, mass, heading) {
  SpaceObject.call(this, pos, v, mass, heading);
}

SpaceShip.prototype = new SpaceObject();
SpaceShip.prototype.constructor = SpaceShip;

HasEngine.mixInto(SpaceShip);

SpaceShip.prototype.rotationEnginePower = 0.03;

SpaceShip.prototype.startRotationLeft = function () {
  this.angularSpeed = -this.rotationEnginePower;
};

SpaceShip.prototype.startRotationRight = function () {
  this.angularSpeed = this.rotationEnginePower;
};

SpaceShip.prototype.stopRotation = function () {
  this.angularSpeed = 0;
};

SpaceShip.prototype.launchMissile = function () {
  var direction = Vector.createFromPolar(this.heading, 1);
  var pos = this.pos.clone().add(direction.clone().multiply(35));
  var v = this.v.clone();
  var missile = new Missile(pos, v, this.heading);
  this.simulation.addSpaceObject(missile);
};