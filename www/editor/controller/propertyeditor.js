"use strict";

function PropertyEditor(editor, containingViewOrElement) {
  this.editor = editor;
  this.editor.addEventListener("selected", this.selectHandler.bind(this));
  this.spaceObject = {};
  this.view = new PropertyEditorView(this.spaceObject, containingViewOrElement);
  this.view.addEventListener("typechange", this.typeChangeHandler.bind(this));
  Controller.call(this, this.model, this.view);
}

PropertyEditor.prototype = Object.create(Controller.prototype);
PropertyEditor.prototype.constructor = PropertyEditor;

PropertyEditor.prototype.selectHandler = function (event) {
  var spaceObject = event.detail;
  this.loadSpaceObject(spaceObject);
};

PropertyEditor.prototype.loadSpaceObject = function(spaceObject) {
  this.spaceObject = spaceObject;
  this.view.setModel(this.spaceObject);
};

PropertyEditor.prototype.changeHandler = function (event) {
  Controller.prototype.changeHandler.call(this, event);
  this.editor.render();
};

PropertyEditor.prototype.typeChangeHandler = function (event) {
  var NewType = window[event.detail];
  if (typeof NewType !== "function") {
    console.error("Unknown type: " + event.detail);
    return;
  }
  var old = this.spaceObject;
  var simulation = old.simulation;
  var newSpaceObject = new NewType();
  this.copySpaceObject(old, newSpaceObject);
  
  simulation.removeSpaceObject(old);
  simulation.addSpaceObject(newSpaceObject);
  simulation.purgeSpaceObjects();
  
  this.loadSpaceObject(newSpaceObject);
};

PropertyEditor.prototype.copySpaceObject = function (source, target) {
  var copiedPropertyNames = ["pos", "v"];
  for (var prop in source) {
    if (copiedPropertyNames.indexOf(prop) !== -1) {
      target[prop] = source[prop];      
    }
  }
};


