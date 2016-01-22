"use strict";

function Controller(model, view) {
  this.model = model;
  this.view = view;
  this.controlElements = this.view && this.view.loadElementsToObject("[data-control]", "data-control");
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