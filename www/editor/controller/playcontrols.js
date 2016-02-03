"use strict";

function PlayControls(editor, containingViewOrElement) {
  this.editor = editor;
  this.model = {};
  this.view = new View(this.model, "playcontrols", containingViewOrElement);
  this.eventMapping = {
    edit: {
      click: this.editor.edit.bind(this.editor)
    },
    restart: {
      click: this.editor.restart.bind(this.editor.restart)
    }
  };
  Controller.call(this, this.model, this.view);
}

PlayControls.prototype = Object.create(Controller.prototype);
PlayControls.prototype.constructor = PlayControls;
