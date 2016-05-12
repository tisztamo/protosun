"use strict";

function SimulationDistributor(simulation, connection, fps) {
  this.simulation = simulation;
  this.connection = connection;
  this.fps = fps || 30;
  this.lastSendTS = 0;
  this.externalObjects = {};
  this.ownedObjects = {};
  this.connect();
  simulation.addEventListener("onesteptaken", this.oneStepTaken.bind(this));
  simulation.addEventListener("spaceobjectadded", this.spaceObjectAdded.bind(this));
}

SimulationDistributor.prototype.connect = function () {
  this.connection.onmessage = this.messageReceived.bind(this);
};

SimulationDistributor.prototype.messageReceived = function(event) {
  var message = JSON.parse(event.data);
  var distributor = this;
  message.spaceObjects.forEach(function(pojo) {
    var spaceObject = distributor.externalObjects[pojo.id];
    if (spaceObject) {
      LangUtils.deepMerge(spaceObject, pojo);
    } else {
      if (distributor.ownedObjects[pojo.id]) {
        console.error(pojo.id + " is owned by me, not accepting external update!");
      }
      spaceObject = SpaceObject.createFromPOJO(pojo);
      distributor.externalObjects[spaceObject.id] = spaceObject;
      distributor.simulation.addSpaceObject(spaceObject);
    }
  });
};

SimulationDistributor.prototype.oneStepTaken = function () {
  if (Date.now() - this.lastSendTS < 1000 / this.fps) {
    return;
  }
  this.lastSendTS = Date.now();
  var state = this.simulation.getState();
  var distributor = this;
  this.connection.send(JSON.stringify({
    spaceObjects: state.spaceObjects.filter(function(pojo) {
      return !!distributor.ownedObjects[pojo.id];
    })
  }));
};

SimulationDistributor.prototype.spaceObjectAdded = function(event) {
  var spaceObject = event.detail.spaceObject;
  if (this.externalObjects[spaceObject.id]) {
    return;
  }
  this.ownedObjects[spaceObject.id] = spaceObject;
};