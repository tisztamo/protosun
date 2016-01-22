"use strict";

function MainController() {
  this.model = {};
  this.view = new View(this.model, "main");
  this.eventMapping = {
    /*loadscene: {
      click: this.loadScene.bind(this),
    }*/
  };
  Controller.call(this, this.model, this.view);

  this.selectScene("SpaceDebrisScene");
  this.showSceneSelector();
}

MainController.prototype = new Controller();
MainController.prototype.constructor = MainController;

MainController.prototype.selectScene = function (sceneNameOrEvent) {
  this.hideSceneSelector();
  this.removeSimulation();

  var sceneName = sceneNameOrEvent;
  if (typeof sceneNameOrEvent === "object") {
    sceneName = sceneNameOrEvent.detail;
  }

  this.simulation = new Simulation(60);
  var area = document.getElementById('area');
  this.renderer = new CanvasRenderer(this.simulation, area);
  this.scene = Scene.createScene(sceneName, this.simulation, this.renderer);
  this.debugView = new DebugView(this.simulation, this.renderer);
  document.body.appendChild(this.debugView.rootElement);

  this.simulation.start();
  this.renderer.start();
};


MainController.prototype.removeSimulation = function () {
  if (!this.simulation) {
    return;
  }
  this.simulation.stop();
  this.simulation = null;

  this.renderer.stop();
  this.renderer = null;

  if (this.debugView) {
    document.body.removeChild(this.debugView.rootElement);
    this.debugView = null;
  }
  this.scene = null;
};

MainController.prototype.showSceneSelector = function () {
  if (!this.sceneSelector) {
    this.sceneSelector = new SceneSelector();
    this.sceneSelector.addEventListener("sceneselected", this.selectScene.bind(this));
    this.view.rootElement.appendChild(this.sceneSelector.view.rootElement);
  }
};

MainController.prototype.hideSceneSelector = function () {
  if (this.sceneSelector) {
    this.view.rootElement.removeChild(this.sceneSelector.view.rootElement);
  }
};