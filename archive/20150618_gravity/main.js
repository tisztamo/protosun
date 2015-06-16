"use strict";

var simulation = new Simulation(60);
var renderer = new DOMRenderer(simulation, document.getElementById('area'));

simulation.setUpModel = function () {
  this.addSpaceObject(new Star(new Vector(400, 200), new Vector(0, 0), 5));
  this.addSpaceObject(new Planet(new Vector(200, 200), new Vector(0, 1.5)), 1);
  this.addSpaceObject(new Moon(new Vector(170, 200), new Vector(0, 3.5), 0.1));
  this.addSpaceObject(new Planet(new Vector(600, 200), new Vector(0, -1.5), 1));
  this.addSpaceObject(new Moon(new Vector(630, 200), new Vector(0, -3.5), 0.1));
  this.addSpaceObject(new Moon(new Vector(200, -1200), new Vector(0, 1), 0.1));
};

simulation.start();
renderer.start();