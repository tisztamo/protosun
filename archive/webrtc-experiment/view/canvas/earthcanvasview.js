"use strict";

function EarthCanvasView(model, viewPort) {
  CanvasView.call(this, model, viewPort, [CanvasView.sphere("earth", model)]);
}

EarthCanvasView.prototype = Object.create(CanvasView.prototype);

CanvasRenderer.registerViewClass("earth", EarthCanvasView);