"use strict";

/**
* Main simulation class: handles all the game modeling.
* @class
*/
function Simulation(fps) {
  GameEngine.call(this, fps);
  this.spaceObjects = [];
  this.objectsToRemove = [];
  this.renderer = null;
}

Simulation.prototype = new GameEngine();
Simulation.prototype.constructor = Simulation;

Simulation.prototype.start = function () {
  this.setUpModel();
  GameEngine.prototype.start.call(this);
};

/**
* Sets the renderer to use. This renderer wil be notified about model changes
*/
Simulation.prototype.setRenderer = function (renderer) {
  this.renderer = renderer;
};

/**
* Sets up the model.
* @abstract
*/
Simulation.prototype.setUpModel = function () {
  console.log("Default setUpModel, you have to override it!");
};

/**
* Adds a SpaceObject to the simulation. Will trigger rendering it with the current renderer.
*/
Simulation.prototype.addSpaceObject = function (spaceObject) {
  this.spaceObjects.push(spaceObject);
  spaceObject.simulation = this;
  if (this.renderer) {
    this.renderer.spaceObjectAdded(spaceObject);
  }
};

/**
* Marks the {@link SpaceObject} for removal. It will be removed at the end of the current step.
*/
Simulation.prototype.removeSpaceObject = function (spaceObject) {
  this.objectsToRemove.push(spaceObject);
};

/**
* @private
*/
Simulation.prototype.purgeSpaceObjects = function () {
  var removeIdx = this.objectsToRemove.length - 1;
  while (removeIdx >= 0) {
    var objectToRemove = this.objectsToRemove[removeIdx];
    var i = this.spaceObjects.length - 1;
    while (i >= 0) {
      if (this.spaceObjects[i] === objectToRemove) {
        this.spaceObjects.splice(i, 1);
        this.renderer.spaceObjectRemoved(objectToRemove);
        break;
      }
      i--;
    }
    removeIdx--;
  }
  this.objectsToRemove = [];
};

Simulation.prototype.oneStep = function () {
  var length = this.spaceObjects.length;
  var spaceObjects = this.spaceObjects;
  var outerIdx = 0;
  var innerObject, outerObject;
  var distance;
  while (outerIdx < length) {
    outerObject = spaceObjects[outerIdx];
    for (var j = outerIdx + 1; j < length; j++) {
      innerObject = spaceObjects[j];
      distance = SpaceObject.actGravityForce(outerObject, innerObject);
      outerObject.actOn(innerObject, distance);
      innerObject.actOn(outerObject, distance);
    }
    outerObject.oneStep();
    outerIdx++;
  }
  this.purgeSpaceObjects();
  this.renderer.oneStepTaken();
  GameEngine.prototype.oneStep.call(this);
};