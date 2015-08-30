"use strict";

/**
* Propulsion engine capability, can be mixed into {@link SpaceObject}s.
* jsdoc limitation: cannot document mixin initialization params, check the source for more info!
* @param {number} enginePower - the force that is generated by the engine. Direction of the force is based on the heading of the object.
* @param {number} fuel - Fuel is used while the engine is running, 1 unit per simulation step. This is the initial value.
* @param {boolean} engineRunning - Initial state of the engine.
* @mixin
*/
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