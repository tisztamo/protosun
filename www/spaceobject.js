"use strict";

function SpaceObject(pos, v) {
  this.pos = pos;
  this.v = v;
  this.id = SpaceObject.prototype.getNextId();
}

SpaceObject.prototype.nextId = 1;

SpaceObject.prototype.getNextId = function () {
  var id = "SO" + SpaceObject.prototype.nextId;
  SpaceObject.prototype.nextId += 1;
  return id;
};

SpaceObject.prototype.oneStep = function () {
  this.pos.addLocal(this.v);
};