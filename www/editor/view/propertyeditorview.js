"use strict";

function PropertyEditorView(model, containingElement) {
  var numberGetSet = function (prop1, prop2) {
    if (prop2) {
      return function (newVal) {
        if (typeof newVal !== "undefined") {
          this.model[prop1][prop2] = Number(newVal);
        }
        return {
          value: (this.model[prop1] ? this.model[prop1][prop2] : 0)
        };
      };
    } else {
      return function (newVal) {
        if (typeof newVal !== "undefined") {
          this.model[prop1] = Number(newVal);
        }
        return {
          value: this.model[prop1]
        };
      };
    }
  };

  this.projection = {
    root: function () {
      return {
        style: {
          visibility: (this.model && this.model instanceof SpaceObject) ? "visible" : "hidden"
        }
      };
    },
    type: function (newType) {
      if (newType) {
        this.emit("typechange", newType);
        return newType;
      }
      return {
        value: this.model.constructor.name
      };
    },
    x: numberGetSet("pos", "x"),
    y: numberGetSet("pos", "y"),
    vx: numberGetSet("v", "x"),
    vy: numberGetSet("v", "y"),
    mass: numberGetSet("mass"),
    indestructible: function (value) {
      if (typeof value !== "undefined") {
        this.model.isIndestructible = value;
      }
      return {
        checked: this.model.isIndestructible
      };
    }
  };
  View.call(this, model, "propertyeditor", containingElement);
  CustomEventTarget.call(this);
}

PropertyEditorView.prototype = Object.create(View.prototype);
PropertyEditorView.prototype.constructor = PropertyEditorView;