"use strict";

function FuelPack(pos, v, storedFuel) {
  SpaceObject.call(this, pos, v, 0.001);
  this.radius = 10;
  this.storedFuel = storedFuel || 2000;
}

FuelPack.prototype = Object.create(SpaceObject.prototype);
FuelPack.prototype.constructor = FuelPack;

FuelPack.prototype.actOn = function (another, distance) {
  if (this.storedFuel > 0 && distance < another.radius + this.radius && another.enginePowered) {
    this.tankTo(another);
  }
};

FuelPack.prototype.tankTo = function(another) {
  another.enginePowered.fuel += this.storedFuel;
  this.storedFuel = 0;
  this.simulation.removeSpaceObject(this);
};
