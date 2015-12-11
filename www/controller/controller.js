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
  for (var controlName in this.eventMapping) {
    var control = this.controlElements[controlName];
    var events = this.eventMapping[controlName];
    for (var eventName in events) {
      try {
        control.addEventListener(eventName, events[eventName]);
      } catch (e) {
        console.error("Cannot bind event " + eventName + " to control " + controlName, e);
      }
    }
  }
};