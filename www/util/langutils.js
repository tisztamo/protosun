"use strict";

function LangUtils() {}

LangUtils.deepMerge = function deepMerge(destination, source) {
  if (!source) {
    return destination;
  }
  for (var property in source) {
    if (source.hasOwnProperty(property)) {
      if (typeof source[property] === "object" &&
        destination[property]) {
        deepMerge(destination[property], source[property]);
      } else if (typeof destination[property] !== "function") {
        destination[property] = source[property];
      }
    }
  }
  return destination;
};