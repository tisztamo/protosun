"use strict";

function TouchControlView() {
  View.call(this, null, "touchcontrol");
}

TouchControlView.prototype = Object.create(View.prototype);
TouchControlView.prototype.constructor = TouchControlView;
