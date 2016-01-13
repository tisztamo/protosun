"use strict";

function EnginePoweredCanvasView(flameDescriptor) {
  var flame = flameDescriptor || EnginePoweredCanvasView.defaultFlame;
  this.parts.unshift(flame);
  var engineRunning = false;
  var animationDuration = 200;
  var flameWidth = flameDescriptor.width;
  var flameOffsetX = flameDescriptor.offsetX;
  var animationStartedAt;

  this.calcAnimationState = function (age) {
    if (engineRunning !== this.model.engineRunning) {
      engineRunning = this.model.engineRunning;
      animationStartedAt = age;
    }
    var transitionState = Math.min((age - animationStartedAt) / animationDuration, 1);
    transitionState = engineRunning ? transitionState : 1 - transitionState;
    flame.alpha = 1.5 - transitionState;
    flame.width = flameWidth * transitionState;
    flame.offsetX = -20 + flameOffsetX * transitionState;
  };
}

EnginePoweredCanvasView.defaultFlame = {
  image: CanvasView.loadImage("doubleflame"),
  width: 120,
  height: 30,
  offsetX: -77,
  offsetY: 0
};