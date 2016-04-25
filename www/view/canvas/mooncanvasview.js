"use strict";

function MoonCanvasView(model, viewPort) {
  CanvasView.call(this, model, viewPort, [CanvasView.sphere("moon", model)]);
}

MoonCanvasView.prototype = Object.create(CanvasView.prototype);

CanvasRenderer.registerViewClass("moon", MoonCanvasView);