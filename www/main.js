var simulation = new GameEngine(30);

simulation.oneStep = function () {
    console.log("Overridden onStep");
};

simulation.start();