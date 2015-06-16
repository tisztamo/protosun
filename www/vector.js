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

Vector.prototype.distanceFrom = function (another) {
  var xDiff = another.x - this.x,
    yDiff = another.y - this.y;
  return Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2));
};

Vector.prototype.length = function () {
  return this.distanceFrom(Vector.zero);
};

Vector.prototype.substractToNew = function (another) {
  return new Vector(this.x - another.x, this.y - another.y);
};

Vector.prototype.toUnitVector = function () {
  return this.multiply(1 / this.length());
};

Vector.prototype.toString = function () {
  return "(" + this.x + ", " + this.y + ")";
};

Vector.zero = new Vector(0, 0);