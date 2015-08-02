"use strict";

function ViewPort() {
  this.setBaseSize(1024, 768);
  this.setScreenResolution(document.body.clientWidth, document.body.clientHeight);
  this.setModelViewPort(0, 0, 1024, 768);
}

ViewPort.prototype.setBaseSize = function (baseWidth, baseHeight) {
  this.baseWidth = baseWidth;
  this.baseHeight = baseHeight;
  this.modelAspectRatio = this.baseWidth / this.baseHeight;
};

ViewPort.prototype.setScreenResolution = function (screenWidth, screenHeight) {
  this.screenWidth = screenWidth;
  this.screenHeight = screenHeight;
  this.screenToBaseRatio = this.screenWidth / this.baseWidth;
};

ViewPort.prototype.setModelViewPort = function (x, y, width, height) {
  if (height * this.modelAspectRatio > width) {
    width = Math.round(height * this.modelAspectRatio);
  } else {
    height = Math.round(width / this.modelAspectRatio);
  }
  this.modelViewPort = {
    x: x,
    y: y,
    width: width,
    height: height
  };
  this.zoom =  this.baseWidth / width;
  this.onScreenScale = this.zoom * this.screenToBaseRatio;
};

ViewPort.prototype.projectToScreen = function (pos) {
  return new Vector((pos.x - this.modelViewPort.x) * this.onScreenScale, (pos.y - this.modelViewPort.y) * this.onScreenScale);
};