"use strict";

/**
* Base camera class. Cameras change the viewport based on
* model changes.
* 
* @class
* @abstract
*/
function Camera(simulation, viewPort) {
  this.simulation = simulation;
  this.viewPort = viewPort;
}

/**
* Updates the {@link ViewPort} based on the current state of the simulation
* @abstract
*/
Camera.prototype.updateView = function () {
};