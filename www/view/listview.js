"use strict";

function ListView(model, rootElement, projection) {
  this.model = model;
  this.templateId = rootElement.getAttribute("data-template");
  this.rootElement = rootElement;
  this.projection = projection;
  this.createSubViews();
}

ListView.prototype.createSubViews = function() {
  this.subViews = [];
  var listView = this;
  this.model.forEach(function (item) {
    listView.subViews.push(Controller.createForTemplate(listView.templateId, item, listView.rootElement, listView.projection));
  });
};

