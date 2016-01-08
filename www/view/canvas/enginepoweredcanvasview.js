"use strict";

function EnginePoweredCanvasView(flame) {
  this.flame = flame || {
    image: CanvasView.loadImage("doubleflame"),
    width: 120,
    height: 30,
    offsetX: -77,
    offsetY: 0
  };
  this.parts.unshift(this.flame);
  this.engineRunning = false;
  this.animationDuration = 200;
  this.flameWidth = this.flame.width;
  this.flameOffsetX = this.flame.offsetX;
}

Mixin.mixInto(EnginePoweredCanvasView);

EnginePoweredCanvasView.prototype.calcAnimationState = function (age) {
  if (this.engineRunning !== this.model.engineRunning) {
    this.engineRunning = this.model.engineRunning;
    this.animationStartedAt = age;
  }
  var transitionState = Math.min((age - this.animationStartedAt) / this.animationDuration, 1);
  transitionState = this.engineRunning ? transitionState : 1 - transitionState;
  this.flame.alpha = 1.5 - transitionState;
  this.flame.width = this.flameWidth * transitionState;
  this.flame.offsetX = -20 + this.flameOffsetX * transitionState;
};