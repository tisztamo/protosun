"use strict";

function PropertyEditor(editor, containingViewOrElement) {
  this.editor = editor;
  this.editor.addEventListener("selected", this.selectHandler.bind(this));
  this.model = {};
  this.view = new PropertyEditorView(this.model, containingViewOrElement);
  this.eventMapping = {
/*    createobject: {
      click: this.createObject.bind(this),
    }*/
  };
  Controller.call(this, this.model, this.view);
}

PropertyEditor.prototype = Object.create(Controller.prototype);
PropertyEditor.prototype.constructor = PropertyEditor;

PropertyEditor.prototype.selectHandler = function (event) {
  var spaceObject = event.detail;
  this.loadSpaceObject(spaceObject);
};

PropertyEditor.prototype.loadSpaceObject = function(spaceObject) {
  this.view.setModel(spaceObject);
};

PropertyEditor.prototype.changeHandler = function (event) {
  Controller.prototype.changeHandler.call(this, event);
  this.editor.render();
};