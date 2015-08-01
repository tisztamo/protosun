"use strict";

function TouchController(touchControl, touchControlView) {
  this.model = touchControl;
  this.spaceShip = this.model.spaceShip;
  this.view = touchControlView;
  this.eventMapping = {
    leftControl: {
      touchstart: "startRotationLeft",
      touchend: "stopRotation"
    },
    rightControl: {
      touchstart: "startRotationRight",
      touchend: "stopRotation"
    },
    engineControl: {
      touchstart: "startEngine",
      touchend: "stopEngine"
    },
    fireControl: {
      touchstart: "launchMissile",
      touchend: "stopEngine"
    }
  };
  this.bindEvents();
}

/**
 * @static
 * Creates a touch controller (TouchControl, TouchControlView and TouchControlelr) for the given spaceship.
 */
TouchController.createControllerFor = function (spaceShip, targetElement) {
  var touchControl = new TouchControl(spaceShip);
  var touchControlView = new TouchControlView(touchControl, targetElement);
  var touchController = new TouchController(touchControl, touchControlView);
  return touchController;
};

TouchController.prototype.bindEvents = function () {
  for (var controlName in this.eventMapping) {
    var control = this.view.rootElement.getElementsByClassName(controlName).item(0);
    control.addEventListener("touchstart", this.spaceShip[this.eventMapping[controlName].touchstart].bind(this.spaceShip));
    control.addEventListener("touchend", this.spaceShip[this.eventMapping[controlName].touchend].bind(this.spaceShip));
  }
};