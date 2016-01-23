"use strict";

function StarCanvasView(model, viewPort) {
  CanvasView.call(this, model, viewPort, [{
    image: CanvasView.loadImage("star"),
    width: model.radius * 2.2,
    height: model.radius * 2.2
  }]);
}

StarCanvasView.prototype = Object.create(CanvasView.prototype);

CanvasRenderer.registerViewClass("star", StarCanvasView);
CanvasRenderer.registerViewClass("fixedstar", StarCanvasView);