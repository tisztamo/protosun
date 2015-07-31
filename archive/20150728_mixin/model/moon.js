"use strict";

function Moon(pos, v, mass) {
  SpaceObject.call(this, pos, v, mass);
}

Moon.prototype = new SpaceObject();
Moon.prototype.constructor = Moon;