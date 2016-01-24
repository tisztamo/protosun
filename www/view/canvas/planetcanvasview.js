"use strict";

function PlanetCanvasView(model, viewPort) {
  CanvasView.call(this, model, viewPort, [{
    image: CanvasView.loadImage("planet"),
    width: model.radius * 2,
    height: model.radius * 2
  }]);
}

PlanetCanvasView.prototype = Object.create(CanvasView.prototype);

CanvasRenderer.registerViewClass("planet", PlanetCanvasView);