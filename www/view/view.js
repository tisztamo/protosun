"use strict";

function View(model, templateId) {
  this.model = model;
  this.rootElement = this.createRootElement(model, templateId);
  this.viewElements = this.loadElementsToObject("[data-view]", "data-view");
  this.updateAll();
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
  rootElement.model = model;
  rootElement.classList.remove("template");
  return rootElement;
};

View.prototype.loadElementsToObject = function (selector, namingAttribute) {
  if (!this.rootElement) {
    return;
  }
  var elementList = this.rootElement.querySelectorAll(selector);
  var retval = {};
  for (var i = 0; i < elementList.length; i++) {
    var element = elementList[i];
    retval[element.getAttribute(namingAttribute)] = element;
  }
  return retval;
};

View.prototype.calculateFieldValue = function (fieldName) {
  var fieldProjector = this.projection[fieldName];
  if (typeof fieldProjector === "undefined") {
    return this.model[fieldName];
  } else if (typeof fieldProjector == "function") {
    return fieldProjector.call(this, fieldName);
  }
  return fieldProjector;
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