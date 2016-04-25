"use strict";

function TouchControlView() {
  View.call(this, null, "touchcontrol", document.body);
}

TouchControlView.prototype = Object.create(View.prototype);
TouchControlView.prototype.constructor = TouchControlView;
