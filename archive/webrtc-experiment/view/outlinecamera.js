"use strict";

function OutlineCamera(originalCamera, x, y, width, height) {
  Camera.call(this, originalCamera.simulation, originalCamera.viewPort);
  this.originalCamera = originalCamera;
  this.isOutLined = false;
  this.x = x || 0;
  this.width = width || 2048;
  this.y = y || 0;
  this.height = height || 1536;
  this.animationLength = 500;
}

OutlineCamera.prototype = Object.create(Camera.prototype);
OutlineCamera.prototype.constructor = OutlineCamera;

OutlineCamera.prototype.updateView = function () {
  if (this.animationRunning && this.animate()) {
    return;
  }
  if (this.isOutlined) {
    this.viewPort.setModelViewPort(this.x, this.y, this.width, this.height);
  } else {
    this.originalCamera.updateView();
  }
};

OutlineCamera.prototype.animate = function () {
  var phase = (Date.now() - this.animationStartedAt) / this.animationLength;
  if (phase >= 1) {
    this.animationRunning = false;
    return false;
  }
  if (!this.isOutlined) {
    phase = 1 - phase;
  }
  this.originalCamera.updateView();
  
  function animPos(a, b, phase) {
    return a + phase * (b - a);
  }
  var x = animPos(this.viewPort.modelViewPort.x, this.x, phase);
  var y = animPos(this.viewPort.modelViewPort.y, this.y, phase);
  var width = animPos(this.viewPort.modelViewPort.width, this.width, phase);
  var height = animPos(this.viewPort.modelViewPort.height, this.height, phase);
  this.viewPort.setModelViewPort(x, y, width, height);
  return true;
};

OutlineCamera.prototype.setOutlined = function (outlineFlag) {
  this.isOutlined = outlineFlag;
  this.animationRunning = true;
  this.animationStartedAt = Date.now();
};

OutlineCamera.prototype.switchOutlined = function () {
  this.setOutlined(!this.isOutlined);
};