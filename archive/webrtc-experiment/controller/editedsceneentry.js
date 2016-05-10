"use strict";

function EditedSceneEntry(model, containingViewOrElement) {
  this.eventMapping = {
    edit: {
      click: this.edit.bind(this)
    }
  };
  Controller.call(this, model, containingViewOrElement);
}

EditedSceneEntry.prototype = Object.create(Controller.prototype);
EditedSceneEntry.prototype.constructor = EditedSceneEntry;

Controller.registerClass(EditedSceneEntry);

EditedSceneEntry.prototype.edit = function (event) {
  var editor = new Editor(document.body, this.model.localLevelIndex);
};