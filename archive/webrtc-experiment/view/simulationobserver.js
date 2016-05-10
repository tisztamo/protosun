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

    var collision = function collision(event) {
      observer.collision();
    };

    var simulationStopped = function simulationStopped(event) {
      if (observer.simulationStopped) {
        observer.simulationStopped();        
      }
      observer.unbindFromSimulation();
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
    if (observer.collision) {
      simulation.addEventListener("collision", collision);
    }

    simulation.addEventListener("stop", simulationStopped);

    observer.unbindFromSimulation = function () {
      observer.simulation.removeEventListener("spaceobjectadded", spaceObjectAdded);
      observer.simulation.removeEventListener("spaceobjectremoved", spaceObjectRemoved);
      observer.simulation.removeEventListener("onesteptaken", oneStepTaken);
      observer.simulation.removeEventListener("collision", collision);
      observer.simulation.removeEventListener("stop", simulationStopped);
    };
  }
}