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
  var ship = new SpaceShip(simulation, new Vector(400, -550), new Vector(2.3, 0), 0.1, 0, 0.0012);
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
  
  this.objective = new ProtectObjective(simulation, [ship]);

  var camera = new OutlineCamera(new SimpleCamera(this.simulation, this.renderer.viewPort, ship), -800, -800, 2200, 2200);
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
    var speed = Math.sqrt((5400 + 600 * Math.random()) / distance);
    return new SpaceDebris(pos, Vector.createFromPolar(angle - Math.PI / 2, speed));
  }
};