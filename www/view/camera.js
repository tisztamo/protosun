"use strict";

/**
* Base camera class. Cameras handle the change of the viewport based on
* the model changes.
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