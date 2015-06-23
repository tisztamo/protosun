"use strict";

function KeyboardController(spaceShip) {
  this.spaceShip = spaceShip;
  document.addEventListener("keydown", this.keydownHandler.bind(this));
  document.addEventListener("keyup", this.keyupHandler.bind(this));
}

/** @private */
KeyboardController.prototype.keydownHandler = function (keyEvent) {
  //console.log(this.getKey(keyEvent));
  switch (this.getKey(keyEvent)) {
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
  //console.log(this.getKey(keyEvent));
  switch (this.getKey(keyEvent)) {
  case "ArrowRight":
  case "ArrowLeft":
    this.spaceShip.stopRotation();
    break;
  case "ArrowUp":
    this.spaceShip.stopEngine();
    break;
  }
};

/** 
 * Normalizes the key event
 * @returns The key property of keyEvent if exists, otherwise
 * a guess based on the keyCode property.
 */
KeyboardController.prototype.getKey = function (keyEvent) {
  if (keyEvent.key) {
    return keyEvent.key;
  }
  console.log(keyEvent.keyCode);
  switch (keyEvent.keyCode) {
  case 32:
    return " ";
  case 37:
    return "ArrowLeft";
  case 38:
    return "ArrowUp";
  case 39:
    return "ArrowRight";
  case 40:
    return "ArrowDown";
  default:
    return "Unidentified";
  }
};