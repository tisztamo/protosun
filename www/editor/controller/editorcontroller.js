"use strict";

function EditorController() {
  this.model = {};
  this.view = new View(this.model, "editor");

  Controller.call(this, this.model, this.view);
}

EditorController.prototype = Object.create(Controller.prototype);
EditorController.prototype.constructor = EditorController;
