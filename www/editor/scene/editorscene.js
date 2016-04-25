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
  var sceneDescriptor = LocalScenes.get(this.editor.localLevelIndex);
  if (this.editor.savedState) {
    simulation.setState(this.editor.savedState);
    this.editor.savedState = null;
  } else if (sceneDescriptor && sceneDescriptor !== "") {
    try {
      simulation.setState(JSON.parse(sceneDescriptor));
    } catch (e) {
      console.error("Cannot restore from state: " + sceneDescriptor);
    }
  }
  if (!simulation.spaceObjects.length) {
    simulation.addSpaceObject(new SpaceShip(simulation, new Vector(0, 0), new Vector(0, 0), 0.1, 0));
  }

  var camera = new EditorCamera(this.editor, this.simulation, this.renderer.viewPort);
  this.renderer.setCamera(camera);
};