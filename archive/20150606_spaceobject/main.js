"use strict";

var simulation = new Simulation();

simulation.setUpModel = function () {
  this.addSpaceObject(new SpaceObject(new Vector(0, 0), new Vector(0.1, -0.05)));
  this.addSpaceObject(new SpaceObject(new Vector(0, 0), new Vector(-0.02, 0.03)));
};

simulation.start();

var originalOneStep = SpaceObject.prototype.oneStep;
SpaceObject.prototype.oneStep = function () {
  originalOneStep.call(this);
  console.log("Id: " + this.id + "; Position: " + this.pos);
};

setInterval(function () {
  SpaceObject.prototype.oneStep = originalOneStep;
}, 1000);