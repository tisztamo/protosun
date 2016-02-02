"use strict";

function EditorCamera(editor, simulation, viewPort) {
  Camera.call(this, simulation, viewPort);
  this.editor = editor;
  this.center = Vector.zero.clone();
  this.zoom = 1;
  this.editor.view.rootElement.addEventListener("wheel", this.wheelHandler.bind(this));
  this.editor.view.rootElement.addEventListener("pointermove", this.moveHandler.bind(this));
  this.editor.view.rootElement.addEventListener("pointerdown", this.downHandler.bind(this));
  this.editor.view.rootElement.addEventListener("pointerup", this.upHandler.bind(this));
  this.editor.view.rootElement.addEventListener("pointercancel", this.upHandler.bind(this));
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
  if (event.target.tagName !== "CANVAS") {
    return;
  }
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