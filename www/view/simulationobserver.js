/*jshint -W098 */
"use strict";

function SimulationObserver(simulation) {
  this.simulation = simulation;
  if (simulation) {
    var observer = this;

    var spaceObjectAdded = function spaceObjectAdded(event) {
      observer.spaceObjectAdded(event.detail.spaceObject);
    };

    var spaceObjectRemoved = function spaceObjectRemoved(event) {
      observer.spaceObjectRemoved(event.detail.spaceObject);
    };

    var oneStepTaken = function oneStepTaken(event) {
        observer.oneStepTaken();
      };

    if (observer.spaceObjectAdded) {
      simulation.addEventListener("spaceobjectadded", spaceObjectAdded);
    }
    if (observer.spaceObjectRemoved) {
      simulation.addEventListener("spaceobjectremoved", spaceObjectRemoved);
    }
    if (observer.oneStepTaken) {
      simulation.addEventListener("onesteptaken", oneStepTaken);
    }

    observer.unbindFromSimulation = function () {
      observer.simulation.removeEventListener("spaceobjectadded", spaceObjectAdded);
      observer.simulation.removeEventListener("spaceobjectremoved", spaceObjectRemoved);
      observer.simulation.removeEventListener("onesteptaken", oneStepTaken);
    };
  }
}