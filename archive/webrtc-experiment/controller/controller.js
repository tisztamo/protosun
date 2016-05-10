"use strict";

/**
 * Call from subclasses! Initializes the controller and optionally a view for it (if the view property is not already defined in the object under creation)
 */
function Controller(model, /* optional*/ containingViewOrElement, /* optional*/ projection) {
  this.model = model;
  if (!this.view) {
    this.view = new View(this.model, this.templateId, containingViewOrElement, projection);
  }
  this.controlElements = this.view && this.view.loadElementsToObject("[data-control]", "data-control");
  this.setupDataBinding();
  this.bindEvents();
}

Controller.prototype.eventMapping = {};

Controller.controllerClasses = {};

Controller.registerClass = function registerClass(controllerClass, templateId) {
  if (typeof templateId === "undefined") {
    templateId = controllerClass.name;
  }
  controllerClass.prototype.templateId = templateId;
  Controller.controllerClasses[templateId] = controllerClass;
};

Controller.createForTemplate = function (templateId, model, containingViewOrElement) {
  var ControllerClass = Controller.controllerClasses[templateId];
  if (typeof ControllerClass !== "function") {
    var retval = new Controller();
    retval.view = null;
    retval.templateId = templateId;
    Controller.call(retval, model, containingViewOrElement);
    return retval;
  }
  return new ControllerClass(model, containingViewOrElement);
};

/** @private */
Controller.prototype.bindEvents = function () {
  var that = this;

  function createHandler(eventName, eventHandler, control) {
    try {
      control.addEventListener(eventName, function (evt) {
        evt.preventDefault();
        eventHandler.call(that, evt);
      });
    } catch (e) {
      console.error("Cannot bind event " + eventName + " to control " + controlName, e);
    }
  }
  for (var controlName in this.eventMapping) {
    var control = this.controlElements[controlName];
    var events = this.eventMapping[controlName];
    for (var eventName in events) {
      createHandler(eventName, events[eventName], control);
    }
  }
};

Controller.prototype.setupDataBinding = function () {
  if (!this.view || !this.view.rootElement) {
    return;
  }
  this.clearDataBinding();
  this.dataElements = this.view.loadElementsToObject("input[data-field],select[data-field]", "data-field");
  if (Object.keys(this.dataElements).length) {
    this.installedChangeHandler = this.changeHandler.bind(this);
    this.view.rootElement.addEventListener("change", this.installedChangeHandler);
  }
};

Controller.prototype.clearDataBinding = function () {
  if (this.installedChangeHandler) {
    this.view.rootElement.removeEventListener("change", this.installedChangeHandler);
    this.installedChangeHandler = null;
  }
};

Controller.prototype.changeHandler = function (event) {
  var fieldName = event.target.getAttribute("data-field");
  var value = event.target.value;
  if (event.target.type == "checkbox") {
    value = event.target.checked;
  }
  var fieldProjector = this.view.projection[fieldName];
  if (typeof fieldProjector === "undefined") {
    this.model[fieldName] = value;
  } else if (typeof fieldProjector == "function") {
    fieldProjector.call(this.view, value);
  }
};