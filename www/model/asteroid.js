"use strict";

function Asteroid(pos, v, mass) {
  SpaceObject.call(this, pos, v, mass, 0, Math.random() / 10 - 0.05);
  this.radius = 15;
}

Asteroid.prototype = Object.create(SpaceObject.prototype);
Asteroid.prototype.constructor = Asteroid;
