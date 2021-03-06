"use strict";

function PlayScene(simulation, renderer, sceneDescriptor) {
  Scene.call(this, simulation, renderer);
  this.descriptor = sceneDescriptor;
}

PlayScene.prototype = Object.create(Scene.prototype);
PlayScene.prototype.constructor = PlayScene;
Scene.registerScene(PlayScene);

PlayScene.prototype.setUpModel = function () {
  this.simulation.setState(this.descriptor);
  var ship = this.simulation.spaceObjects.find(function (spaceObject) {
    return spaceObject instanceof SpaceShip;
  });
  var camera = new OutlineCamera(new SimpleCamera(this.simulation, this.renderer.viewPort, ship), -1500, -1500, 3000, 3000);
  this.renderer.setCamera(camera);

  new KeyboardController(ship, camera);
  var touchController = TouchController.createControllerFor(ship, camera);
  if (touchController) {
    this.renderer.viewElement.appendChild(touchController.view.rootElement);
  }
};