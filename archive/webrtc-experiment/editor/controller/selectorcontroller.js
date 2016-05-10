"use strict";

function SelectorController(editor, containingViewOrElement) {
  this.editor = editor;
  this.model = {};
  Controller.call(this, this.model, containingViewOrElement);
  editor.view.rootElement.addEventListener("pointerup", this.upHandler.bind(this));
  editor.view.rootElement.addEventListener("pointerdown", this.downHandler.bind(this));
}

SelectorController.prototype = Object.create(Controller.prototype);
SelectorController.prototype.constructor = SelectorController;

Controller.registerClass(SelectorController, "Selector");

SelectorController.prototype.downHandler = function (event) {
  this.down = new Vector(event.clientX, event.clientY);
};

SelectorController.prototype.upHandler = function (event) {
  if (!this.editor.isPointerEventOnScene(event) ||
     this.down.distanceFrom(new Vector(event.clientX, event.clientY)) > 5) return;
  var spaceObject = this.editor.renderer.clickedObject(event.clientX, event.clientY) || {};
  this.editor.selectSpaceObject(spaceObject);
};