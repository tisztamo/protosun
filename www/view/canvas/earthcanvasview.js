"use strict";

function EarthCanvasView(model, viewPort) {
  CanvasView.call(this, model, viewPort, [{
    image: CanvasView.loadImage("earth"),
    width: model.radius * 2,
    height: model.radius * 2
  }]);
}

EarthCanvasView.prototype = Object.create(CanvasView.prototype);

CanvasRenderer.registerViewClass("earth", EarthCanvasView);