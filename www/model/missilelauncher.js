/*jshint -W098 */
"use strict";


/**
 * Misile launching capability. Can be mixed into {@link SpaceObject}s.
 * @mixin
 */
function MissileLauncher() {
  /**
   * Launches a missile to the current heading of this {@link SpaceObject}
   */
  this.launchMissile = function () {
    var direction = Vector.createFromPolar(this.heading, 1);
    var v = this.v.clone();
    var missile = new Missile(this.pos.clone(), v, this.heading);
    missile.pos.add(direction.clone().multiply(this.radius + missile.radius + 5));
    this.simulation.addSpaceObject(missile);
  };
}

