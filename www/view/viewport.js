"use strict";

/**
 * Projects a portion of the model space to a view space.
 * If the view is wider than the projected area (e.g. the default 4:3 area on a 16:9 screen),
 * then centers the projected area horizontally so that the viewed area will be larger.
 * Currently it does the same in the opposite case, the view will be smaller, so that case should be avoided.
 * @class
 */
function ViewPort() {
    this.setBaseSize(1024, 768);
    this.setModelViewPort(0, 0, 1024, 768);
}

/**
 * Sets the base size of the ViewPort, which is the size of the rectangle
 * projected to the view at zoom level 1. Defaults to 1024 x 768
 * @param baseWidth
 * @param baseHeight
 */
ViewPort.prototype.setBaseSize = function (baseWidth, baseHeight) {
  this.baseWidth = baseWidth;
  this.baseHeight = baseHeight;
  this.modelAspectRatio = this.baseWidth / this.baseHeight;
};

/**
 * Sets the view size.
 * @param viewWidth
 * @param viewHeight
 */
ViewPort.prototype.setViewSize = function (viewWidth, viewHeight) {
  this.viewWidth = viewWidth;
  this.viewHeight = viewHeight;
  this.viewToBaseRatio = this.viewHeight / this.baseHeight;
  this.horizontalViewShift = (this.viewWidth - (this.baseWidth * this.viewToBaseRatio)) / 2;
};


/**
 * Sets the projected area of the model space.
 * @param x
 * @param y
 * @param width
 * @param height
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
  this.viewScale = this.zoom * this.viewToBaseRatio;
};

/**
 * Sets the projected area of the model space using the center of the
 * area and the zoom level. Size of the area is calculated using the base size and zoom. See {@link ViewPort#setBaseSize}.
 * @param {Vector} center Center of the viewport rectangle
 * @param {number} zoom Zoom is linear, 1 is the default, 3 means that
 * the width and height of the projected area is 1/3 of the base size.
 */
ViewPort.prototype.setModelViewPortWithCenterZoom = function (center, zoom) {
  var width = Math.round(this.baseWidth / zoom);
  var height = Math.round(this.baseHeight / zoom);
  this.setModelViewPort(Math.round(center.x - width / 2),
    Math.round(center.y - height / 2),
    width, height);
};

/**
* Projects a Vector from the model space to the view space.
* @param {Vector} pos The vector to project
*/
ViewPort.prototype.projectToView = function (pos) {
  return new Vector((pos.x - this.modelViewPort.x) * this.viewScale + this.horizontalViewShift, (pos.y - this.modelViewPort.y) * this.viewScale);
};

/**
* Checks if the given Vector is in the view.
* @return the projected (view) vector if it is in the view, false otherwise.
* @param {Vector} modelPos The vector to project
* @param {number} radius 
*/
ViewPort.prototype.isInView = function (modelPos, radius) {
  var viewPos = this.projectToView(modelPos);
  radius = radius || 0;
  var viewRadius = radius * this.viewScale;
  if (viewPos.x >= -viewRadius && viewPos.y >= -viewRadius && viewPos.x < this.viewWidth + viewRadius && viewPos.y < this.viewHeight + viewRadius) {
    return viewPos;
  }
  return false;
};