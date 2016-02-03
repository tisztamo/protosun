"use strict";

function Editor(containingViewOrElement) {
  this.model = {};
  this.view = new View(this.model, "editor", containingViewOrElement);

  Controller.call(this, this.model, this.view);
  CustomEventTarget.call(this);

  this.isPlaying = false;
  this.savedState = null;
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
  setTimeout(this.render.bind(this), 500); //TODO debug why this delay is needed
};

Editor.prototype.freeSimulation = function () {
  this.simulation = null;
  if (this.renderer) {
    this.renderer.stop();
    this.renderer = null;
  }
  this.scene = null;
};

Editor.prototype.freePlaySimulation = function () {
  this.playSimulation = null;
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
  this.freeSimulation();

  this.playSimulation = new Simulation(60);
  this.playRenderer = new CanvasRenderer(this.playSimulation, this.view.rootElement);
  this.playScene = new PlayScene(this);

  this.playSimulation.start();
  this.playRenderer.start();
};

Editor.prototype.edit = function() {
  this.isPlaying = false;
  this.freePlaySimulation();
  this.initSimulation();
  this.view.rootElement.classList.remove("playing");
};

Editor.prototype.restart = function() {
  this.isPlaying = false;
  this.initSimulation();
};