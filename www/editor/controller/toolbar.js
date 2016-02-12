"use strict";

function Toolbar(editor, containingViewOrElement) {
  this.editor = editor;
  this.model = {};
  var projection = {
    forecastSteps: function (value) {
      if (typeof value !== "undefined") {
        editor.renderer.forecastSteps = Number(value);
        editor.render();
      }
      return {
        value: editor.renderer.forecastSteps
      };
    }
  };
  this.view = new View(this.model, "toolbar", containingViewOrElement, projection);
  this.eventMapping = {
    createobject: {
      click: this.createObject.bind(this)
    },
    play: {
      click: this.editor.play.bind(this.editor)
    }
  };
  Controller.call(this, this.model, this.view);
}

Toolbar.prototype = Object.create(Controller.prototype);
Toolbar.prototype.constructor = Toolbar;

Toolbar.prototype.createObject = function () {
  var spaceObject = new Planet(new Vector(100, 100), Vector.zero.clone());
  this.editor.addSpaceObject(spaceObject);
};
