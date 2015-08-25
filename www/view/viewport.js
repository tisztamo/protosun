"use strict";

/**
* Projects a portion of the model space to the screen.
* Checks the screen size and reacts to size changes.
* If the screen is wider than the projected area (e.g. the default 4:3 area on a 16:9 screen),
* then centers the projected area horizontally so that the viewed area will be larger.
* Currently it does the same in the opposite case, the view will be smaller, so that case should be avoided.
* @todo allow shutdown, remove resize handler
* @class
*/
function ViewPort() {
  this.setBaseSize(1024, 768);
  this.resizeHandler();
  this.setModelViewPort(0, 0, 1024, 768);
  window.addEventListener("resize", this.resizeHandler.bind(this));
}

/**
* Sets the base size of the ViewPort, which is the size of the rectangle
* projected to the screen at zoom level 1. Defaults to 1024 x 768
*/
ViewPort.prototype.setBaseSize = function (baseWidth, baseHeight) {
  this.baseWidth = baseWidth;
  this.baseHeight = baseHeight;
  this.modelAspectRatio = this.baseWidth / this.baseHeight;
};

/**
* @private
*/
ViewPort.prototype.setScreenResolution = function (screenWidth, screenHeight) {
  this.screenWidth = screenWidth;
  this.screenHeight = screenHeight;
  this.screenToBaseRatio = this.screenHeight / this.baseHeight;
  this.horizontalViewShift = (this.screenWidth - (this.baseWidth * this.screenToBaseRatio)) / 2;
};

/**
* @private
*/
ViewPort.prototype.resizeHandler = function () {
  this.setScreenResolution(document.body.clientWidth, document.body.clientHeight);
};

/**
* Sets the projected area of the model space. 
*/
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

/**
* Sets the projected area of the model space with the center of the
* the area and the zoom level. Zoom is linear, 1 is the default, 3 means that
* the width and height of the projected area is 1/3 of the base size. See {@link ViewPort#setBaseSize}.
*/
ViewPort.prototype.setModelViewPortWithCenterZoom = function (center, zoom) {
  var width = Math.round(this.baseWidth / zoom);
  var height = Math.round(this.baseHeight / zoom);
  this.setModelViewPort(Math.round(center.x - width / 2),
    Math.round(center.y - height / 2),
    width, height);
};

ViewPort.prototype.projectToScreen = function (pos) {
  return new Vector((pos.x - this.modelViewPort.x) * this.onScreenScale + this.horizontalViewShift, (pos.y - this.modelViewPort.y) * this.onScreenScale);
};

ViewPort.prototype.isOnScreen = function (modelPos, radius) {
  var screenPos = this.projectToScreen(modelPos);
  var screenRadius = radius * this.onScreenScale;
  if (screenPos.x >= -screenRadius && screenPos.y >= -screenRadius && screenPos.x < this.screenWidth + screenRadius && screenPos.y < this.screenHeight + screenRadius) {
    return screenPos;
  }
  return false;
};