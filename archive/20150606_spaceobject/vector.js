"use strict";

function Vector(x, y) {
  this.x = x;
  this.y = y;
}

Vector.prototype.add = function (another) {
  this.x += another.x;
  this.y += another.y;
  return this;
};

Vector.prototype.multiply = function (scalar) {
  this.x *= scalar;
  this.y *= scalar;
  return this;
};

Vector.prototype.toString = function () {
  return "(" + this.x + ", " + this.y + ")";
};