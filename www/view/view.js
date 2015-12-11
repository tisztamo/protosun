"use strict";

function View(model, templateId) {
  this.rootElement = this.createRootElement(model, templateId);
  this.viewElements = this.loadElementsToObject("[data-view]", "data-view");
}

View.prototype.idPrefix = "view_";
View.prototype.templateId = "view";

View.prototype.createRootElement = function (model, templateId) {
  templateId = templateId || this.templateId;
  var template = document.getElementById(templateId);
  if (!template) {
    return null;
  }
  var view = template.cloneNode(true);
  var id = model && model.id ? model.id : "autogen" + Math.round(Math.random() * 100000);
  view.id = id;
  view.model = model;
  view.classList.remove("template");
  return view;
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