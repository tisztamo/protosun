"use strict";

/** Base class to define the objective of a scene.
* @param {Simulation} simulation
* @class
* @abstract
*/
function Objective(simulation, winAtStep, failAtStep) {
  this.simulation = simulation;
  SimulationObserver.call(this, simulation);
  CustomEventTarget.call(this);
  this.winAtStep = winAtStep || -1;
  this.failAtStep = failAtStep || -1;
  this.stepCount = 0;
  this.ended = false;
}

Objective.prototype.oneStepTaken = function () {
  this.stepCount += 1;
  if (this.stepCount == this.winAtStep) {
    this.emitWin();
  }
  if (this.stepCount == this.failAtStep) {
    this.emitFail();
  }
};

Objective.prototype.emitWin = function () {
  if (this.ended) {
    return;
  }
  this.ended = true;
  this.dispatchEvent(new CustomEvent("win"));
};

Objective.prototype.emitFail = function (eventData) {
  if (this.ended) {
    return;
  }
  this.ended = true;
  this.dispatchEvent(new CustomEvent("fail", {
    detail: eventData
  }));
};