"use strict";

function MainController() {
  this.model = {};
  this.view = new View(this.model, "main");

  Controller.call(this, this.model, this.view);

  this.selectScene("SpaceDebrisScene");
  this.showSceneSelector();
}

MainController.prototype = Object.create(Controller.prototype);
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
  this.bindToObjective(this.scene.objective);
};

MainController.prototype.bindToObjective = function (objective) {
  if (!objective) {
    return;
  }
  this.unbindObjective();
  this.objective = objective;
  this.winHandler = (function winHandler() {
    alert("win!");
    this.showSceneSelector();
  }).bind(this);

  this.failhandler = (function failhandler(event) {
    var reason;
    try {
      reason = event.detail.lostObject.constructor.name;
    } catch (e) {}
    alert("fail: " + reason);
    this.showSceneSelector();
  }).bind(this);

  objective.addEventListener("win", this.winHandler);
  objective.addEventListener("fail", this.failhandler);
};

MainController.prototype.unbindObjective = function () {
  if (!this.objective) {
    return;
  }
  if (this.winHandler) {
    this.objective.removeEventListener("win", this.winHandler);
  }
  if (this.failHandler) {
    this.objective.removeEventListener("fail", this.failHandler);
  }
  this.objective = null;
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
  }
  this.view.rootElement.appendChild(this.sceneSelector.view.rootElement);
};

MainController.prototype.hideSceneSelector = function () {
  if (this.sceneSelector) {
    this.view.rootElement.removeChild(this.sceneSelector.view.rootElement);
  }
};