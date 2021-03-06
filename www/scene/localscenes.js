"use strict";

window.LocalScenes = (function () {
  var localScenes = {};
  var scenes = [];

  var idFor = function (idx) {
    return "savedscene_" + idx;
  };

  var storedItem = function (idx) {
    return localStorage[idFor(idx)];
  };

  var initListFromLocalStorage = function () {
    scenes = [];
    var idx = 0;
    var item = storedItem(idx);
    while (item) {
      scenes.push(item);
      idx += 1;
      item = storedItem(idx);
    }

    while (idx < 6) {
      scenes.push("");
      idx += 1;
    }
  };

  localScenes.getList = function () {
    return scenes;
  };

  localScenes.get = function (index) {
    var retval = scenes[index];
    if (!retval) {
      retval = JSON.stringify(Simulation.defaultState);
    }
    return retval;
  };

  localScenes.set = function (index, sceneDescriptor) {
    scenes[index] = sceneDescriptor;
    save(index);
  };

  localScenes.add = function (sceneDescriptor) {
    scenes.push(sceneDescriptor);
    var idx = scenes.length - 1;
    save(idx);
    return idx;
  };

  var save = function (idx) {
    localStorage[idFor(idx)] = scenes[idx];
  };

  initListFromLocalStorage();
  return localScenes;
})();
