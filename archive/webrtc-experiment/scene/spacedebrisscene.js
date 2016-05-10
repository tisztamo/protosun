"use strict";

function SpaceDebrisScene(simulation, renderer) {
  Scene.call(this, simulation, renderer);
}

SpaceDebrisScene.prototype = Object.create(Scene.prototype);
SpaceDebrisScene.prototype.constructor = SpaceDebrisScene;
Scene.registerScene(SpaceDebrisScene);

SpaceDebrisScene.prototype.setUpModel = function () {
  var simulation = this.simulation;
  var scene = this;
  var ship = new SpaceShip(simulation, new Vector(400, -550), new Vector(3.3, 0), 0.1, 0, 0.0012, 600);
  var earth = new Earth(new Vector(400, 350), new Vector(0, 0), 210, 755);
  earth.maxDistance = 2500;
  var fuel = new FuelPack(new Vector(500, -580), new Vector(3.2, 0));

  simulation.addSpaceObject(ship);
  simulation.addSpaceObject(earth);
  simulation.addSpaceObject(fuel);
  setInterval(function () {
    if (simulation.spaceObjects.length < 25) {
      scene.generateObject(earth);
    }
  }, 10);

  this.objective = new ProtectObjective(simulation, [ship]);

  var camera = new OutlineCamera(new SimpleCamera(this.simulation, this.renderer.viewPort, ship), 400-1200, 350-1200, 2400, 2400);
  this.renderer.setCamera(camera);

  new KeyboardController(ship, camera);
  var touchController = TouchController.createControllerFor(ship, camera);
  if (touchController) {
    this.renderer.viewElement.appendChild(touchController.view.rootElement);
  }
};

SpaceDebrisScene.prototype.generateObject = function (earth) {
  var generatedObj = null;
  if (Math.random() > 0.15) {
    generatedObj = this.placeRandomly(new SpaceDebris(), earth, 800, 1100, this.renderer.viewPort);
  } else {
    generatedObj = this.placeRandomly(new FuelPack(), earth, 800, 1100, this.renderer.viewPort);
  }
  if (generatedObj) {
    this.simulation.addSpaceObject(generatedObj);
  }
};

SpaceDebrisScene.prototype.placeRandomly = function (objectToPlace, centerObject, minDistance, maxDistance, viewPort) {
  var angle = Math.random() * Math.PI * 2;
  var distance = Math.random() * (maxDistance - minDistance) + minDistance;
  var relPos = Vector.createFromPolar(angle, distance);
  var pos = centerObject.pos.clone().add(relPos);
  if (!viewPort.isInView(pos, 20)) {
    var speed = Math.sqrt((10000 + 500 * Math.random()) / distance);
    objectToPlace.pos = pos;
    objectToPlace.v = Vector.createFromPolar(angle - Math.PI / 2, -speed);
    return objectToPlace;
  }
  return null;
};