"use strict";

function AteroidCanvasView(model, viewPort) {
  CanvasView.call(this, model, viewPort, [{
    image: CanvasView.loadImage("asteroid"),
    width: model.radius * 2,
    height: model.radius * 2
  }]);
}

AteroidCanvasView.prototype = Object.create(CanvasView.prototype);

CanvasRenderer.registerViewClass("asteroid", AteroidCanvasView);