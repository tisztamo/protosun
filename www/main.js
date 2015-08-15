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
  "util/browserfeatures.js",
  "util/keyboard.js",
  "util/mixin.js",
  "util/ie-touch.js",
  "model/gameengine.js",
  "model/simulation.js",
  "model/vector.js",
  "model/spaceobject.js",
  "model/star.js",
  "model/planet.js",
  "model/simulationcenter.js",
  "model/earth.js",
  "model/moon.js",
  "model/enginepowered.js",
  "model/missilelauncher.js",
  "model/spacedebris.js",
  "model/spaceship.js",
  "model/missile.js",
  "model/detonation.js",
  "model/touchcontrol.js",
  "view/viewport.js",
  "view/camera.js",
  "view/distancecamera.js",
  "view/renderer.js",
  "view/domrenderer.js",
  "view/touchcontrolview.js",
  "controller/keyboardcontroller.js",
  "controller/touchcontroller.js"
  ], main);
});

function generateDebris(centerObject, minDistance, maxDistance) {
  var angle = Math.random() * Math.PI;
  var distance = Math.random() * (maxDistance - minDistance) + minDistance;
  var relPos = Vector.createFromPolar(angle, distance);
  var pos = centerObject.pos.clone().add(relPos);
  var speed = Math.sqrt((5500 + 600 * Math.random()) / distance);
  return new SpaceDebris(pos, Vector.createFromPolar(angle - Math.PI / 2, speed));
}

function main() {
  var simulation = new Simulation(60);
  var area = document.getElementById('area');
  var renderer = new DOMRenderer(simulation, area);

  var ship = new SpaceShip(new Vector(400, -550), new Vector(2.3, 0), 0.1, 0);
  var earth = new Earth(new Vector(400, 350), new Vector(0, 0), 105, 755);
  earth.maxDistance = 4000;

  simulation.setUpModel = function () {
    this.addSpaceObject(ship);
    this.addSpaceObject(earth);
    setInterval(function () {
      if (simulation.spaceObjects.length < 12) {
        simulation.addSpaceObject(generateDebris(earth, 800, 1200));
      }
    }, 2000);
  };

  renderer.setCamera(new DistanceCamera(simulation, renderer.viewPort, ship, earth));

  new KeyboardController(ship);
  TouchController.createControllerFor(ship, area);

  simulation.start();
  renderer.start();
}