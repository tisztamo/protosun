"use strict";

function DragController(editor) {
  this.editor = editor;
  this.model = {};
  Controller.call(this, this.model, null);
  editor.view.rootElement.addEventListener("pointerdown", this.downHandler.bind(this), true);
  editor.view.rootElement.addEventListener("pointermove", this.moveHandler.bind(this), true);
  editor.view.rootElement.addEventListener("pointerup", this.upHandler.bind(this), true);
  this.lastDragX = null;
}

DragController.prototype = Object.create(Controller.prototype);
DragController.prototype.constructor = DragController;

DragController.prototype.downHandler = function (event) {
  if (!this.editor.isPointerEventOnScene(event)) return;
  var spaceObject = this.editor.renderer.clickedObject(event.clientX, event.clientY);
  if (spaceObject && spaceObject === this.editor.selectedObject) {
    event.stopPropagation();
    this.lastDragX = event.clientX;
    this.lastDragY = event.clientY;
  }
};

DragController.prototype.moveHandler = function (event) {
  if (this.lastDragX === null) {
    return;
  }
  event.stopPropagation();
  this.editor.selectedObject.pos.add(new Vector(event.clientX - this.lastDragX, event.clientY - this.lastDragY).multiply(1 / this.editor.renderer.viewPort.viewScale));
  this.lastDragX = event.clientX;
  this.lastDragY = event.clientY;
  this.editor.render();
};

DragController.prototype.upHandler = function (event) {
  if (this.lastDragX) {
    this.lastDragX = null;
    event.stopPropagation();
  }
};