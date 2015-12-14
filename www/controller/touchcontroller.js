"use strict";

function TouchController(spaceShip, touchControlView) {
  this.eventMapping = {
    leftcontrol: {
      touchstart: spaceShip.startRotationLeft.bind(spaceShip),
      touchend: spaceShip.stopRotation.bind(spaceShip)
    },
    rightcontrol: {
      touchstart: spaceShip.startRotationRight.bind(spaceShip),
      touchend: spaceShip.stopRotation.bind(spaceShip)
    },
    enginecontrol: {
      touchstart: spaceShip.startEngine.bind(spaceShip),
      touchend: spaceShip.stopEngine.bind(spaceShip)
    },
    firecontrol: {
      touchstart: spaceShip.launchMissile.bind(spaceShip),
    }
  };
  Controller.call(this, spaceShip, touchControlView);
}

TouchController.prototype = new Controller();
TouchController.prototype.constructor = TouchController;

/**
 * @static
 * Creates a touch screen controller (TouchControlView and TouchController) for the given spaceship. If the browser does not support touching, 
 then returns null
 */
TouchController.createControllerFor = function (spaceShip) {
  if (!BrowserFeatures.hasTouch) {
    //return null;
  }
  var touchControlView = new TouchControlView();
  var touchController = new TouchController(spaceShip, touchControlView);
  return touchController;
};

