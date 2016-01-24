"use strict";

function FixedStar(pos, v, mass) {
  Star.call(this, pos, v, mass);
}

FixedStar.prototype = Object.create(Star.prototype);
FixedStar.prototype.constructor = FixedStar;

FixedStar.prototype.oneStep = function () {
  this.stepForce = Vector.zero.clone();
  SpaceObject.prototype.oneStep.call(this);
};