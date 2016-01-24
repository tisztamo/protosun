"use strict";

function MoonCanvasView(model, viewPort) {
  CanvasView.call(this, model, viewPort, [{
    image: CanvasView.loadImage("moon"),
    width: model.radius * 2,
    height: model.radius * 2
  }]);
}

MoonCanvasView.prototype = Object.create(CanvasView.prototype);

CanvasRenderer.registerViewClass("moon", MoonCanvasView);