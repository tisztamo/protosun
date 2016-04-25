"use strict";

function GravityAssistScene(simulation, renderer) {
  Scene.call(this, simulation, renderer);
}

GravityAssistScene.prototype = Object.create(Scene.prototype);
GravityAssistScene.prototype.constructor = GravityAssistScene;
Scene.registerScene(GravityAssistScene);

GravityAssistScene.descriptor = {
  "spaceObjects": [{
    "pos": {
      "x": -578.8176466899788,
      "y": 1164.4366574046458
    },
    "v": {
      "x": 0,
      "y": 0
    },
    "mass": 0.1,
    "heading": 0,
    "angularSpeed": 0,
    "radius": 20,
    "id": "SO14",
    "enginePowered": {
      "fuel": null,
      "engineRunning": false,
      "enginePower": 0.0003
    },
    "reciprocalMass": 10,
    "permeable": false,
    "isIndestructible": false,
    "type": "SpaceShip"
  }, {
    "pos": {
      "x": 2081.714285714285,
      "y": 1040.2733516483515
    },
    "v": {
      "x": -1,
      "y": -1
    },
    "mass": 20,
    "heading": 0,
    "angularSpeed": 0,
    "radius": 80,
    "id": "SO94",
    "permeable": false,
    "isIndestructible": false,
    "type": "Planet"
  }, {
    "pos": {
      "x": 497.543269230801,
      "y": -1769.4069368132118
    },
    "v": {
      "x": -0.034,
      "y": 1
    },
    "mass": 1.1,
    "heading": 0,
    "angularSpeed": 0,
    "radius": 20,
    "id": "SO891",
    "isIndestructible": true,
    "permeable": false,
    "type": "Moon"
  }, {
    "pos": {
      "x": 49.832959880704244,
      "y": 1664.5328729758112
    },
    "v": {
      "x": -0.296,
      "y": -1.302
    },
    "mass": 2,
    "heading": 0,
    "angularSpeed": 0,
    "radius": 15,
    "id": "SO251",
    "permeable": false,
    "isIndestructible": true,
    "type": "Moon"
  }],
  "stepsTaken": 0
};

GravityAssistScene.prototype.setUpModel = function () {
  var simulation = this.simulation;

  simulation.setState(GravityAssistScene.descriptor);
  var ship = simulation.spaceObjects[0];

  var objectToProtect = simulation.spaceObjects.map(function (spaceObject) {
    spaceObject.actOn = function (another, distance) {
      if (distance < another.radius + spaceObject.radius - 8 && !another.permeable) {
        simulation.removeSpaceObject(spaceObject);
      }
    };
    return spaceObject;
  });

  this.objective = new ProtectObjective(simulation, objectToProtect, 1900);
  var camera = new OutlineCamera(new SimpleCamera(this.simulation, this.renderer.viewPort, ship), -1000, -1500, 2000, 2800);
  this.renderer.setCamera(camera);

  new KeyboardController(ship, camera);
  var touchController = TouchController.createControllerFor(ship, camera);
  if (touchController) {
    this.renderer.viewElement.appendChild(touchController.view.rootElement);
  }
};