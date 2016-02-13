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
  this.loadLists();
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
  var id = model && model.id ? model.id : "auto" + Math.round(Math.random() * 100000);
  rootElement.id = id;
  rootElement.view_model = model;//TODO ES6: move to a Map-based implementation
  rootElement.classList.remove("template");
  return rootElement;
};

View.prototype.loadLists = function () {
  var listElements = this.loadElementsToObject("[data-list]", "data-list");
  this.lists = {};
  for (var listModelName in listElements) {
    this.lists[listModelName] = new ListView(this.model[listModelName],
      listElements[listModelName], this.projection[listModelName]);
  }
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
  function setCSSClasses(targetObject, classes) {
    for (var c in classes) {
      if (classes[c]) {
        targetObject.classList.add(c);
      } else {
        targetObject.classList.remove(c);
      }
    }
  }
  var viewElement = this.viewElements[fieldName];
  var fieldValue = this.calculateFieldValue(fieldName);
  
  if (fieldValue.class) {
    setCSSClasses(viewElement, fieldValue.class);
    fieldValue.class = null;
  }
  
  if (typeof fieldValue === "object") {
    LangUtils.deepMerge(viewElement, fieldValue);
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

View.prototype.getModelForElement = function (element) {
  while (element) {
    if (element.view_model) {
      return element.view_model;
    }
    element = element.parentNode;
  }
};

View.prototype.show = function (visible) {
  this.rootElement.style.visibility = visible === false ? "hidden" : "visible";
};