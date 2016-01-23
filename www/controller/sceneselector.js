"use strict";

function SceneSelector() {
  this.model = {};
  this.view = new View(this.model, "sceneselector");
  this.eventMapping = {
    loadscene: {
      click: this.loadScene.bind(this),
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