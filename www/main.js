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
  var angle = Math.PI;
  var distance = Math.random() * (maxDistance - minDistance) + minDistance;
  var relPos = Vector.createFromPolar(angle, distance);
  var pos = centerObject.pos.clone().add(relPos);
  var speed = Math.sqrt(6000 / distance) * (1 + Math.random() / 5);
  return new SpaceDebris(pos, Vector.createFromPolar(angle - Math.PI / 2, speed));
}

function main() {
  var simulation = new Simulation(60);
  var area = document.getElementById('area');
  var renderer = new DOMRenderer(simulation, area);

  var ship = new SpaceShip(new Vector(-370, 350), new Vector(-0.4, 0), 0.1, Math.PI);
  var earth = new Earth(new Vector(400, 350), new Vector(0, 0), 105, 755);
  earth.maxDistance = 4000;

  simulation.setUpModel = function () {
    this.addSpaceObject(ship);
    this.addSpaceObject(earth);
    this.addSpaceObject(new Moon(new Vector(-460, 300), new Vector(0, -2.6), 0.1));
    setInterval(function () {
      if (simulation.spaceObjects.length < 10) {
        simulation.addSpaceObject(generateDebris(earth, 1000, 1400));
      }
    }, 2000);
  };

  renderer.setCamera(new DistanceCamera(simulation, renderer.viewPort, ship, earth));

  new KeyboardController(ship);
  TouchController.createControllerFor(ship, area);

  simulation.start();
  renderer.start();
}