"use strict";

function Editor(containingViewOrElement) {
  this.model = {};
  this.view = new View(this.model, "editor", containingViewOrElement);

  Controller.call(this, this.model, this.view);
  CustomEventTarget.call(this);

  this.load();
  this.initControls();
}

Editor.prototype = Object.create(Controller.prototype);
Editor.prototype.constructor = Editor;

Editor.prototype.initControls = function () {
  this.toolbar = new Toolbar(this, this.view);
  this.propertyEditor = new PropertyEditor(this, this.view);
};

Editor.prototype.load = function () {
  this.simulation = new Simulation();
  this.renderer = new CanvasRenderer(this.simulation, this.view.rootElement);
  this.scene = new EditorScene(this);
  this.simulation.setUpModel();
  this.renderer.start();
  setTimeout(this.simulation.oneStep.bind(this.simulation), 500); //TODO debug why this delay is needed
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