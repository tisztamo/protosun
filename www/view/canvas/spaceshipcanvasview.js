"use strict";

function SpaceShipCanvasView(model, viewPort) {
  CanvasView.call(this, model, viewPort, [{
    image: CanvasView.loadImage("spaceship"),
    width: 40,
    height: 20
  }]);
  var flame = {
    image: CanvasView.loadImage("doubleflame"),
    width: 120,
    height: 30,
    offsetX: -57,
    offsetY: 0
  };
  EnginePoweredCanvasView.call(this, flame);
}

SpaceShipCanvasView.prototype = new CanvasView();

CanvasRenderer.registerViewClass("spaceship", SpaceShipCanvasView);