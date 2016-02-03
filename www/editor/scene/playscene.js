"use strict";

function PlayScene(editor) {
  Scene.call(this, editor.playSimulation, editor.playRenderer);
  this.editor = editor;
}

PlayScene.prototype = Object.create(Scene.prototype);
PlayScene.prototype.constructor = PlayScene;
Scene.registerScene(PlayScene);

PlayScene.prototype.setUpModel = function () {
  this.simulation.setState(this.editor.savedState);
  var ship = this.simulation.spaceObjects.find(function (spaceObject) {
    return spaceObject instanceof SpaceShip;
  });
  var camera = new SimpleCamera(this.simulation, this.renderer.viewPort, ship);
  this.renderer.setCamera(camera);

  new KeyboardController(ship, camera);
};