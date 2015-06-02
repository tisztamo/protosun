function GameEngine(fps) {
  this.fps = fps || 30;
}

GameEngine.prototype.start = function () {
  setInterval(this.oneStep.bind(this),
    1000 / this.fps);
};

GameEngine.prototype.oneStep = function () {
  console.log("Default oneStep, you have to override it");
};