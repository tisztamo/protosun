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
  "util/ie-touch.js",
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
  "model/touchcontrol.js",
  "view/viewport.js",
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

  var ship = new SpaceShip(new Vector(-370, 350), new Vector(-0.4, 0), 0.1, Math.PI);

  simulation.setUpModel = function () {
    this.addSpaceObject(ship);
    this.addSpaceObject(new Planet(new Vector(400, 350), new Vector(0, 0), 105));
        this.addSpaceObject(new Moon(new Vector(-460, 300), new Vector(0, -2.6), 0.1));

  };

  new KeyboardController(ship);
  TouchController.createControllerFor(ship, area);

  simulation.start();
  renderer.start();
}