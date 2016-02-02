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
  var ship = new SpaceShip(simulation, new Vector(0, 0), new Vector(0, 0), 0.1, 0);

  simulation.addSpaceObject(ship);

  var camera = new EditorCamera(this.editor, this.simulation, this.renderer.viewPort);  
  this.renderer.setCamera(camera);

  new KeyboardController(ship, camera);
};