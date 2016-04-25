"use strict";

function SpaceDebrisCanvasView(model, viewPort) {
  CanvasView.call(this, model, viewPort, [CanvasView.sphere("spacedebris", model)]);
}

SpaceDebrisCanvasView.prototype = Object.create(CanvasView.prototype);

CanvasRenderer.registerViewClass("spacedebris", SpaceDebrisCanvasView);