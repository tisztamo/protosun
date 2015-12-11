"use strict";

function SimulationObserver(simulation) {
  this.simulation = simulation;
  if (simulation) {
    var observer = this;
    simulation.addEventListener("spaceobjectadded", function (event) {
      observer.spaceObjectAdded(event.detail.spaceObject);
    });
    simulation.addEventListener("spaceobjectremoved", function (event) {
      observer.spaceObjectRemoved(event.detail.spaceObject);
    });
    simulation.addEventListener("onesteptaken", observer.oneStepTaken.bind(observer));
  }
}

Mixin.mixInto(SimulationObserver);

/*jshint -W098 */

SimulationObserver.prototype.spaceObjectAdded = function (spaceObject) {
};

SimulationObserver.prototype.spaceObjectRemoved = function (spaceObject) {
};

SimulationObserver.prototype.oneStepTaken = function () {
};
