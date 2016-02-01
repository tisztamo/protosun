"use strict";

function EditorScene(simulation, renderer) {
  Scene.call(this, simulation, renderer);
}

EditorScene.prototype = Object.create(Scene.prototype);
EditorScene.prototype.constructor = EditorScene;
Scene.registerScene(EditorScene);

EditorScene.prototype.setUpModel = function () {
  var simulation = this.simulation;
  var ship = new SpaceShip(simulation, new Vector(0, 0), new Vector(0, 0), 0.1, 0);

  simulation.addSpaceObject(ship);

  var camera = new OutlineCamera(new SimpleCamera(this.simulation, this.renderer.viewPort, ship), -1024, -1024, 2048, 2048);
  camera.setOutlined(true);
  this.renderer.setCamera(camera);

  new KeyboardController(ship, camera);
};