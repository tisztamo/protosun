"use strict";

function CanvasView(model, viewPort, parts) {
  this.model = model;
  this.viewPort = viewPort;
  this.parts = parts || [];
  this.maxAge = Infinity;
  this.createdAt = Date.now();
}

CanvasView.modelName = "spaceobject";
CanvasView.images = {};
CanvasRenderer.registerViewClass(CanvasView);

CustomEventTarget.call(CanvasView); // Emits "static" events from the class

CanvasView.prototype.drawImage = function (descriptor) {
  var offsetX = descriptor.offsetX || 0;
  var offsetY = descriptor.offsetY || 0;
  this.ctx.translate(this.projectedPos.x, this.projectedPos.y);
  this.ctx.rotate(this.model.heading);
  this.ctx.scale(this.viewPort.viewScale, this.viewPort.viewScale);
  this.ctx.translate(offsetX, offsetY);
  this.ctx.globalAlpha = typeof descriptor.alpha === "undefined" ? 1 : descriptor.alpha;
  this.ctx.drawImage(descriptor.image, Math.round(-descriptor.width / 2), Math.round(-descriptor.height / 2), descriptor.width, descriptor.height);
};

CanvasView.prototype.drawPart = function (descriptor) {
  this.projectedPos = this.viewPort.isInView(this.model.pos, this.model.radius);
  if (!this.projectedPos) return;

  this.ctx.save();
  this.drawImage(descriptor);
  this.ctx.restore();
};

CanvasView.prototype.drawTo = function (ctx) {
  this.ctx = ctx;
  var age = Math.min(Date.now() - this.createdAt, this.maxAge);
  this.calcAnimationState(age);
  this.parts.forEach(this.drawPart.bind(this));
};

CanvasView.prototype.calcAnimationState = function (age) {
  return age;
};

CanvasView.loadImage = function (imageName) {
  if (CanvasView.images[imageName]) {
    return CanvasView.images[imageName];
  }
  CanvasView.emit("loadstart", imageName);
  
  var image = new Image();
  
  image.addEventListener("load", function() {
    CanvasView.emit("load", imageName);
  });
  image.addEventListener("error", function() {
    console.error("Unable to load image: " + imageName);
    CanvasView.emit("error", imageName);
  });

  image.src = "img/" + imageName + ".png";
  image.width = 60;
  image.height = 60;
  CanvasView.images[imageName] = image;
  return image;
};