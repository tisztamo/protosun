"use strict";

function FuelPackView(model, viewPort) {
  CanvasView.call(this, model, viewPort, [CanvasView.sphere("fuelpack", model)]);
}

FuelPackView.prototype = Object.create(CanvasView.prototype);

CanvasRenderer.registerViewClass("fuelpack", FuelPackView);
