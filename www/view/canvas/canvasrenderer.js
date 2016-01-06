"use strict";

function CanvasRenderer(simulation, area) {
  Renderer.call(this, simulation, area);
  this.views = [];
  this.backgroundSpeedRatio = 2;
  this.defaultBgSize = 1024;
  this.displayedViewCount = 0;
  this.canvas = document.createElement("canvas");
  area.appendChild(this.canvas);
  this.canvas.width = area.width || 1000;
  this.canvas.height = area.height || 800;
  this.ctx = this.canvas.getContext('2d');
}

CanvasRenderer.prototype = new Renderer();
CanvasRenderer.prototype.constructor = CanvasRenderer;
CanvasRenderer.viewClasses = [];

CanvasRenderer.registerViewClass = function (modelName, canvasViewClass) {
  CanvasRenderer.viewClasses[modelName] = canvasViewClass;
};

CanvasRenderer.prototype.redraw = function () {
  this.camera.updateView();
  this.clearCanvas();
  this.updateBackground();
  var length = this.views.length;
  this.displayedViewCount = 0;
  for (var i = 0; i < length; i++) {
    this.updateView(this.views[i]);
  }
};

CanvasRenderer.prototype.clearCanvas = function () {
  if (this.canvas.width != this.viewElement.clientWidth || this.canvas.height != this.viewElement.clientHeight) {
    this.canvas.width = this.viewElement.clientWidth;
    this.canvas.height = this.viewElement.clientHeight;
  }
  // this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
};

CanvasRenderer.prototype.spaceObjectAdded = function (spaceObject) {
  Renderer.prototype.spaceObjectAdded.call(this, spaceObject);

  var view = this.createView(spaceObject);
  if (spaceObject instanceof SpaceShip) {
    this.ship = view;
  }
};

CanvasRenderer.prototype.spaceObjectRemoved = function (spaceObject) {
  Renderer.prototype.spaceObjectRemoved.call(this, spaceObject);
  var i = this.views.length - 1;
  while (i >= 0) {
    if (this.views[i].model === spaceObject) {
      this.views.splice(i, 1);
      return;
    }
    i--;
  }
};

CanvasRenderer.prototype.createView = function (spaceObject) {
  var viewClassName = spaceObject.constructor.name.toLowerCase();
  var ViewClass = CanvasRenderer.viewClasses[viewClassName];
  if (!ViewClass) {
    throw "No View class for " + viewClassName;
  }
  var view = new ViewClass(spaceObject, this.viewPort);
  this.views.push(view);
  return view;
};

CanvasRenderer.prototype.updateView = function (view) {
  try {
    view.drawTo(this.ctx);
  } catch (e) {
    console.warn(e);
  }
  this.displayedViewCount++;
};

CanvasRenderer.prototype.updateBackground = function () {
  if (!this.backgroundImage) {
    this.backgroundImage = new Image();
    this.backgroundImage.src = "img/background.jpg";
  }

  function nonPositiveRemainder(value, width) {
    value = value % width;
    while (value > 0) {
      value -= width;
    }
    return value;
  }

  var center = this.viewPort.modelViewPort.center;
  var bgSizeRatio = 1 + (this.viewPort.viewScale - 1) / this.backgroundSpeedRatio;
  var bgWidth = Math.round(bgSizeRatio * this.defaultBgSize);
  var bgHeight = Math.round(bgWidth * this.backgroundImage.width / this.backgroundImage.height);
  if (bgWidth < 100 || bgHeight < 100) {
    return;
  }
  var x = nonPositiveRemainder(Math.round(-center.x / this.backgroundSpeedRatio * bgSizeRatio), bgWidth);
  var y = nonPositiveRemainder(Math.round(-center.y / this.backgroundSpeedRatio * bgSizeRatio), bgHeight);
  while (x < this.canvas.width) {
    var yy = y;
    while (yy < this.canvas.height) {
      this.ctx.drawImage(this.backgroundImage, x, yy, bgWidth, bgHeight);
      yy += bgHeight;
    }
    x += bgWidth;
  }

  /*this.viewElement.style.backgroundPosition = Math.round(-center.x / this.backgroundSpeedRatio * bgSizeRatio) + "px " + Math.round(-center.y / this.backgroundSpeedRatio * bgSizeRatio) + "px";
  this.viewElement.style.backgroundSize = Math.round(bgSizeRatio * this.defaultBgSize) + "px";*/
};
