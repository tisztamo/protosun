"use strict";

function Toolbar(editor, containingViewOrElement) {
  this.editor = editor;
  this.model = {};
  this.view = new View(this.model, "toolbar", containingViewOrElement);
  this.eventMapping = {
    createobject: {
      click: this.createObject.bind(this),
    }
  };
  Controller.call(this, this.model, this.view);
}

Toolbar.prototype = Object.create(Controller.prototype);
Toolbar.prototype.constructor = Toolbar;

Toolbar.prototype.createObject = function () {
  var spaceObject = new Star(new Vector(100, 100), Vector.zero.clone());
  this.editor.addSpaceObject(spaceObject);
};