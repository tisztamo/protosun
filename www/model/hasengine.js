"use strict";

function HasEngine() {}

Mixin.mixInto(HasEngine);

HasEngine.enginePower = 0.001;
HasEngine.engineRunning = false;

HasEngine.oneStep = function () {
  if (this.engineRunning) {
    this.stepForce.add(Vector.createFromPolar(this.heading, this.enginePower));
  }
  this.mixinOverride.HasEngine.oneStep.call(this);
};

HasEngine.startEngine = function () {
  this.engineRunning = true;
};

HasEngine.stopEngine = function () {
  this.engineRunning = false;
};