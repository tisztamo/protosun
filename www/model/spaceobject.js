"use strict";

function SpaceObject(pos, v, mass, heading, angularSpeed) {
  this.pos = pos;
  this.v = v;
  this.mass = mass || 1;
  this.reciprocalMass = 1 / this.mass;
  this.heading = heading || 0;
  this.angularSpeed = angularSpeed || 0;
  this.stepForce = new Vector(0, 0);
  this.id = SpaceObject.prototype.getNextId();
  this.simulation = null;
}

SpaceObject.G = 50;
SpaceObject.prototype.permeable = false;

SpaceObject.actGravityForce = function (spaceObject1, spaceObject2) {
  var distance = spaceObject1.pos.distanceFrom(spaceObject2.pos);
  if (distance < 15) {
    return;
  }
  var forceMagnitude = spaceObject1.mass * spaceObject2.mass * SpaceObject.G / Math.pow(distance, 2);
  var forceDirection = spaceObject1.pos.substractToNew(spaceObject2.pos).toUnitVector();
  var force = forceDirection.multiply(forceMagnitude);
  spaceObject2.stepForce.add(force);
  spaceObject1.stepForce.add(force.multiply(-1));
  return distance;
};

SpaceObject.prototype.nextId = 1;

SpaceObject.prototype.getNextId = function () {
  var id = "SO" + SpaceObject.prototype.nextId;
  SpaceObject.prototype.nextId += 1;
  return id;
};

SpaceObject.prototype.oneStep = function () {
  this.v.add(this.stepForce.multiply(this.reciprocalMass));
  this.pos.add(this.v);
  this.heading += this.angularSpeed;
  this.stepForce = new Vector(0, 0);
};

/*jshint -W098 */

/**
 * @abstract
 * Acts on the another SpaceObject from the given distance.
 * Gravity action is not simulated here, only game-specific actions.
 *
 * Distance is calculated previously.
 * @param {SpaceObject} another The SpaceObject to act on.
 * @param distance The precalculated distance between this and another
 */
SpaceObject.prototype.actOn = function (another, distance) {};