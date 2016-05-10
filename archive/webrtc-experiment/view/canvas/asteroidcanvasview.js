"use strict";

function AteroidCanvasView(model, viewPort) {
  CanvasView.call(this, model, viewPort, [CanvasView.sphere("earth", model)]);
}

AteroidCanvasView.prototype = Object.create(CanvasView.prototype);

CanvasRenderer.registerViewClass("asteroid", AteroidCanvasView);