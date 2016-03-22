"use strict";

function PlanetCanvasView(model, viewPort) {
  CanvasView.call(this, model, viewPort, [CanvasView.sphere("planet", model)]);
}

PlanetCanvasView.prototype = Object.create(CanvasView.prototype);

CanvasRenderer.registerViewClass("planet", PlanetCanvasView);