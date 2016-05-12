"use strict";

/** Base class for simulation entities.
 * @param pos {Vector} - Position of the object
 * @param v {Vector} - Speed
 * @param {number} [mass=1]
 * @param {number} [heading=0]
 * @param {number} [angularSpeed=0] - Speed of the rotation around the center of the object.
 * @class
 */
function SpaceObject(pos, v, mass, heading, angularSpeed) {
  this.pos = pos;
  this.v = v;
  this.mass = mass || 1;
  this.heading = heading || 0;
  this.angularSpeed = angularSpeed || 0;
  /** The collected forces acting on the object in the current simulation step. Acting forces should be added to it.
   * @type {Vector}
   */
  this.stepForce = new Vector(0, 0);
  /** Radius of the circle used to approximate the shape of the object in basic collision-like calculations. For circular objects it is the radius of the object */
  this.radius = 20;
  this.id = SpaceObject.getNextId();
  this.simulation = null;
}

/** Gravitational constant {@link https://en.wikipedia.org/wiki/Gravitational_constant} */
SpaceObject.G = 50;

/** Permeable objects are not involved in collision-like events */
SpaceObject.prototype.permeable = false;

/** Indestructible objects cannot be destructed, they remain in the simulation after destruction with e.g. a missile*/
SpaceObject.prototype.isIndestructible = false;

/** simulates the gravity force between the two {@link SpaceObject}s. Does nothing when the distance is too small thus the high gravity force would lead to unacceptable calculation errors.
 * @return {number} The distance of the given SpaceObjects
 */
SpaceObject.actGravityForce = function (spaceObject1, spaceObject2) {
  var distance = spaceObject1.pos.distanceFrom(spaceObject2.pos);
  if (distance < 15) { //Minimal distance needed
    return;
  }
  var forceMagnitude = spaceObject1.mass * spaceObject2.mass * SpaceObject.G / Math.pow(distance, 2);
  var forceDirection = spaceObject1.pos.substractToNew(spaceObject2.pos).toUnitVector();
  var force = forceDirection.multiply(forceMagnitude);
  spaceObject2.stepForce.add(force);
  spaceObject1.stepForce.add(force.multiply(-1));
  return distance;
};

/* @private */
SpaceObject.nextId = Math.round(Math.random() * 1000000);

/* @private */
SpaceObject.getNextId = function () {
  var id = "SO" + SpaceObject.nextId;
  SpaceObject.nextId += 1;
  return id;
};

/**
 * Simulates one step of this SpaceObject.
 * Calculates the acceleration of the object from {@link SpaceObject#stepForce} and {@link SpaceObject#mass}. Also simulates the heading and position change.
 * Should be extended in subclasses.
 */
SpaceObject.prototype.oneStep = function () {
  this.v.add(this.stepForce.multiply(1 / this.mass));
  this.pos.add(this.v);
  this.heading += this.angularSpeed;
  this.stepForce = new Vector(0, 0);
};

/*jshint -W098 */

/**
 * Acts on the another SpaceObject from the given distance.
 * Gravity action is not simulated here, only game-specific actions.
 *
 * Distance is calculated previously.
 * @param {SpaceObject} another The SpaceObject to act on.
 * @param distance The precalculated distance between this and another
 * @abstract
 */
SpaceObject.prototype.actOn = function (another, distance) {};

SpaceObject.prototype.toString = function () {
  return " " + this.constructor.name;
};

SpaceObject.prototype.clone = function () {
  var retval = new this.constructor();
  LangUtils.deepMerge(retval, this);
  return retval;
};

SpaceObject.prototype.toPOJO = function (spaceObject) {
  spaceObject = spaceObject || this;
  var so = spaceObject.clone();
  so.type = so.constructor.name;
  delete so.simulation;
  delete so.stepForce;
  return so;
};

SpaceObject.createFromPOJO = function (pojo) {
  var ConstructorFn = window[pojo.type];
  if (!ConstructorFn) {
    console.error("Unable to create type: " + pojo.type);
    return new SpaceObject();
  }
  var retval = new ConstructorFn();
  LangUtils.deepMerge(retval, pojo);
  retval.pos = new Vector(retval.pos.x, retval.pos.y);
  retval.v = new Vector(retval.v.x, retval.v.y);
  return retval;
};

