"use strict";

function KeyboardController(spaceShip) {
  this.spaceShip = spaceShip;
  document.addEventListener("keydown", this.keydownHandler.bind(this));
  document.addEventListener("keyup", this.keyupHandler.bind(this));
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
