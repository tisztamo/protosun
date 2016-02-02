"use strict";

function SelectorController(editor, containingViewOrElement) {
  this.editor = editor;
  this.model = {};
  this.view = new View(this.model, "selector", containingViewOrElement);
  Controller.call(this, this.model, this.view);
  editor.view.rootElement.addEventListener("click", this.upHandler.bind(this));
}

SelectorController.prototype = Object.create(Controller.prototype);
SelectorController.prototype.constructor = SelectorController;

SelectorController.prototype.upHandler = function (event) {
  if (event.target.tagName !== "CANVAS") {
    return;
  }
  var spaceObject = this.editor.renderer.clickedObject(event.clientX, event.clientY);
  if (spaceObject) {
    this.editor.selectSpaceObject(spaceObject);
  }
};