"use strict";

function HasEngine() {}

Mixin.mixInto(HasEngine);

HasEngine.prototype.enginePower = 0.001;
HasEngine.prototype.engineRunning = false;

HasEngine.prototype.oneStep = function () {
  if (this.engineRunning) {
    this.stepForce.add(Vector.createFromPolar(this.heading, this.enginePower));
  }
  this.mixinOverride.HasEngine.oneStep.call(this);
};

HasEngine.prototype.startEngine = function () {
  this.engineRunning = true;
};

HasEngine.prototype.stopEngine = function () {
  this.engineRunning = false;
};