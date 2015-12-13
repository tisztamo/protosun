"use strict";

function DebugView(simulation, renderer) {
  this.projection = {
    timerLag: function() {
      var val = Math.round(simulation.avgStepsPerCB * 100) / 100;
      return {
        textContent: val,
        className: val < 1.1 ? "normal" : "warning"
      };
    },
    viewCount: function() {
      return renderer.displayedViewCount + "/" + renderer.views.length;
    },
  };
  View.call(this, simulation, "debug");
  SimulationObserver.call(this, simulation);
}

DebugView.prototype = new View();
DebugView.prototype.constructor = DebugView;

SimulationObserver.mixInto(DebugView);

DebugView.prototype.oneStepTaken = function () {
  this.updateAll();
};