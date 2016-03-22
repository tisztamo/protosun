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
  var ship = new SpaceShip(simulation, new Vector(800, -1100), new Vector(2.3, 0), 0.1, 0, 0.0012);
  var earth = new Earth(new Vector(800, 700), new Vector(0, 0), 210, 1510);
  earth.maxDistance = 4500;

  simulation.addSpaceObject(ship);
  simulation.addSpaceObject(earth);
  setInterval(function () {
    if (simulation.spaceObjects.length < 25) {
      var debris = scene.generateDebris(earth, 1600, 1900, scene.renderer.viewPort);
      if (debris) {
        simulation.addSpaceObject(debris);
      }
    }
  }, 10);
  
  this.objective = new ProtectObjective(simulation, [ship]);

  var camera = new OutlineCamera(new SimpleCamera(this.simulation, this.renderer.viewPort, ship), -1600, -1600, 4400, 4400);
  this.renderer.setCamera(camera);

  new KeyboardController(ship, camera);
  var touchController = TouchController.createControllerFor(ship, camera);
  if (touchController) {
    this.renderer.viewElement.appendChild(touchController.view.rootElement);
  }
};

SpaceDebrisScene.prototype.generateDebris = function (centerObject, minDistance, maxDistance, viewPort) {
  var angle = Math.random() * Math.PI * 2;
  var distance = Math.random() * (maxDistance - minDistance) + minDistance;
  var relPos = Vector.createFromPolar(angle, distance);
  var pos = centerObject.pos.clone().add(relPos);
  if (!viewPort.isInView(pos, 20)) {
    var speed = Math.sqrt((11700 + 600 * Math.random()) / distance);
    return new SpaceDebris(pos, Vector.createFromPolar(angle - Math.PI / 2, speed));
  }
};