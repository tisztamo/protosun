"use strict";

function KeyboardController(spaceShip, camera) {
  this.spaceShip = spaceShip;
  this.camera = camera;
  this.installedKeydownHandler = this.keydownHandler.bind(this);
  this.installedKeyupHandler = this.keyupHandler.bind(this);
  document.addEventListener("keydown", this.installedKeydownHandler);
  document.addEventListener("keyup", this.installedKeyupHandler);
  spaceShip.simulation.addEventListener("stop", this.releaseResources.bind(this));
}

/** @private */
KeyboardController.prototype.keydownHandler = function (keyEvent) {
  //console.log(this.getKey(keyEvent));
  switch (keyEvent.key) {
  case "ArrowRight":
    this.spaceShip.startRotationRight();
    break;
  case "ArrowLeft":
    this.spaceShip.startRotationLeft();
    break;
  case "ArrowUp":
    this.spaceShip.startEngine();
    break;
  case " ":
  case "Spacebar":
    this.spaceShip.launchMissile();
    break;
  case "Control":
    this.camera.switchOutlined();
  }
};

/** @private */
KeyboardController.prototype.keyupHandler = function (keyEvent) {
  switch (keyEvent.key) {
  case "ArrowRight":
  case "ArrowLeft":
    this.spaceShip.stopRotation();
    break;
  case "ArrowUp":
    this.spaceShip.stopEngine();
    break;
  }
};

KeyboardController.prototype.releaseResources = function () {
  document.removeEventListener("keydown", this.installedKeydownHandler);
  document.removeEventListener("keyup", this.installedKeyupHandler);  
};