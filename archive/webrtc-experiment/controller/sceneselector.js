"use strict";

function SceneSelector(containingViewOrElement) {
  this.model = {
    editedScenes: LocalScenes.getList().map(function (descriptor, index) {
      return {
        name: "Edited Level " + (index + 1),
        localLevelIndex: index
      };
    })
  };
  this.view = new View(this.model, this.templateId, containingViewOrElement);
  this.eventMapping = {
    loadScene: {
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

Controller.registerClass(SceneSelector);

SceneSelector.prototype.loadScene = function (event) {
  var sceneName = event.target.dataset.scene;
  this.emit("sceneselected", sceneName);
};

SceneSelector.prototype.loadEditedScene = function (event) {
  var model = this.view.getModelForElement(event.target);
  this.emit("editedsceneselected", model.localLevelIndex);
};