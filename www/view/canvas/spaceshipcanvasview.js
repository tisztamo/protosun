"use strict";

function SpaceShipCanvasView(model, viewPort) {
  CanvasView.call(this, model, viewPort, [{
    image: CanvasView.loadImage("spaceship"),
    width: 40,
    height: 20
  }]);
}

SpaceShipCanvasView.prototype = new CanvasView();

CanvasRenderer.registerViewClass("spaceship", SpaceShipCanvasView);