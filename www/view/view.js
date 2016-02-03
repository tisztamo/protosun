"use strict";

function View(model, templateId, containingViewOrElement, projection) {
  if (typeof projection === "object") {
    this.projection = projection;
  }
  this.rootElement = this.createRootElement(model, templateId);
  if (!this.rootElement) {
    console.error("Template \"" + templateId + "\" not found.");
    return;
  }
  if (containingViewOrElement) {
    if (containingViewOrElement instanceof View) {
      containingViewOrElement = containingViewOrElement.rootElement;
    }
    this.containingElement = containingViewOrElement;
    this.containingElement.appendChild(this.rootElement);
  }

  this.viewElements = this.loadElementsToObject("[data-field]", "data-field");
  this.setModel(model);
}

View.prototype.idPrefix = "view_";
View.prototype.templateId = "view";
View.prototype.projection = {};

View.prototype.createRootElement = function (model, templateId) {
  templateId = templateId || this.templateId;
  var template = document.getElementById(templateId);
  if (!template) {
    return null;
  }
  var rootElement = template.cloneNode(true);
  var id = model && model.id ? model.id : "autogen" + Math.round(Math.random() * 100000);
  rootElement.id = id;
  rootElement.classList.remove("template");
  return rootElement;
};

View.prototype.loadElementsToObject = function (selector, namingAttribute) {
  if (!this.rootElement) {
    return;
  }
  var retval = {};
  Array.from(this.rootElement.querySelectorAll(selector))
    .forEach(function (element) {
      retval[element.getAttribute(namingAttribute)] = element;
    });
  return retval;
};

View.prototype.calculateFieldValue = function (fieldName) {
  try {
    var fieldProjector = this.projection[fieldName];
    if (typeof fieldProjector === "undefined") {
      return this.model[fieldName];
    } else if (typeof fieldProjector == "function") {
      return fieldProjector.call(this);
    }
    return fieldProjector;
  } catch (ex) {
    console.warn("Unable to calculate value for field " + fieldName, ex);
    return "N/A";
  }
};

View.prototype.updateField = function (fieldName) {
  var viewElement = this.viewElements[fieldName];
  var fieldValue = this.calculateFieldValue(fieldName);
  if (typeof fieldValue === "object") {
    for (var attributeName in fieldValue) {
      viewElement[attributeName] = fieldValue[attributeName];
    }
  } else {
    viewElement.textContent = fieldValue;
  }
};

View.prototype.updateAll = function () {
  for (var fieldName in this.viewElements) {
    this.updateField(fieldName);
  }
};

View.prototype.setModel = function (model) {
  this.model = model;
  this.updateAll();
};