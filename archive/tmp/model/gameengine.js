"use strict";

function GameEngine(fps) {
  this.fps = fps || 30;
  this.stepTime = 1000 / this.fps;
  this.stepsTaken = 0;
  this.avgStepsPerCB = 1;
}

GameEngine.prototype.getTS = function () {
  return window.performance && window.performance.now ? window.performance.now() : Date.now();
};

GameEngine.prototype.start = function () {
  this.startTS = this.getTS();
  setInterval(this.timerCB.bind(this),
    this.stepTime);
};

GameEngine.prototype.oneStep = function () {
  this.stepsTaken += 1;
};

GameEngine.prototype.timerCB = function () {
  var elapsedTime = this.getTS() - this.startTS;
  var currentSteps = 0;
  while (currentSteps < 3 && this.stepsTaken * this.stepTime <= elapsedTime) {
    this.oneStep();
    currentSteps += 1;
  }
  this.avgStepsPerCB = 0.99 * this.avgStepsPerCB + 0.01 * currentSteps;
};