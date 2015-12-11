"use strict";

function View(model, templateId) {
  this.rootElement = this.createRootElement(model, templateId);
  this.loadViewElements();
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

View.prototype.loadViewElements = function () {
  if (!this.rootElement) {
    return;
  }
  var viewElementList = this.rootElement.querySelectorAll("[data-view]");
  this.viewElements = {};
  for (var i = 0; i < viewElementList.length; i++) {
    var element = viewElementList[i];
    this.viewElements[element.getAttribute("data-view")] = element;
  }
};