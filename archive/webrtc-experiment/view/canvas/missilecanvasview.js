"use strict";

function MissileCanvasView(model, viewPort) {
  CanvasView.call(this, model, viewPort, [{
    image: CanvasView.loadImage("missile"),
    width: 30,
    height: 12
  }]);
  var flame = {
    image: CanvasView.loadImage("flame"),
    width: 50,
    height: 10,
    offsetX: -18,
    offsetY: 0
  };
  EnginePoweredCanvasView.call(this, flame);
}

MissileCanvasView.prototype = Object.create(CanvasView.prototype);

CanvasRenderer.registerViewClass("missile", MissileCanvasView);