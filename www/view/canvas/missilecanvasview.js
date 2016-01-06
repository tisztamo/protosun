"use strict";

function MissileCanvasView(model, viewPort) {
  CanvasView.call(this, model, viewPort, [{
    image: CanvasView.loadImage("missile"),
    width: 30,
    height: 12
  }]);
}

MissileCanvasView.prototype = new CanvasView();

CanvasRenderer.registerViewClass("missile", MissileCanvasView);