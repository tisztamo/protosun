"use strict";

function ViewPort() {
  this.setBaseSize(1024, 768);
  this.resizeHandler();
  this.setModelViewPort(0, 0, 1024, 768);
  window.addEventListener('resize', this.resizeHandler.bind(this));
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

ViewPort.prototype.resizeHandler = function () {
  this.setScreenResolution(document.body.clientWidth, document.body.clientHeight);
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
    height: height,
    center: new Vector(x + width / 2, y + width / 2)
  };
  this.zoom = this.baseWidth / width;
  this.onScreenScale = this.zoom * this.screenToBaseRatio;
};

ViewPort.prototype.setModelViewPortWithCenterZoom = function (center, zoom) {
  var width = Math.round(this.baseWidth / zoom);
  var height = Math.round(this.baseHeight / zoom);
  this.setModelViewPort(Math.round(center.x - width / 2),
    Math.round(center.y - height / 2),
    width, height);
};

ViewPort.prototype.projectToScreen = function (pos) {
  return new Vector((pos.x - this.modelViewPort.x) * this.onScreenScale, (pos.y - this.modelViewPort.y) * this.onScreenScale);
};