"use strict";

function EditorCamera(editor, simulation, viewPort) {
  Camera.call(this, simulation, viewPort);
  this.editor = editor;
  this.center = Vector.zero.clone();
  this.zoom = 1;
  SimulationObserver.call(this, simulation);
  
  this.rootElement = this.editor.view.rootElement;
  this.installedWheelHandler = this.wheelHandler.bind(this);
  this.installedMoveHandler = this.moveHandler.bind(this);
  this.installedDownHandler = this.downHandler.bind(this);
  this.installedUpHandler = this.upHandler.bind(this);

  this.rootElement.addEventListener("wheel", this.installedWheelHandler);
  this.rootElement.addEventListener("pointermove", this.installedMoveHandler);
  this.rootElement.addEventListener("pointerdown", this.installedDownHandler);
  this.rootElement.addEventListener("pointerup", this.installedUpHandler);
  this.rootElement.addEventListener("pointercancel", this.installedUpHandler);
  this.lastDragX = null;
}

EditorCamera.prototype = Object.create(Camera.prototype);
EditorCamera.prototype.constructor = EditorCamera;

EditorCamera.prototype.updateView = function () {
  this.viewPort.setModelViewPortWithCenterZoom(this.center, this.zoom);
};

EditorCamera.prototype.wheelHandler = function (event) {
  if (event.target.tagName === "INPUT") {
    return;
  }
  var delta = event.deltaY;
  if (delta > 0) {
    this.zoom *= 1.04;
  } else if (delta < 0) {
    this.zoom /= 1.04;
  }
  this.zoom = Math.max(Math.min(this.zoom, 5), 0.05);
  this.editor.render();
};

EditorCamera.prototype.downHandler = function (event) {
  if (!this.editor.isPointerEventOnScene()) return;
  this.lastDragX = event.clientX;
  this.lastDragY = event.clientY;
};

EditorCamera.prototype.upHandler = function () {
  this.lastDragX = null;
};

EditorCamera.prototype.moveHandler = function (event) {
  if (this.lastDragX === null) {
    return;
  }
  this.center.add(new Vector(this.lastDragX - event.clientX, this.lastDragY - event.clientY).multiply(1 / this.viewPort.viewScale));
  this.lastDragX = event.clientX;
  this.lastDragY = event.clientY;
  this.editor.render();
};

EditorCamera.prototype.simulationStopped = function () {
  this.rootElement.removeEventListener("wheel", this.installedWheelHandler);
  this.rootElement.removeEventListener("pointermove", this.installedMoveHandler);
  this.rootElement.removeEventListener("pointerdown", this.installedDownHandler);
  this.rootElement.removeEventListener("pointerup", this.installedUpHandler);
  this.rootElement.removeEventListener("pointercancel", this.installedUpHandler);
};