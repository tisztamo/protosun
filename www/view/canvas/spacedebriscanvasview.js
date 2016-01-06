"use strict";

function SpaceDebrisCanvasView(model, viewPort) {
  CanvasView.call(this, model, viewPort, [{
    image: CanvasView.loadImage("spacedebris"),
    width: 40,
    height: 40
  }]);
}

SpaceDebrisCanvasView.prototype = new CanvasView();

CanvasRenderer.registerViewClass("spacedebris", SpaceDebrisCanvasView);