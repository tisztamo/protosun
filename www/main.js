var simulation = new Simulation();

simulation.setUpModel = function () {
  console.log("Overridden setUpModel");
};

simulation.start();