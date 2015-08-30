"use strict";

/** Base class to define a scene, e.g. a level of the game.
* @param {Simulation} simulation
* @param {Renderer} renderer
* @class
* @abstract
*/
function Scene(simulation, renderer) {
  this.simulation = simulation;
  this.renderer = renderer;
  if (this.simulation) {
    this.simulation.setUpModel = this.setUpModel.bind(this);
  }
}

/**
* Sets up the scene.
* @abstract
*/
Scene.prototype.setUpModel = function () {
};