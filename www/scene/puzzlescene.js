"use strict";

function PuzzleScene(simulation, renderer) {
  Scene.call(this, simulation, renderer);
}

PuzzleScene.prototype = new Scene();
PuzzleScene.prototype.constructor = PuzzleScene;

PuzzleScene.prototype.setUpModel = function () {
  var simulation = this.simulation;
  var ship = new SpaceShip(new Vector(400, 50), new Vector(1, 0), 1, 0, 0.015, 200);
  var star = new Star(new Vector(400, 350), new Vector(0, 0), 15);
  var planet = new Planet(new Vector(400, 650), new Vector(-1, 0), 1);

  simulation.addSpaceObject(ship);
  simulation.addSpaceObject(star);
  simulation.addSpaceObject(planet);

  this.renderer.setCamera(new SimpleCamera(this.simulation, this.renderer.viewPort, ship));
  //this.renderer.viewPort.setBaseSize(2048, 1536);
  //this.renderer.viewPort.notifyViewSizeChange();

  new KeyboardController(ship);
  var touchController = TouchController.createControllerFor(ship);
  if (touchController) {
    this.renderer.viewElement.appendChild(touchController.view.rootElement);
  }
};