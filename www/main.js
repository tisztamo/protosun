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
  "util/customeventtarget.js",
  "util/ie-touch.js",
  "model/vector.js",
  "view/viewport.js",
  "view/domviewport.js",
  "model/gameengine.js",
  "model/simulation.js",
  "model/spaceobject.js",
  "model/star.js",
  "model/fixedstar.js",
  "model/planet.js",
  "model/simulationcenter.js",
  "model/earth.js",
  "model/moon.js",
  "model/enginepowered.js",
  "model/asteroid.js",
  "model/missilelauncher.js",
  "model/spacedebris.js",
  "model/spaceship.js",
  "model/missile.js",
  "model/detonation.js",
  "scene/scene.js",
  "scene/objective.js",
  "scene/protectobjective.js",
  "scene/puzzlescene.js",
  "scene/spacedebrisscene.js",
  "sound/sound.js",
  "view/camera.js",
  "view/simplecamera.js",
  "view/outlinecamera.js",
  "view/simulationobserver.js",
  "view/view.js",
  "view/renderer.js",
  "view/canvas/canvasrenderer.js",
  "view/canvas/canvasview.js",
  "view/canvas/asteroidcanvasview.js",
  "view/canvas/enginepoweredcanvasview.js",
  "view/canvas/detonationcanvasview.js",
  "view/canvas/earthcanvasview.js",
  "view/canvas/mooncanvasview.js",
  "view/canvas/missilecanvasview.js",
  "view/canvas/planetcanvasview.js",
  "view/canvas/spacedebriscanvasview.js",
  "view/canvas/spaceshipcanvasview.js",
  "view/canvas/starcanvasview.js",
  "view/touchcontrolview.js",
  "view/debugview.js",
  "controller/controller.js",
  "controller/keyboardcontroller.js",
  "controller/touchcontroller.js",
  "controller/sceneselector.js",
  "controller/maincontroller.js",
  "editor/controller/editor.js",
  "editor/controller/toolbar.js",
  "editor/controller/propertyeditor.js",
  "editor/scene/editorscene.js",
  "editor/view/editorcamera.js",
  "editor/view/propertyeditorview.js"
  ], main);
});

/*jshint -W098 */
function main() {
  //var mainController = new MainController(document.body);
  var editor = new Editor(document.body);
}

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
  var sound = new Sound();
  sound.playMusic("sound/Leisure-B_-_17_-_Man_On_The_Moon.mp3");
  //Leisure-B_-_17_-_Man_On_The_Moon.mp3
  //Andy_G_Cohen_-_11_-_Space_Outro.mp3
  //Tortue_Super_Sonic_-_05_-_Neogrotesque.mp3
  //Tortue_Super_Sonic_-_18_-_Youre_a_computer.mp3
}