"use strict";

var loader = new Loader();
var chromeScriptLoadErrorFlag = false; //Chrome fires the error event twice when a dynamically loaded script is async=false and it failes to load. We will ignore the second one.

loader.loadScript("compressed.js", main, function () {
  if (chromeScriptLoadErrorFlag) {
    console.log("onerror fired twice");
    return;
  }
  chromeScriptLoadErrorFlag = true;

  console.info("compressed.js not found, loading scripts in debug mode.");
  loader.loadScripts(["util/polyfills.js",
  "util/keyboard.js",
  "model/gameengine.js",
  "model/simulation.js",
  "model/vector.js",
  "model/spaceobject.js",
  "model/star.js",
  "model/planet.js",
  "model/moon.js",
  "model/spaceship.js",
  "view/renderer.js",
  "view/domrenderer.js",
  "controller/keyboardcontroller.js"], main);
});

function main() {
  var simulation = new Simulation(60);
  var renderer = new DOMRenderer(simulation, document.getElementById('area'));

  var ship = new SpaceShip(new Vector(50, 450), new Vector(0, 0), 0.1);

  simulation.setUpModel = function () {
    this.addSpaceObject(new Star(new Vector(400, 200), new Vector(0, 0), 5));
    this.addSpaceObject(new Planet(new Vector(200, 200), new Vector(0, 0.75)), 1);
    this.addSpaceObject(new Moon(new Vector(170, 200), new Vector(0, 1.75), 0.1));
    this.addSpaceObject(new Planet(new Vector(600, 200), new Vector(0, -0.75), 1));
    this.addSpaceObject(new Moon(new Vector(630, 200), new Vector(0, -1.75), 0.1));
    this.addSpaceObject(new Moon(new Vector(200, -1200), new Vector(0, 0.5), 0.1));
    this.addSpaceObject(ship);
  };

  new KeyboardController(ship);

  simulation.start();
  renderer.start();
}