"use strict";

function PlanetCanvasView(model, viewPort) {
  CanvasView.call(this, model, viewPort, [{
    image: CanvasView.loadImage("planet"),
    width: 50,
    height: 50
  }]);
}

PlanetCanvasView.prototype = new CanvasView();

CanvasRenderer.registerViewClass("planet", PlanetCanvasView);