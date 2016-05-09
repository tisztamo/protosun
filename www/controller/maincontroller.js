"use strict";

function MainController(containingElement) {
  this.model = {};
  Controller.call(this, this.model, containingElement);

  this.selectScene("SpaceDebrisScene");
  this.showSceneSelector();
}

MainController.prototype = Object.create(Controller.prototype);
MainController.prototype.constructor = MainController;

Controller.registerClass(MainController, "Main");

MainController.prototype.selectScene = function (sceneNameOrEvent) {
  this.hideSceneSelector();
  this.removeSimulation();

  var sceneName = sceneNameOrEvent;
  if (typeof sceneNameOrEvent === "object") {
    sceneName = sceneNameOrEvent.detail;
  }

  this.simulation = new Simulation(60);
  this.renderer = new CanvasRenderer(this.simulation, document.body);
  this.scene = Scene.createScene(sceneName, this.simulation, this.renderer);
  this.debugView = new DebugView(this.simulation, this.renderer, this.view);

  this.simulation.start();
  this.renderer.start();
  this.bindToObjective(this.scene.objective);
};

MainController.prototype.editedSceneSelectedHandler = function (event) {
  var sceneDescriptor;
  try {
    this.hideSceneSelector();
    this.removeSimulation();

    var index = event.detail;
    sceneDescriptor = LocalScenes.get(index);

    if (typeof sceneDescriptor === "string") {
      sceneDescriptor = JSON.parse(sceneDescriptor);
    }

    this.simulation = new Simulation(60);
    this.renderer = new CanvasRenderer(this.simulation, document.body);
    this.scene = new PlayScene(this.simulation, this.renderer, sceneDescriptor);

    this.simulation.start();
    this.renderer.start();
  } catch (e) {
    console.error("Unable to start scene " + sceneDescriptor);
    this.showSceneSelector();
  }
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
    var mainController = this;
    try {
      reason = event.detail.lostObject.constructor.name;
    } catch (e) {}
    setTimeout(function() {
      alert("fail: " + reason);
      mainController.showSceneSelector();
    }, 1000);
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
    this.debugView.rootElement.parentNode.removeChild(this.debugView.rootElement);
    this.debugView = null;
  }
  this.scene = null;
};

MainController.prototype.showSceneSelector = function () {
  if (!this.sceneSelector) {
    this.sceneSelector = new SceneSelector(this.view);
    this.sceneSelector.addEventListener("sceneselected", this.selectScene.bind(this));
    this.sceneSelector.addEventListener("editedsceneselected", this.editedSceneSelectedHandler.bind(this));
  } else {
    this.view.rootElement.appendChild(this.sceneSelector.view.rootElement);
  }
};

MainController.prototype.hideSceneSelector = function () {
  if (this.sceneSelector) {
    this.view.rootElement.removeChild(this.sceneSelector.view.rootElement);
  }
};
