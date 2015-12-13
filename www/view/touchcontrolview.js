"use strict";

function TouchControlView(touchControl) {
  View.call(this, touchControl, "touchcontrol");
}

TouchControlView.prototype = new View();
TouchControlView.prototype.constructor = TouchControlView;

TouchControlView.prototype.createView = function (templateid) {
  var template = document.getElementById(templateid);
  var view = template.cloneNode(true);
  view.id = "control_" + this.model.spaceShip.id;
  view.model = this.model.spaceship;
  view.classList.remove("template");
  return view;
};