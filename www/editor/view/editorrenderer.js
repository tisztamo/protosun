"use strict";

function EditorRenderer(editor, containingViewOrElement) {
  CanvasRenderer.call(this, editor.simulation, containingViewOrElement);
  this.editor = editor;
}

EditorRenderer.prototype = Object.create(CanvasRenderer.prototype);
EditorRenderer.prototype.constructor = EditorRenderer;

EditorRenderer.prototype.updateView = function (view) {
  CanvasRenderer.prototype.updateView.call(this, view);
  try {
    if (view.model === this.editor.selectedObject) {
      view.drawPart({
        image: CanvasView.loadImage("selected"),
        width: view.model.radius * 2.2,
        height: view.model.radius * 2.2
      });
    }
  } catch (e) {
    console.warn(e);
  }
};

EditorRenderer.prototype.nearestObject = function(clientX, clientY) {
  var pos = this.viewPort.projectToModel(new Vector(clientX, clientY));
  var minDistance = Infinity;
  var found = null;
  for (var i = 0; i < this.views.length; ++i) {
    var spaceObject = this.views[i].model;
    var distance = spaceObject.pos.distanceFrom(pos) - spaceObject.radius;
    if (distance < minDistance) {
      minDistance = distance;
      found = spaceObject;
    }
  }
  return found;
};

EditorRenderer.prototype.clickedObject = function (clientX, clientY) {
  var spaceObject = this.nearestObject(clientX, clientY);
  var pos = this.viewPort.projectToModel(new Vector(clientX, clientY));
  if (!spaceObject || spaceObject.pos.distanceFrom(pos) > 10 + spaceObject.radius) {
    return null;
  }
  return spaceObject;
};