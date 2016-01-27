/*jshint -W098 */
"use strict";


/**
 * Misile launching capability. Can be mixed into {@link SpaceObject}s.
 * @mixin
 */
function MissileLauncher(throttleInMs) {
  throttleInMs = throttleInMs || 500;
  var lastLaunchTS = 0;
  
  /**
   * Launches a missile to the current heading of this {@link SpaceObject}
   * Returns true if the missile is launched, false if throttling prevented the launch.
   */
  this.launchMissile = function () {
    if (this.getTimeToNextMissile() !== 0) {
      return false;
    }
    var direction = Vector.createFromPolar(this.heading, 1);
    var v = this.v.clone();
    var missile = new Missile(this.pos.clone(), v, this.heading);
    missile.pos.add(direction.clone().multiply(this.radius + missile.radius + 5));
    this.simulation.addSpaceObject(missile);
    lastLaunchTS = Date.now();
    return true;
  };
  
  this.getTimeToNextMissile = function () {
    return Math.min(0, Date.now() - lastLaunchTS - throttleInMs);
  };
}

