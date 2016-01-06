"use strict";

function MoonCanvasView(model, viewPort) {
  CanvasView.call(this, model, viewPort, [{
    image: CanvasView.loadImage("moon"),
    width: 25,
    height: 25
  }]);
}

MoonCanvasView.prototype = new CanvasView();

CanvasRenderer.registerViewClass("moon", MoonCanvasView);