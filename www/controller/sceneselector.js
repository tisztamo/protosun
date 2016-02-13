"use strict";

function SceneSelector(containingViewOrElement) {
  this.model = {
    editedScenes: [{
      name: "Scene1",
      sceneDescriptor: localStorage.editedlevel
    }, {
      name: "Scene2"
    }]
  };
  this.view = new View(this.model, "sceneselector", containingViewOrElement);
  this.eventMapping = {
    loadscene: {
      click: this.loadScene.bind(this)
    },
    loadEditedScene: {
      click: this.loadEditedScene.bind(this)
    }
  };
  Controller.call(this, this.model, this.view);
  CustomEventTarget.call(this);
}

SceneSelector.prototype = Object.create(Controller.prototype);
SceneSelector.prototype.constructor = SceneSelector;

SceneSelector.prototype.loadScene = function (event) {
  var sceneName = event.target.dataset.scene;
  this.emit("sceneselected", sceneName);
};

SceneSelector.prototype.loadEditedScene = function (event) {
  var model = this.view.getModelForElement(event.target);
  var descriptor = model.sceneDescriptor;
  this.emit("editedsceneselected", descriptor);
};