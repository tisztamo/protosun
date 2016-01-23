"use strict";

/**
 * This camera follows an object. The object is not exactly in the center, the
 * camera uses the speed of the object to position it in the viewport.
 * @class
 */
function SimpleCamera(simulation, viewPort, centerObject) {
  Camera.call(this, simulation, viewPort);
  this.centerObject = centerObject;
}

SimpleCamera.prototype = Object.create(Camera.prototype);
SimpleCamera.prototype.constructor = SimpleCamera;

SimpleCamera.prototype.updateView = function () {
  this.viewPort.setModelViewPortWithCenterZoom(this.centerObject.pos.clone().add(this.centerObject.v.clone().multiply(50)), 1);
};