"use strict";

function Star(pos, v, mass) {
  SpaceObject.call(this, pos, v, mass);
}

Star.prototype = new SpaceObject();
Star.prototype.constructor = Star;