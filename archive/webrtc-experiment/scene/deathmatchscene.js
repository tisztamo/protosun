"use strict";

function DeathMatchScene(simulation, renderer) {
  this.connection = RTCConnectionManager.getConnection();
  Scene.call(this, simulation, renderer);
}

DeathMatchScene.prototype = Object.create(Scene.prototype);
DeathMatchScene.prototype.constructor = DeathMatchScene;
Scene.registerScene(DeathMatchScene);


DeathMatchScene.prototype.setUpModel = function () {
  var simulation = this.simulation;
  this.distributor = new SimulationDistributor(this.simulation, this.connection);
  var ship = new SpaceShip(simulation, new Vector(500, 350), new Vector(3, 0), 0.1, 0);
  simulation.addSpaceObject(ship);
  this.createWorld();
  var objectsToProtect = [ship];
  this.addProtectedObjects(objectsToProtect);
  this.objective = new ProtectObjective(simulation, objectsToProtect);
  var camera = new OutlineCamera(new SimpleCamera(this.simulation, this.renderer.viewPort, ship), 0, 0, 3000, 1800);
  this.renderer.setCamera(camera);

  this.keyboardController = new KeyboardController(ship, camera);
  this.touchController = TouchController.createControllerFor(ship, camera);
  if (this.touchController) {
    this.renderer.viewElement.appendChild(this.touchController.view.rootElement);
  }
};

DeathMatchScene.prototype.createWorld = function () {
  var star = new FixedStar(new Vector(1400, 1050), new Vector(0, 0), 10);
  this.simulation.addSpaceObject(star);
};