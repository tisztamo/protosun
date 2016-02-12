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
  if (this.editor.savedState) {
    simulation.setState(this.editor.savedState);
    this.editor.savedState = null;
  } else if (localStorage.editedlevel && localStorage.editedlevel !== "") {
    try {
      simulation.setState(JSON.parse(localStorage.editedlevel));
    } catch (e) {
      console.error("Cannot restore from state: " + localStorage.editedlevel);
      localStorage.editedLevel = "";
    }
  }
  if (!simulation.spaceObjects.length) {
    simulation.addSpaceObject(new SpaceShip(simulation, new Vector(0, 0), new Vector(0, 0), 0.1, 0));
  }

  var camera = new EditorCamera(this.editor, this.simulation, this.renderer.viewPort);
  this.renderer.setCamera(camera);
};