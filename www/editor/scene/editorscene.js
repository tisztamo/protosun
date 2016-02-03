"use strict";

function EditorScene(editor) {
  Scene.call(this, editor.simulation, editor.renderer);
  this.editor = editor;
}

EditorScene.prototype = Object.create(Scene.prototype);
EditorScene.prototype.constructor = EditorScene;
Scene.registerScene(EditorScene);

EditorScene.prototype.setUpModel = function () {
  var simulation = this.simulation;
  var ship;
  if (this.editor.savedState) {
    simulation.setState(this.editor.savedState);
    ship = this.simulation.spaceObjects.find(function (spaceObject) {
      return spaceObject instanceof SpaceShip;
    });
    this.editor.savedState = null;
  } else {
    ship = new SpaceShip(simulation, new Vector(0, 0), new Vector(0, 0), 0.1, 0);
    simulation.addSpaceObject(ship);
  }

  var camera = new EditorCamera(this.editor, this.simulation, this.renderer.viewPort);
  this.renderer.setCamera(camera);
};