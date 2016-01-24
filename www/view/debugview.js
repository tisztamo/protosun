"use strict";

function DebugView(simulation, renderer) {
  this.projection = {
    timerLag: function() {
      var val = Math.round(simulation.avgStepsPerCB * 100) / 100;
      return {
        textContent: val,
        className: val < 1.1 ? "normal" : "warning"
      };
    }
  };
  View.call(this, simulation, "debug");
  SimulationObserver.call(this, simulation);
}

DebugView.prototype = Object.create(View.prototype);
DebugView.prototype.constructor = DebugView;

DebugView.prototype.oneStepTaken = function () {
  this.updateAll();
};