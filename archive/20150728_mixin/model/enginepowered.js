"use strict";

function EnginePowered(enginePower, fuel, engineRunning) {
  this.fuel = fuel || Infinity;
  this.enginePower = enginePower || 0.001;
  this.engineRunning = engineRunning || false;
}

Mixin.mixInto(EnginePowered);

EnginePowered.prototype.oneStep = function () {
  if (this.engineRunning) {
    this.stepForce.add(Vector.createFromPolar(this.heading, this.enginePower));
    if (--this.fuel <= 0) {
      this.engineRunning = false;
    }
  }
  this.mixinOverride.EnginePowered.oneStep.call(this);
};

EnginePowered.prototype.startEngine = function () {
  this.engineRunning = true;
};

EnginePowered.prototype.stopEngine = function () {
  this.engineRunning = false;
};