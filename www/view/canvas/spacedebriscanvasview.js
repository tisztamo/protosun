"use strict";

function SpaceDebrisCanvasView(model, viewPort) {
  CanvasView.call(this, model, viewPort, [{
    image: CanvasView.loadImage("spacedebris"),
    width: model.radius * 2,
    height: model.radius * 2
  }]);
}

SpaceDebrisCanvasView.prototype = new CanvasView();

CanvasRenderer.registerViewClass("spacedebris", SpaceDebrisCanvasView);