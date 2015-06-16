"use strict";

var simulation = new Simulation(60);
var renderer = new DOMRenderer(simulation, document.getElementById('area'));

simulation.setUpModel = function () {
  this.addSpaceObject(new SpaceObject(new Vector(0, 0), new Vector(1, 0.5)));
  this.addSpaceObject(new SpaceObject(new Vector(0, 0), new Vector(0.3, 0.3)));
};

simulation.start();
renderer.start();
