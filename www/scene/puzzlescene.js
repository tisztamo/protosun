"use strict";

function PuzzleScene(simulation, renderer) {
  Scene.call(this, simulation, renderer);
}

PuzzleScene.prototype = new Scene();
PuzzleScene.prototype.constructor = PuzzleScene;

PuzzleScene.prototype.setUpModel = function () {
  var simulation = this.simulation;
  var ship = new SpaceShip(simulation, new Vector(500, 350), new Vector(3, 0), 0.1, 0, 0.0015);
  var planet = new Planet(new Vector(400, 350), new Vector(-0.3, 0.3), 15);
  var moon = new Moon(new Vector(400, 650), new Vector(-1.3, 0.3), 1);
  var star = new FixedStar(new Vector(1400, 1050), new Vector(0, 0), 10);
  star.isIndestructible = false;
  var asteroids = [new Asteroid(new Vector(200, 0), new Vector(2, 0.1), 0.1),
  new Asteroid(new Vector(1600, 1350), new Vector(0.3, -1.52), 1),
  new Asteroid(new Vector(2900, 1750), new Vector(-0.7, -0.28), 1)];

  simulation.addSpaceObject(ship);
  simulation.addSpaceObject(planet);
  simulation.addSpaceObject(moon);
  asteroids.forEach(simulation.addSpaceObject.bind(simulation));
  simulation.addSpaceObject(star);

  var camera = new OutlineCamera(new SimpleCamera(this.simulation, this.renderer.viewPort, ship), 0, 0, 3000, 1800);
  this.renderer.setCamera(camera);

  new KeyboardController(ship, camera);
  var touchController = TouchController.createControllerFor(ship, camera);
  if (touchController) {
    this.renderer.viewElement.appendChild(touchController.view.rootElement);
  }
};