"use strict";
var loader = new Loader();
loader.loadScripts([
      "util/polyfills.js",
      "util/langutils.js",
      "util/browserfeatures.js",
      "util/keyboard.js",
      "util/customeventtarget.js",
      "util/ie-touch.js",
      "model/vector.js",
      "model/gameengine.js",
      "model/simulation.js",
      "model/simulationdistributor.js",
      "model/spaceobject.js",
      "model/star.js",
      "model/fixedstar.js",
      "model/fuelpack.js",
      "model/planet.js",
      "model/simulationcenter.js",
      "model/earth.js",
      "model/moon.js",
      "model/enginepowered.js",
      "model/asteroid.js",
      "model/missilelauncher.js",
      "model/spacedebris.js",
      "model/spaceship.js",
      "model/missile.js",
      "model/detonation.js",
      "model/forecaster.js"
    ], function () {
  describe("SimulationDistributor", function () {
    var sim, sim2, conn, conn2, distributor, distributor2, pos, spaceObject;

    beforeEach(function (done) {
      sim = new Simulation(60);
      sim2 = new Simulation(60);
      conn = jasmine.createSpyObj("Connection", ["send", "openOrJoin", "sdpConstraints"]);
      conn2 = jasmine.createSpyObj("Connection", ["send", "openOrJoin", "sdpConstraints"]);
      distributor = new SimulationDistributor(sim, conn);
      distributor2 = new SimulationDistributor(sim2, conn2);
      pos = new Vector(-1.5, 1.9);
      spaceObject = new SpaceObject(pos, Vector.zero.clone());
      done();
    });

    it("should send out messages on oneStep()", function () {
      sim.oneStep();
      expect(conn.send).toHaveBeenCalled();
    });

    it("should be able (de)serialize a SpaceObject", function () {
      sim.addSpaceObject(spaceObject);
      sim.oneStep();
      conn2.onmessage({
        data: conn.send.calls.argsFor(0)[0]
      });
      expect(sim2.spaceObjects[0].pos).toEqual(pos);
    });

    it("should not modify stepsTaken", function () {
      sim.addSpaceObject(spaceObject);
      sim2.oneStep();
      sim2.oneStep();
      sim.oneStep();
      conn2.onmessage({
        data: conn.send.calls.argsFor(0)[0]
      });
      expect(sim2.stepsTaken).toEqual(2);
    });

    it("should be able (de)serialize complex scenes", function () {
      var descriptor = {
        "spaceObjects": [{
          "pos": {
            "x": -578.8176466899788,
            "y": 1164.4366574046458
          },
          "v": {
            "x": 0,
            "y": 0
          },
          "mass": 0.1,
          "heading": 0,
          "angularSpeed": 0,
          "radius": 20,
          "id": "SO14",
          "enginePowered": {
            "fuel": null,
            "engineRunning": false,
            "enginePower": 0.0003
          },
          "reciprocalMass": 10,
          "permeable": false,
          "isIndestructible": false,
          "type": "SpaceShip"
  }, {
          "pos": {
            "x": 2081.714285714285,
            "y": 1040.2733516483515
          },
          "v": {
            "x": -1,
            "y": -1
          },
          "mass": 20,
          "heading": 0,
          "angularSpeed": 0,
          "radius": 80,
          "id": "SO94",
          "permeable": false,
          "isIndestructible": false,
          "type": "Planet"
  }, {
          "pos": {
            "x": 497.543269230801,
            "y": -1769.4069368132118
          },
          "v": {
            "x": -0.034,
            "y": 1
          },
          "mass": 1.1,
          "heading": 0,
          "angularSpeed": 0,
          "radius": 20,
          "id": "SO891",
          "isIndestructible": true,
          "permeable": false,
          "type": "Moon"
  }, {
          "pos": {
            "x": 49.832959880704244,
            "y": 1664.5328729758112
          },
          "v": {
            "x": -0.296,
            "y": -1.302
          },
          "mass": 2,
          "heading": 0,
          "angularSpeed": 0,
          "radius": 15,
          "id": "SO251",
          "permeable": false,
          "isIndestructible": true,
          "type": "Moon"
  }]
      };
      descriptor.spaceObjects.forEach(function (pojo) {
        sim.addSpaceObject(SpaceObject.createFromPOJO(pojo));
      });
      sim.oneStep();
      conn2.onmessage({
        data: conn.send.calls.argsFor(0)[0]
      });
      expect(sim2.spaceObjects.length).toEqual(descriptor.spaceObjects.length);
      sim.spaceObjects.forEach(function(spaceObject, index) {
        expect(sim2.spaceObjects[index].pos.distanceFrom(spaceObject.pos)).toBeLessThan(0.01);
      });
    });
  });
});