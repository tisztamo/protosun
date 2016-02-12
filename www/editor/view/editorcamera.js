"use strict";

function EditorCamera(editor, simulation, viewPort) {
  Camera.call(this, simulation, viewPort);
  this.editor = editor;
  this.center = Vector.zero.clone();
  this.zoom = 1;
  SimulationObserver.call(this, simulation);

  this.activeTouches = {};
  this.activeTouchNum = 0;

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
}

EditorCamera.prototype = Object.create(Camera.prototype);
EditorCamera.prototype.constructor = EditorCamera;

EditorCamera.prototype.updateView = function () {
  this.zoom = Math.max(Math.min(this.zoom, 5), 0.05);
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
  this.editor.render();
};

EditorCamera.prototype.downHandler = function (event) {
  if (!this.editor.isPointerEventOnScene(event)) return;
  this.activeTouches[event.pointerId] = event;
  this.activeTouchNum += 1;
  if (this.activeTouchNum === 2) {
    this.originalTouchInfo = this.getMultitouchInfo();
    this.originalZoom = this.zoom;
    this.originalCenter = this.center.clone();
    this.originalTouchCenter = this.viewPort.projectToModel(this.originalTouchInfo.center);
    this.originalTouchCenterShift = this.center.clone().add(this.originalTouchCenter.clone().multiply(-1));
  }
};

EditorCamera.prototype.upHandler = function () {
  this.activeTouches = {};
  this.activeTouchNum = 0;
};

EditorCamera.prototype.moveHandler = function (event) {
  var lastTouch = this.activeTouches[event.pointerId];
  if (!lastTouch) {
    return;
  }
  if (this.activeTouchNum === 1) {
    this.center.add(new Vector(lastTouch.clientX - event.clientX, lastTouch.clientY - event.clientY).multiply(1 / this.viewPort.viewScale));
  } else if (this.activeTouchNum === 2) {
    var touchInfo = this.getMultitouchInfo();
    this.zoom = this.originalZoom * (touchInfo.distance / this.originalTouchInfo.distance);
    this.center = this.originalTouchCenter.clone().add(this.originalTouchCenterShift.clone().multiply(this.originalZoom / this.zoom));
  }
  this.activeTouches[event.pointerId] = event;
  this.editor.render();
};

EditorCamera.prototype.getMultitouchInfo = function () {
  var center = Vector.zero.clone();
  var distance = 0;
  var last = null;
  for (var t in this.activeTouches) {
    var current = new Vector(this.activeTouches[t].clientX, this.activeTouches[t].clientY);
    center.add(current);
    if (last) {
      distance += last.distanceFrom(current);
    }
    last = current;
  }
  center.multiply(1 / this.activeTouchNum);
  return {
    center: center,
    distance: distance
  };
};

EditorCamera.prototype.simulationStopped = function () {
  this.rootElement.removeEventListener("wheel", this.installedWheelHandler);
  this.rootElement.removeEventListener("pointermove", this.installedMoveHandler);
  this.rootElement.removeEventListener("pointerdown", this.installedDownHandler);
  this.rootElement.removeEventListener("pointerup", this.installedUpHandler);
  this.rootElement.removeEventListener("pointercancel", this.installedUpHandler);
};