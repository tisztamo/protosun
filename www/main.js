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
  "util/ie-touch.js",
  "model/gameengine.js",
  "model/simulation.js",
  "model/vector.js",
  "model/spaceobject.js",
  "model/star.js",
  "model/planet.js",
  "model/moon.js",
  "model/spaceship.js",
  "model/missile.js",
  "model/detonation.js",
  "model/touchcontrol.js",
  "view/renderer.js",
  "view/domrenderer.js",
  "view/touchcontrolview.js",
  "controller/keyboardcontroller.js",
  "controller/touchcontroller.js"
  ], main);
});

function main() {
  var simulation = new Simulation(60);
  var area = document.getElementById('area');
  var renderer = new DOMRenderer(simulation, area);

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
  TouchController.createControllerFor(ship, area);

  simulation.start();
  renderer.start();
}