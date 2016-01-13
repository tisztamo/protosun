/*jshint -W098 */
"use strict";

function SimulationObserver(simulation) {
  this.simulation = simulation;
  if (simulation) {
    var observer = this;
    simulation.addEventListener("spaceobjectadded", function (event) {
      if (observer.spaceObjectAdded) {
        observer.spaceObjectAdded(event.detail.spaceObject);
      }
    });
    simulation.addEventListener("spaceobjectremoved", function (event) {
      if (observer.spaceObjectRemoved) {
        observer.spaceObjectRemoved(event.detail.spaceObject);
      }
    });
    simulation.addEventListener("onesteptaken", function (event) {
      if (observer.oneStepTaken) {
        observer.oneStepTaken();
      }
    });
  }
}