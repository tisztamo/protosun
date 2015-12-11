"use strict";

function TouchControlView(touchControl) {
  this.model = touchControl;
  this.rootElement = this.createRootElement(this.model);
}

TouchControlView.prototype = new View();
TouchControlView.prototype.constructor = TouchControlView;

TouchControlView.prototype.templateId = "touchcontrol";

TouchControlView.prototype.createView = function (templateid) {
  var template = document.getElementById(templateid);
  var view = template.cloneNode(true);
  view.id = "control_" + this.model.spaceShip.id;
  view.model = this.model.spaceship;
  view.classList.remove("template");
  return view;
};
