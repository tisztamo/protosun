"use strict";

/**
 * Main simulation class: handles all the game modeling.
 * @class
 */
function Simulation(fps) {
  GameEngine.call(this, fps);
  CustomEventTarget.call(this);
  this.spaceObjects = [];
  this.objectsToRemove = [];
}

Simulation.prototype = Object.create(GameEngine.prototype);
Simulation.prototype.constructor = Simulation;

Simulation.prototype.start = function() {
  this.setUpModel();
  GameEngine.prototype.start.call(this);
  this.emit("start");
};

Simulation.prototype.stop = function() {
  GameEngine.prototype.stop.call(this);
  this.emit("stop");
};

/**
 * Sets up the model.
 * @abstract
 */
Simulation.prototype.setUpModel = function() {
  console.log("Default setUpModel, you have to override it!");
};

/**
 * Adds a SpaceObject to the simulation.
 */
Simulation.prototype.addSpaceObject = function(spaceObject) {
  this.spaceObjects.push(spaceObject);
  spaceObject.simulation = this;
  this.emit("spaceobjectadded", {
    spaceObject: spaceObject
  });
};

/**
 * Marks the {@link SpaceObject} for removal. It will be removed at the end of the current step.
 */
Simulation.prototype.removeSpaceObject = function(spaceObject) {
  this.objectsToRemove.push(spaceObject);
};

/**
 * @private
 */
Simulation.prototype.purgeSpaceObjects = function() {
  var removeIdx = this.objectsToRemove.length - 1;
  while (removeIdx >= 0) {
    var objectToRemove = this.objectsToRemove[removeIdx];
    var i = this.spaceObjects.length - 1;
    while (i >= 0) {
      if (this.spaceObjects[i] === objectToRemove) {
        this.spaceObjects.splice(i, 1);
        this.emit("spaceobjectremoved", {
          spaceObject: objectToRemove
        });
        break;
      }
      i--;
    }
    removeIdx--;
  }
  this.objectsToRemove = [];
};

Simulation.prototype.oneStep = function() {
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
      if (distance < innerObject.radius + outerObject.radius - 8 && !innerObject.permeable) {
        this.emit("collision", {
          first: outerObject,
          second: innerObject
        });
      }
    }
    outerObject.oneStep();
    outerIdx++;
  }
  this.purgeSpaceObjects();

  this.emit("onesteptaken");
  GameEngine.prototype.oneStep.call(this);
};

Simulation.prototype.getState = function() {
  var state = {};
  state.spaceObjects = [];
  state.stepsTaken = this.stepsTaken;
  this.spaceObjects.forEach(function(spaceObject) {
    var so = spaceObject.clone();
    so.type = so.constructor.name;
    delete so.simulation;
    delete so.stepForce;
    delete so.rotationEnginePower;
    state.spaceObjects.push(so);
  });
  return state;
};

Simulation.prototype.setState = function(state) {
  var simulation = this;
  this.stepsTaken = state.stepsTaken || 0;
  if (state.spaceObjects) {
    state.spaceObjects.forEach(function(spaceObject) {
      simulation.addSpaceObject(SpaceObject.createFromPOJO(spaceObject));
    });
  }
  return state;
};

Simulation.defaultState = {
  "spaceObjects": [{
    "pos": {
      "x": 0,
      "y": 0
    },
    "v": {
      "x": 0,
      "y": 0
    },
    "mass": 0.1,
    "reciprocalMass": 10,
    "heading": 0,
    "angularSpeed": 0,
    "radius": 20,
    "id": "SO14",
    "enginePowered": {
      "fuel": null,
      "engineRunning": false
    },
    "permeable": false,
    "isIndestructible": false,
    "type": "SpaceShip"
  }],
  "stepsTaken": 0
};
