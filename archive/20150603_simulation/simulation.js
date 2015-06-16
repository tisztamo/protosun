function Simulation(fps) {
  GameEngine.call(this, fps);
}

Simulation.prototype = new GameEngine();
Simulation.prototype.constructor = Simulation;

Simulation.prototype.start = function () {
  this.setUpModel();
  GameEngine.prototype.start.call(this);
};

Simulation.prototype.setUpModel = function () {
  this.spaceObjects = {};
};