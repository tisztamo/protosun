"use strict";

function DetonationCanvasView(model, viewPort) {
  var detonationImage = {
    image: CanvasView.loadImage("detonation"),
    width: 400,
    height: 400,
    alpha: 0
  };
  CanvasView.call(this, model, viewPort, [detonationImage]);
  this.detonationImage = detonationImage;
  this.maxAge = 1000;
}

DetonationCanvasView.prototype = new CanvasView();

CanvasRenderer.registerViewClass("detonation", DetonationCanvasView);


DetonationCanvasView.prototype.calcAnimationState = function (age) {
  var relativeAge = age / this.maxAge;
  this.detonationImage.alpha = 1 - relativeAge;
  this.detonationImage.width = Math.round(500 * relativeAge);
  this.detonationImage.height = Math.round(500 * relativeAge);
};