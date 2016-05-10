"use strict";

function StarCanvasView(model, viewPort) {
  CanvasView.call(this, model, viewPort, [CanvasView.sphere("star", model, 2.2)]);
}

StarCanvasView.prototype = Object.create(CanvasView.prototype);

CanvasRenderer.registerViewClass("star", StarCanvasView);
CanvasRenderer.registerViewClass("fixedstar", StarCanvasView);