"use strict";

function SpaceDebris(pos, v, mass, heading) {
  SpaceObject.call(this, pos, v, mass, heading);
  this.angularSpeed = Math.random() * 0.1 - 0.05;
}

SpaceDebris.prototype = new SpaceObject();
SpaceDebris.prototype.constructor = SpaceDebris;
