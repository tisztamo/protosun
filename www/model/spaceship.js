"use strict";

function SpaceShip(pos, v, mass, heading) {
  SpaceObject.call(this, pos, v, mass, heading);
}

SpaceShip.prototype = new SpaceObject();
SpaceShip.prototype.constructor = SpaceShip;