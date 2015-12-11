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
  "util/customeventtarget.js",
  "util/ie-touch.js",
  "model/vector.js",
  "view/viewport.js",
  "view/domviewport.js",
  "model/gameengine.js",
  "model/simulation.js",
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
  "scene/scene.js",
  "scene/spacedebrisscene.js",
  "view/camera.js",
  "view/simplecamera.js",
  "view/simulationobserver.js",
  "view/view.js",
  "view/renderer.js",
  "view/domrenderer.js",
  "view/touchcontrolview.js",
  "view/debugview.js",
  "controller/keyboardcontroller.js",
  "controller/touchcontroller.js"
  ], main);
});

/*jshint -W098 */
function main() {
  var simulation = new Simulation(60);
  var area = document.getElementById('area');
  var renderer = new DOMRenderer(simulation, area);
  var scene = new SpaceDebrisScene(simulation, renderer);
  var debugView = new DebugView(simulation, renderer);
  document.body.appendChild(debugView.rootElement);

  simulation.start();
  renderer.start();
}