"use strict";

function MissileLauncher() {
}

Mixin.mixInto(MissileLauncher);

MissileLauncher.prototype.launchMissile = function () {
  var direction = Vector.createFromPolar(this.heading, 1);
  var pos = this.pos.clone().add(direction.clone().multiply(35));
  var v = this.v.clone();
  var missile = new Missile(pos, v, this.heading);
  this.simulation.addSpaceObject(missile);
};