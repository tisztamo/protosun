"use strict";

/**
 * Base class to handle game timing. Executes steps using setInterval, synchronized with performance.now() if available, Date.now() otherwise.
 * @param {number} fps Number of steps per second
 * @class
 */
function GameEngine(fps) {
  this.fps = fps || 30;
  this.stepTime = 1000 / this.fps;
  /** Number of steps already done */
  this.stepsTaken = 0;
  /** Moving average of steps per timer callback. Values significantly higher than 1 indicate performance issues (timer was fired late regurarly during the last ~100 callbacks.)*/
  this.avgStepsPerCB = 1;
}

GameEngine.prototype.getTS = function () {
  return window.performance && window.performance.now ? window.performance.now() : Date.now();
};

/**
 * Starts the engine
 */
GameEngine.prototype.start = function () {
  this.startTS = this.getTS();
  setInterval(this.timerCB.bind(this),
    this.stepTime);
};

/**
 * One step of the simulation. Should be extended in subclasses.
 */
GameEngine.prototype.oneStep = function () {
  this.stepsTaken += 1;
};

/**
 * Synchronizes with the time, calls oneStep 0-3 times.
 * @private
 */
GameEngine.prototype.timerCB = function () {
  var elapsedTime = this.getTS() - this.startTS;
  var currentSteps = 0;
  while (currentSteps < 3 && this.stepsTaken * this.stepTime <= elapsedTime) {
    this.oneStep();
    currentSteps += 1;
  }
  this.avgStepsPerCB = 0.99 * this.avgStepsPerCB + 0.01 * currentSteps;
};