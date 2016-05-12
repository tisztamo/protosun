"use strict";

function LangUtils() {}

LangUtils.mergeProperty = function (destinationObj, sourceObj, propertyName) {
  var source = sourceObj[propertyName];
  var destination = destinationObj[propertyName];
  if (source === null || typeof source === "undefined") {
    return;
  }
  if (typeof source === "object") {
    if (destination) {
      LangUtils.deepMerge(destination, source);
    } else if (typeof source.clone === "function") {
      destinationObj[propertyName] = source.clone();
    } else {
      console.warn("mergeProperty ignores " + propertyName);
    }
  } else if (typeof destination !== "function") {
    destinationObj[propertyName] = source;
  }
};

LangUtils.deepMerge = function deepMerge(destination, source) {
  if (!source) {
    return destination;
  }
  for (var property in source) {
    if (source.hasOwnProperty(property)) {
      LangUtils.mergeProperty(destination, source, property);
    }
  }
  return destination;
};