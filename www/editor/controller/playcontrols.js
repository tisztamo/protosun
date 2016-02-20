"use strict";

function PlayControls(editor, containingViewOrElement) {
  this.editor = editor;
  this.model = {};
  this.eventMapping = {
    edit: {
      click: this.editor.edit.bind(this.editor)
    }
  };
  Controller.call(this, this.model, containingViewOrElement);
}

PlayControls.prototype = Object.create(Controller.prototype);
PlayControls.prototype.constructor = PlayControls;

Controller.registerClass(PlayControls);