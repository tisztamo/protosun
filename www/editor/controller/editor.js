"use strict";

function Editor(containingViewOrElement) {
  this.model = {};
  this.view = new View(this.model, "editor", containingViewOrElement);

  Controller.call(this, this.model, this.view);
  CustomEventTarget.call(this);

  this.isPlaying = false;
  this.savedState = null;
  this.initSimulation();
  this.edit();

  this.initControls();
}

Editor.prototype = Object.create(Controller.prototype);
Editor.prototype.constructor = Editor;

Editor.prototype.initControls = function () {
  this.toolbar = new Toolbar(this, this.view);
  this.propertyEditor = new PropertyEditor(this, this.view);
  this.selector = new SelectorController(this, this.view);
  this.dragger = new DragController(this);
  this.playControls = new PlayControls(this, this.view);
};

Editor.prototype.initSimulation = function () {
  this.simulation = new Simulation();
  this.renderer = new EditorRenderer(this, this.view.rootElement);
  this.scene = new EditorScene(this);
  this.simulation.setUpModel();
  this.renderer.start();
  this.imageLoadEventListener = this.render.bind(this);
  CanvasView.addEventListener("load", this.imageLoadEventListener);
  this.render();
};

Editor.prototype.freeSimulation = function () {
  if (this.simulation) {
    this.simulation.stop();
    this.simulation = null;
  }
  if (this.renderer) {
    this.renderer.stop();
    this.renderer = null;
  }
  this.scene = null;
  CanvasView.removeEventListener("load", this.imageLoadEventListener);
  this.imageLoadEventListener = null;
};

Editor.prototype.freePlaySimulation = function () {
  if (this.playSimulation) {
    this.playSimulation.stop();
    this.playSimulation = null;
  }
  if (this.playRenderer) {
    this.playRenderer.stop();
    this.playRenderer = null;
  }
  this.playScene = null;
};

Editor.prototype.selectSpaceObject = function (spaceObject) {
  this.selectedObject = spaceObject;
  this.emit("selected", spaceObject);
  this.render();
};

Editor.prototype.addSpaceObject = function (spaceObject) {
  this.simulation.addSpaceObject(spaceObject);
  this.selectSpaceObject(spaceObject);
};

Editor.prototype.render = function () {
  this.renderer.redrawNeeded = true;
};

Editor.prototype.play = function () {
  this.isPlaying = true;
  this.view.rootElement.classList.add("playing");

  this.savedState = this.simulation.getState();
  console.log(JSON.stringify(this.savedState));
  localStorage.editedlevel = JSON.stringify(this.savedState);

  this.playSimulation = new Simulation(60);
  this.playRenderer = new CanvasRenderer(this.playSimulation, this.view.rootElement);
  this.playScene = new PlayScene(this.playSimulation, this.playRenderer, this.savedState);

  this.playSimulation.start();
  this.playRenderer.start();
};

Editor.prototype.edit = function () {
  this.isPlaying = false;
  this.freePlaySimulation();
  this.view.rootElement.classList.remove("playing");
  this.render();
};

Editor.prototype.restart = function () {
  this.isPlaying = false;
  this.initSimulation();
};

Editor.prototype.isPointerEventOnScene = function (event) {
  return this.renderer && event.target === this.renderer.canvas;
};