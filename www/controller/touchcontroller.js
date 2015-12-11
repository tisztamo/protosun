"use strict";

function TouchController(spaceShip, touchControlView) {
  this.spaceShip = spaceShip;
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
    }
  };
  this.bindEvents();
}

/**
 * @static
 * Creates a touch controller (TouchControl, TouchControlView and TouchController) for the given spaceship. If the browser does not support touching, 
 then returns null
 */
TouchController.createControllerFor = function (spaceShip, targetElement) {
  if (!BrowserFeatures.hasTouch) {
    return null;
  }
  var touchControlView = new TouchControlView(spaceShip, targetElement);
  var touchController = new TouchController(spaceShip, touchControlView);
  return touchController;
};

/** @private */
TouchController.prototype.bindEvents = function () {
  for (var controlName in this.eventMapping) {
    var control = this.view.rootElement.getElementsByClassName(controlName).item(0);
    var eventMapping = this.eventMapping[controlName];
    if (eventMapping.touchstart) {
      control.addEventListener("touchstart", this.spaceShip[eventMapping.touchstart].bind(this.spaceShip));
    }
    if (eventMapping.touchend) {
      control.addEventListener("touchend", this.spaceShip[eventMapping.touchend].bind(this.spaceShip));
    }
  }
};