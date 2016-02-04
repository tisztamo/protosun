/*jshint -W083*/
"use strict";

function Forecaster(sourceSimulation, steps) {
  this.source = sourceSimulation;
  this.steps = steps || 1800;
  this.stepsPerForecastPoint = 15;
}

Forecaster.prototype.createForecast = function () {
  var forecaster = this;
  this.simulation = new Simulation();
  this.simulation.emit = function (eventType, detail) {
    if (eventType === "collision") {
      if (!detail.first.isIndestructible) {
        this.removeSpaceObject(detail.first);
      }
      if (!detail.second.isIndestructible) {
        this.removeSpaceObject(detail.second);
      }
    }
  };
  var forecast = {};

  this.source.spaceObjects.forEach(function (spaceObject) {
    forecaster.simulation.addSpaceObject(spaceObject.clone());
    forecast[spaceObject.id] = [];
  });

  var forecastSteps = this.steps / this.stepsPerForecastPoint;
  for (var i = 0; i < forecastSteps; ++i) {
    for (var j = 0; j < this.stepsPerForecastPoint; ++j) {
      this.simulation.oneStep();
    }
    this.simulation.spaceObjects.forEach(function (spaceObject) {
      forecast[spaceObject.id].push({
        x: spaceObject.pos.x,
        y: spaceObject.pos.y
      });
    });
  }

  this.simulation.stop();
  this.simulation = null;
  
  return forecast;
};