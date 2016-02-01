"use strict";

function PropertyEditorView(model, containingElement) {
  var numberGetSet = function (prop1, prop2) {
    return function (newVal) {
      if (typeof newVal !== "undefined") {
        this.model[prop1][prop2] = Number(newVal);
      }
      return {
        value: (this.model[prop1] ? this.model[prop1][prop2] : 0)
      };
    };
  };

  this.projection = {
    x: numberGetSet("pos", "x"),
    y: numberGetSet("pos", "y"),
    vx: numberGetSet("v", "x"),
    vy: numberGetSet("v", "y")
  };
  View.call(this, model, "propertyeditor", containingElement);
}

PropertyEditorView.prototype = Object.create(View.prototype);
PropertyEditorView.prototype.constructor = PropertyEditorView;