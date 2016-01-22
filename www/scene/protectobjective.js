"use strict";

function ProtectObjective(simulation, protectedObjects, winAtStep) {
  Objective.call(this, simulation, winAtStep);
  this.protectedObjects = protectedObjects;
}

ProtectObjective.prototype = Object.create(Objective.prototype);

ProtectObjective.prototype.spaceObjectRemoved = function (spaceObject) {
  if (this.protectedObjects.indexOf(spaceObject) !== -1) {
    this.emitFail({
      lostObject: spaceObject
    });
  }
};