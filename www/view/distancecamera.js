"use strict";

function DistanceCamera(simulation, viewPort, centerObject, distanceObject) {
  Camera.call(this, simulation, viewPort);
  this.centerObject = centerObject;
  this.distanceObject = distanceObject;
  this.baseDistance = centerObject.pos.distanceFrom(distanceObject.pos);
}

DistanceCamera.prototype = new Camera();
DistanceCamera.prototype.constructor = DistanceCamera;


DistanceCamera.prototype.updateView = function () {
  var distance = this.centerObject.pos.distanceFrom(this.distanceObject.pos);
  var zoom = this.baseDistance / distance;
  this.viewPort.setModelViewPortWithCenterZoom(this.centerObject.pos.clone().add(this.centerObject.v.clone().multiply(40 / zoom)), zoom);
};