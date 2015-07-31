"use strict";

var loader = new Loader();
var chromeScriptLoadErrorFlag = false; //Chrome fires the error event twice when a dynamically loaded script is async=false and it failes to load. We will ignore the second one. https://code.google.com/p/chromium/issues/detail?id=503077

loader.loadScript("compressed.js", main, function () {
  if (chromeScriptLoadErrorFlag) {
    return;
  }
  chromeScriptLoadErrorFlag = true;

  console.info("compressed.js not found, loading scripts in debug mode.");
  loader.loadScripts(["util/polyfills.js",
  "util/keyboard.js",
  "util/mixin.js",
  "model/gameengine.js",
  "model/simulation.js",
  "model/vector.js",
  "model/spaceobject.js",
  "model/star.js",
  "model/planet.js",
  "model/moon.js",
  "model/enginepowered.js",
  "model/missilelauncher.js",
  "model/spaceship.js",
  "model/missile.js",
  "model/detonation.js",
  "view/renderer.js",
  "view/domrenderer.js",
  "controller/keyboardcontroller.js"], main);
});

function main() {
  var simulation = new Simulation(60);
  var renderer = new DOMRenderer(simulation, document.getElementById('area'));

  var ship = new SpaceShip(new Vector(250, 450), new Vector(-0.6, -1), 0.1);

  simulation.setUpModel = function () {
    this.addSpaceObject(new Planet(new Vector(400, 350), new Vector(0, 0), 5));
    this.addSpaceObject(ship);
  };

  new KeyboardController(ship);

  simulation.start();
  renderer.start();
}