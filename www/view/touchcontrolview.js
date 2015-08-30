"use strict";

function TouchControlView(touchControl, targetElement) {
  this.model = touchControl;
  this.rootElement = this.createView("touchcontrol", targetElement);
}

TouchControlView.prototype.createView = function (templateid, targetElement) {
  var template = document.getElementById(templateid);
  var view = template.cloneNode(true);
  view.id = "control_" + this.model.spaceShip.id;
  view.model = this.model.spaceship;
  view.classList.remove("template");
  targetElement.appendChild(view);
  return view;
};
