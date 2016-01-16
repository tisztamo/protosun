"use strict";

function MoonCanvasView(model, viewPort) {
  CanvasView.call(this, model, viewPort, [{
    image: CanvasView.loadImage("moon"),
    width: model.radius * 2,
    height: model.radius * 2
  }]);
}

MoonCanvasView.prototype = new CanvasView();

CanvasRenderer.registerViewClass("moon", MoonCanvasView);