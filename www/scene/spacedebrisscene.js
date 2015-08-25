"use strict";

function SpaceDebrisScene(simulation, renderer) {
  Scene.call(this, simulation, renderer);
}

SpaceDebrisScene.prototype = new Scene();
SpaceDebrisScene.prototype.constructor = SpaceDebrisScene;

SpaceDebrisScene.prototype.setUpModel = function () {
  var simulation = this.simulation;
  var scene = this;
  var ship = new SpaceShip(new Vector(400, -550), new Vector(2.3, 0), 0.1, 0);
  var earth = new Earth(new Vector(400, 350), new Vector(0, 0), 105, 755);
  earth.maxDistance = 4000;

  simulation.addSpaceObject(ship);
  simulation.addSpaceObject(earth);
  setInterval(function () {
    if (simulation.spaceObjects.length < 25) {
      var debris = scene.generateDebris(earth, 800, 1200, scene.renderer.viewPort);
      if (debris) {
        simulation.addSpaceObject(debris);
      }
    }
  }, 1500);
  this.renderer.setCamera(new SimpleCamera(this.simulation, this.renderer.viewPort, ship));

  new KeyboardController(ship);
  TouchController.createControllerFor(ship, this.renderer.targetElement);
};

SpaceDebrisScene.prototype.generateDebris = function (centerObject, minDistance, maxDistance, viewPort) {
  var angle = Math.random() * Math.PI * 2;
  var distance = Math.random() * (maxDistance - minDistance) + minDistance;
  var relPos = Vector.createFromPolar(angle, distance);
  var pos = centerObject.pos.clone().add(relPos);
  if (!viewPort.isOnScreen(pos, 20)) {
    var speed = Math.sqrt((5400 + 600 * Math.random()) / distance);
    return new SpaceDebris(pos, Vector.createFromPolar(angle - Math.PI / 2, speed));
  }
};