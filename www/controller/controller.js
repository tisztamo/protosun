"use strict";

function Controller(model, view) {
  this.model = model;
  this.view = view;
  this.controlElements = this.view && this.view.loadElementsToObject("[data-control]", "data-control");
  this.setupDataBinding();
  this.bindEvents();
}

Controller.prototype.eventMapping = {};

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

Controller.prototype.clearDataBinding = function() {
  if (this.installedChangeHandler) {
    this.view.rootElement.removeEventListener("change", this.installedChangeHandler);
    this.installedChangeHandler = null;
  }
};

Controller.prototype.changeHandler = function (event) {
  var fieldName = event.target.getAttribute("data-field");
  var value = event.target.value;
  var fieldProjector = this.view.projection[fieldName];
  if (typeof fieldProjector === "undefined") {
    this.model[fieldName] = value;
  } else if (typeof fieldProjector == "function") {
    fieldProjector.call(this.view, value);
  }
};