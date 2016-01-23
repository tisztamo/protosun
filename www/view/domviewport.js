"use strict";
/**
 * Projects a portion of the model space to a DOM element (viewElement).
 * Automatically reacts to changes of the size of the DOM element if the change was initiated by a screen resize.
 * If the size change is initiated by any other event, then {@link ViewPort#notifyViewSizeChange} should be called.
 * @param viewElement the DOM element to use as view. Its size will be used in calculations.
 * @class
 * @extends ViewPort
 */
function DOMViewPort(viewElement) {
  ViewPort.call(this);
  if (viewElement) {
    this.viewElement = viewElement;
    this.notifyViewSizeChange();
    this.resizeListener = this.notifyViewSizeChange.bind(this);
    window.addEventListener("resize", this.resizeListener);
  }
}

DOMViewPort.prototype = Object.create(ViewPort.prototype);
DOMViewPort.prototype.constructor = DOMViewPort;

/**
 * Updates the cached view size from the current size of the view element
 */
DOMViewPort.prototype.notifyViewSizeChange = function () {
  this.setViewSize(this.viewElement.clientWidth, this.viewElement.clientHeight);
};

/**
* Removes the resize event listener attached to window.
*/
DOMViewPort.prototype.shutdown = function () {
  window.removeEventListener(this.resizeListener);
};