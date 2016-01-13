/*jshint -W098 */
"use strict";

function SimulationObserver(simulation) {
  this.simulation = simulation;
  if (simulation) {
    var observer = this;
    if (observer.spaceObjectAdded) {
      simulation.addEventListener("spaceobjectadded", function (event) {
        observer.spaceObjectAdded(event.detail.spaceObject);
      });
    }
    if (observer.spaceObjectRemoved) {
      simulation.addEventListener("spaceobjectremoved", function (event) {
        observer.spaceObjectRemoved(event.detail.spaceObject);
      });
    }
    if (observer.oneStepTaken) {
      simulation.addEventListener("onesteptaken", function (event) {
        observer.oneStepTaken();
      });
    }
  }
}