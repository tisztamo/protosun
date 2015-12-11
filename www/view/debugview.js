"use strict";

function DebugView(simulation, renderer) {
  View.call(this, simulation);
  SimulationObserver.call(this, simulation);
  this.renderer = renderer;
}

DebugView.prototype = new View();
DebugView.prototype.constructor = DebugView;

SimulationObserver.mixInto(DebugView);

DebugView.prototype.idPrefix = "debug_";
DebugView.prototype.templateId = "debug";

DebugView.prototype.oneStepTaken = function () {
  var v = this.viewElements;
  v.timerlag.textContent = Math.round(this.simulation.avgStepsPerCB * 100) / 100;
  v.viewcount.textContent = this.renderer.displayedViewCount + "/" + this.renderer.views.length;
};