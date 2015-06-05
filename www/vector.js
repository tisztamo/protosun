"use strict";

function Vector(x, y) {
  this.x = x;
  this.y = y;
}

Vector.prototype.addLocal = function (another) {
  this.x += another.x;
  this.y += another.y;
};

Vector.prototype.toString = function () {
  return "(" + this.x + ", " + this.y + ")";
};