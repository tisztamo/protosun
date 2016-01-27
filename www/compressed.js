"use strict";

// Function.name (for IE). Source: http://matt.scharley.me/2012/03/09/monkey-patch-name-ie.html
if (Function.prototype.name === undefined && Object.defineProperty !== undefined) {
  Object.defineProperty(Function.prototype, 'name', {
    get: function () {
      var funcNameRegex = /function\s([^(]{1,})\(/;
      var results = (funcNameRegex).exec((this).toString());
      return (results && results.length > 1) ? results[1].trim() : "";
    }
  });
}


/*! https://mths.be/array-from v0.2.0 by @mathias */
(function () {
  'use strict';
  var defineProperty = (function () {
    // IE 8 only supports `Object.defineProperty` on DOM elements.
    try {
      var object = {};
      var $defineProperty = Object.defineProperty;
      var result = $defineProperty(object, object, object) && $defineProperty;
    } catch (error) {}
    return result || function put(object, key, descriptor) {
      object[key] = descriptor.value;
    };
  }());
  var toStr = Object.prototype.toString;
  var isCallable = function (fn) {
    // In a perfect world, the `typeof` check would be sufficient. However,
    // in Chrome 1–12, `typeof /x/ == 'object'`, and in IE 6–8
    // `typeof alert == 'object'` and similar for other host objects.
    return typeof fn == 'function' || toStr.call(fn) == '[object Function]';
  };
  var toInteger = function (value) {
    var number = Number(value);
    if (isNaN(number)) {
      return 0;
    }
    if (number == 0 || !isFinite(number)) {
      return number;
    }
    return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
  };
  var maxSafeInteger = Math.pow(2, 53) - 1;
  var toLength = function (value) {
    var len = toInteger(value);
    return Math.min(Math.max(len, 0), maxSafeInteger);
  };
  var from = function from(arrayLike) {
    var C = this;
    if (arrayLike == null) {
      throw new TypeError('`Array.from` requires an array-like object, not `null` or `undefined`');
    }
    var items = Object(arrayLike);
    var mapping = arguments.length > 1;

    var mapFn, T;
    if (arguments.length > 1) {
      mapFn = arguments[1];
      if (!isCallable(mapFn)) {
        throw new TypeError('When provided, the second argument to `Array.from` must be a function');
      }
      if (arguments.length > 2) {
        T = arguments[2];
      }
    }

    var len = toLength(items.length);
    var A = isCallable(C) ? Object(new C(len)) : new Array(len);
    var k = 0;
    var kValue, mappedValue;
    while (k < len) {
      kValue = items[k];
      if (mapFn) {
        mappedValue = typeof T == 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
      } else {
        mappedValue = kValue;
      }
      defineProperty(A, k, {
        'value': mappedValue,
        'configurable': true,
        'enumerable': true,
        'writable': true
      });
      ++k;
    }
    A.length = len;
    return A;
  };
  defineProperty(Array, 'from', {
    'value': from,
    'configurable': true,
    'writable': true
  });
}());


if (!String.prototype.startsWith) {
  String.prototype.startsWith = function (searchString, position) {
    position = position || 0;
    return this.indexOf(searchString, position) === position;
  };
}


// From MDN: https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent
(function () {

  var CustomEvent;

  try {
    var x = new CustomEvent("x");
  } catch (e) {
    CustomEvent = function CustomEvent(event, params) {
      params = params || {
        bubbles: false,
        cancelable: false,
        detail: undefined
      };
      var evt = document.createEvent('CustomEvent');
      evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
      return evt;
    }

    CustomEvent.prototype = window.Event.prototype;

    window.CustomEvent = CustomEvent;
  }
})();/*globals BrowserFeatures: true */
"use strict";

var BrowserFeatures = {
  hasTouch: (('ontouchstart' in window) || (navigator.MaxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0))
};

(function addFeatureClasses() {
  document.body.className += BrowserFeatures.hasTouch ? "touch" : "no-touch";
}());
(function(global) {
  var nativeKeyboardEvent = ('KeyboardEvent' in global);
  if (!nativeKeyboardEvent)
    global.KeyboardEvent = function KeyboardEvent() { throw TypeError('Illegal constructor'); };

  try {
  global.KeyboardEvent.DOM_KEY_LOCATION_STANDARD = 0x00; // Default or unknown location
  global.KeyboardEvent.DOM_KEY_LOCATION_LEFT          = 0x01; // e.g. Left Alt key
  global.KeyboardEvent.DOM_KEY_LOCATION_RIGHT         = 0x02; // e.g. Right Alt key
  global.KeyboardEvent.DOM_KEY_LOCATION_NUMPAD        = 0x03; // e.g. Numpad 0 or +  
  } catch (e) {}
  
  var STANDARD = window.KeyboardEvent.DOM_KEY_LOCATION_STANDARD,
      LEFT = window.KeyboardEvent.DOM_KEY_LOCATION_LEFT,
      RIGHT = window.KeyboardEvent.DOM_KEY_LOCATION_RIGHT,
      NUMPAD = window.KeyboardEvent.DOM_KEY_LOCATION_NUMPAD;

  //--------------------------------------------------------------------
  //
  // Utilities
  //
  //--------------------------------------------------------------------

  function contains(s, ss) { return String(s).indexOf(ss) !== -1; }

  var os = (function() {
    if (contains(navigator.platform, 'Win')) { return 'win'; }
    if (contains(navigator.platform, 'Mac')) { return 'mac'; }
    if (contains(navigator.platform, 'CrOS')) { return 'cros'; }
    if (contains(navigator.platform, 'Linux')) { return 'linux'; }
    if (contains(navigator.userAgent, 'iPad') || contains(navigator.platform, 'iPod') || contains(navigator.platform, 'iPhone')) { return 'ios'; }
    return '';
  } ());

  var browser = (function() {
    if (contains(navigator.userAgent, 'Chrome/')) { return 'chrome'; }
    if (contains(navigator.vendor, 'Apple')) { return 'safari'; }
    if (contains(navigator.userAgent, 'MSIE')) { return 'ie'; }
    if (contains(navigator.userAgent, 'Gecko/')) { return 'moz'; }
    if (contains(navigator.userAgent, 'Opera/')) { return 'opera'; }
    return '';
  } ());

  var browser_os = browser + '-' + os;

  function mergeIf(baseTable, select, table) {
    if (browser_os === select || browser === select || os === select) {
      Object.keys(table).forEach(function(keyCode) {
        baseTable[keyCode] = table[keyCode];
      });
    }
  }

  function remap(o, key) {
    var r = {};
    Object.keys(o).forEach(function(k) {
      var item = o[k];
      if (key in item) {
        r[item[key]] = item;
      }
    });
    return r;
  }

  function invert(o) {
    var r = {};
    Object.keys(o).forEach(function(k) {
      r[o[k]] = k;
    });
    return r;
  }

  //--------------------------------------------------------------------
  //
  // Generic Mappings
  //
  //--------------------------------------------------------------------

  // "keyInfo" is a dictionary:
  //   code: string - name from DOM Level 3 KeyboardEvent code Values
  //     https://dvcs.w3.org/hg/dom3events/raw-file/tip/html/DOM3Events-code.html
  //   location (optional): number - one of the DOM_KEY_LOCATION values
  //   keyCap (optional): string - keyboard label in en-US locale
  // USB code Usage ID from page 0x07 unless otherwise noted (Informative)

  // Map of keyCode to keyInfo
  var keyCodeToInfoTable = {
    // 0x01 - VK_LBUTTON
    // 0x02 - VK_RBUTTON
    0x03: { code: 'Cancel' }, // [USB: 0x9b] char \x0018 ??? (Not in D3E)
    // 0x04 - VK_MBUTTON
    // 0x05 - VK_XBUTTON1
    // 0x06 - VK_XBUTTON2
    0x06: { code: 'Help' }, // [USB: 0x75] ???
    // 0x07 - undefined
    0x08: { code: 'Backspace' }, // [USB: 0x2a] Labelled Delete on Macintosh keyboards.
    0x09: { code: 'Tab' }, // [USB: 0x2b]
    // 0x0A-0x0B - reserved
    0X0C: { code: 'Clear' }, // [USB: 0x9c] NumPad Center (Not in D3E)
    0X0D: { code: 'Enter' }, // [USB: 0x28]
    // 0x0E-0x0F - undefined

    0x10: { code: 'Shift' },
    0x11: { code: 'Control' },
    0x12: { code: 'Alt' },
    0x13: { code: 'Pause' }, // [USB: 0x48]
    0x14: { code: 'CapsLock' }, // [USB: 0x39]
    0x15: { code: 'KanaMode' }, // [USB: 0x88] - "HangulMode" for Korean layout
    0x16: { code: 'HangulMode' }, // [USB: 0x90] 0x15 as well in MSDN VK table ???
    0x17: { code: 'JunjaMode' }, // (Not in D3E)
    0x18: { code: 'FinalMode' }, // (Not in D3E)
    0x19: { code: 'KanjiMode' }, // [USB: 0x91] - "HanjaMode" for Korean layout
    // 0x1A - undefined
    0x1B: { code: 'Escape' }, // [USB: 0x29]
    0x1C: { code: 'Convert' }, // [USB: 0x8a]
    0x1D: { code: 'NonConvert' }, // [USB: 0x8b]
    0x1E: { code: 'Accept' }, // (Not in D3E)
    0x1F: { code: 'ModeChange' }, // (Not in D3E)

    0x20: { code: 'Space' }, // [USB: 0x2c]
    0x21: { code: 'PageUp' }, // [USB: 0x4b]
    0x22: { code: 'PageDown' }, // [USB: 0x4e]
    0x23: { code: 'End' }, // [USB: 0x4d]
    0x24: { code: 'Home' }, // [USB: 0x4a]
    0x25: { code: 'ArrowLeft' }, // [USB: 0x50]
    0x26: { code: 'ArrowUp' }, // [USB: 0x52]
    0x27: { code: 'ArrowRight' }, // [USB: 0x4f]
    0x28: { code: 'ArrowDown' }, // [USB: 0x51]
    0x29: { code: 'Select' }, // (Not in D3E)
    0x2A: { code: 'Print' }, // (Not in D3E)
    0x2B: { code: 'Execute' }, // [USB: 0x74] (Not in D3E)
    0x2C: { code: 'PrintScreen' }, // [USB: 0x46]
    0x2D: { code: 'Insert' }, // [USB: 0x49]
    0x2E: { code: 'Delete' }, // [USB: 0x4c]
    0x2F: { code: 'Help' }, // [USB: 0x75] ???

    0x30: { code: 'Digit0', keyCap: '0' }, // [USB: 0x27] 0)
    0x31: { code: 'Digit1', keyCap: '1' }, // [USB: 0x1e] 1!
    0x32: { code: 'Digit2', keyCap: '2' }, // [USB: 0x1f] 2@
    0x33: { code: 'Digit3', keyCap: '3' }, // [USB: 0x20] 3#
    0x34: { code: 'Digit4', keyCap: '4' }, // [USB: 0x21] 4$
    0x35: { code: 'Digit5', keyCap: '5' }, // [USB: 0x22] 5%
    0x36: { code: 'Digit6', keyCap: '6' }, // [USB: 0x23] 6^
    0x37: { code: 'Digit7', keyCap: '7' }, // [USB: 0x24] 7&
    0x38: { code: 'Digit8', keyCap: '8' }, // [USB: 0x25] 8*
    0x39: { code: 'Digit9', keyCap: '9' }, // [USB: 0x26] 9(
    // 0x3A-0x40 - undefined

    0x41: { code: 'KeyA', keyCap: 'a' }, // [USB: 0x04]
    0x42: { code: 'KeyB', keyCap: 'b' }, // [USB: 0x05]
    0x43: { code: 'KeyC', keyCap: 'c' }, // [USB: 0x06]
    0x44: { code: 'KeyD', keyCap: 'd' }, // [USB: 0x07]
    0x45: { code: 'KeyE', keyCap: 'e' }, // [USB: 0x08]
    0x46: { code: 'KeyF', keyCap: 'f' }, // [USB: 0x09]
    0x47: { code: 'KeyG', keyCap: 'g' }, // [USB: 0x0a]
    0x48: { code: 'KeyH', keyCap: 'h' }, // [USB: 0x0b]
    0x49: { code: 'KeyI', keyCap: 'i' }, // [USB: 0x0c]
    0x4A: { code: 'KeyJ', keyCap: 'j' }, // [USB: 0x0d]
    0x4B: { code: 'KeyK', keyCap: 'k' }, // [USB: 0x0e]
    0x4C: { code: 'KeyL', keyCap: 'l' }, // [USB: 0x0f]
    0x4D: { code: 'KeyM', keyCap: 'm' }, // [USB: 0x10]
    0x4E: { code: 'KeyN', keyCap: 'n' }, // [USB: 0x11]
    0x4F: { code: 'KeyO', keyCap: 'o' }, // [USB: 0x12]

    0x50: { code: 'KeyP', keyCap: 'p' }, // [USB: 0x13]
    0x51: { code: 'KeyQ', keyCap: 'q' }, // [USB: 0x14]
    0x52: { code: 'KeyR', keyCap: 'r' }, // [USB: 0x15]
    0x53: { code: 'KeyS', keyCap: 's' }, // [USB: 0x16]
    0x54: { code: 'KeyT', keyCap: 't' }, // [USB: 0x17]
    0x55: { code: 'KeyU', keyCap: 'u' }, // [USB: 0x18]
    0x56: { code: 'KeyV', keyCap: 'v' }, // [USB: 0x19]
    0x57: { code: 'KeyW', keyCap: 'w' }, // [USB: 0x1a]
    0x58: { code: 'KeyX', keyCap: 'x' }, // [USB: 0x1b]
    0x59: { code: 'KeyY', keyCap: 'y' }, // [USB: 0x1c]
    0x5A: { code: 'KeyZ', keyCap: 'z' }, // [USB: 0x1d]
    0x5B: { code: 'OSLeft', location: LEFT }, // [USB: 0xe3]
    0x5C: { code: 'OSRight', location: RIGHT }, // [USB: 0xe7]
    0x5D: { code: 'ContextMenu' }, // [USB: 0x65] Context Menu
    // 0x5E - reserved
    0x5F: { code: 'Standby' }, // [USB: 0x82] Sleep

    0x60: { code: 'Numpad0', keyCap: '0', location: NUMPAD }, // [USB: 0x62]
    0x61: { code: 'Numpad1', keyCap: '1', location: NUMPAD }, // [USB: 0x59]
    0x62: { code: 'Numpad2', keyCap: '2', location: NUMPAD }, // [USB: 0x5a]
    0x63: { code: 'Numpad3', keyCap: '3', location: NUMPAD }, // [USB: 0x5b]
    0x64: { code: 'Numpad4', keyCap: '4', location: NUMPAD }, // [USB: 0x5c]
    0x65: { code: 'Numpad5', keyCap: '5', location: NUMPAD }, // [USB: 0x5d]
    0x66: { code: 'Numpad6', keyCap: '6', location: NUMPAD }, // [USB: 0x5e]
    0x67: { code: 'Numpad7', keyCap: '7', location: NUMPAD }, // [USB: 0x5f]
    0x68: { code: 'Numpad8', keyCap: '8', location: NUMPAD }, // [USB: 0x60]
    0x69: { code: 'Numpad9', keyCap: '9', location: NUMPAD }, // [USB: 0x61]
    0x6A: { code: 'NumpadMultiply', keyCap: '*', location: NUMPAD }, // [USB: 0x55]
    0x6B: { code: 'NumpadAdd', keyCap: '+', location: NUMPAD }, // [USB: 0x57]
    0x6C: { code: 'NumpadComma', keyCap: ',', location: NUMPAD }, // [USB: 0x85]
    0x6D: { code: 'NumpadSubtract', keyCap: '-', location: NUMPAD }, // [USB: 0x56]
    0x6E: { code: 'NumpadDecimal', keyCap: '.', location: NUMPAD }, // [USB: 0x63]
    0x6F: { code: 'NumpadDivide', keyCap: '/', location: NUMPAD }, // [USB: 0x54]

    0x70: { code: 'F1' }, // [USB: 0x3a]
    0x71: { code: 'F2' }, // [USB: 0x3b]
    0x72: { code: 'F3' }, // [USB: 0x3c]
    0x73: { code: 'F4' }, // [USB: 0x3d]
    0x74: { code: 'F5' }, // [USB: 0x3e]
    0x75: { code: 'F6' }, // [USB: 0x3f]
    0x76: { code: 'F7' }, // [USB: 0x40]
    0x77: { code: 'F8' }, // [USB: 0x41]
    0x78: { code: 'F9' }, // [USB: 0x42]
    0x79: { code: 'F10' }, // [USB: 0x43]
    0x7A: { code: 'F11' }, // [USB: 0x44]
    0x7B: { code: 'F12' }, // [USB: 0x45]
    0x7C: { code: 'F13' }, // [USB: 0x68]
    0x7D: { code: 'F14' }, // [USB: 0x69]
    0x7E: { code: 'F15' }, // [USB: 0x6a]
    0x7F: { code: 'F16' }, // [USB: 0x6b]

    0x80: { code: 'F17' }, // [USB: 0x6c]
    0x81: { code: 'F18' }, // [USB: 0x6d]
    0x82: { code: 'F19' }, // [USB: 0x6e]
    0x83: { code: 'F20' }, // [USB: 0x6f]
    0x84: { code: 'F21' }, // [USB: 0x70]
    0x85: { code: 'F22' }, // [USB: 0x71]
    0x86: { code: 'F23' }, // [USB: 0x72]
    0x87: { code: 'F24' }, // [USB: 0x73]
    // 0x88-0x8F - unassigned

    0x90: { code: 'NumLock', location: NUMPAD }, // [USB: 0x53]
    0x91: { code: 'ScrollLock' }, // [USB: 0x47]
    // 0x92-0x96 - OEM specific
    // 0x97-0x9F - unassigned

    // NOTE: 0xA0-0xA5 usually mapped to 0x10-0x12 in browsers
    0xA0: { code: 'ShiftLeft', location: LEFT }, // [USB: 0xe1]
    0xA1: { code: 'ShiftRight', location: RIGHT }, // [USB: 0xe5]
    0xA2: { code: 'ControlLeft', location: LEFT }, // [USB: 0xe0]
    0xA3: { code: 'ControlRight', location: RIGHT }, // [USB: 0xe4]
    0xA4: { code: 'AltLeft', location: LEFT }, // [USB: 0xe2]
    0xA5: { code: 'AltRight', location: RIGHT }, // [USB: 0xe6]

    0xA6: { code: 'BrowserBack' }, // [USB: 0x0c/0x0224]
    0xA7: { code: 'BrowserForward' }, // [USB: 0x0c/0x0225]
    0xA8: { code: 'BrowserRefresh' }, // [USB: 0x0c/0x0227]
    0xA9: { code: 'BrowserStop' }, // [USB: 0x0c/0x0226]
    0xAA: { code: 'BrowserSearch' }, // [USB: 0x0c/0x0221]
    0xAB: { code: 'BrowserFavorites' }, // [USB: 0x0c/0x0228]
    0xAC: { code: 'BrowserHome' }, // [USB: 0x0c/0x0222]
    0xAD: { code: 'VolumeMute' }, // [USB: 0x7f]
    0xAE: { code: 'VolumeDown' }, // [USB: 0x81]
    0xAF: { code: 'VolumeUp' }, // [USB: 0x80]

    0xB0: { code: 'MediaTrackNext' }, // [USB: 0x0c/0x00b5]
    0xB1: { code: 'MediaTrackPrevious' }, // [USB: 0x0c/0x00b6]
    0xB2: { code: 'MediaStop' }, // [USB: 0x0c/0x00b7]
    0xB3: { code: 'MediaPlayPause' }, // [USB: 0x0c/0x00cd]
    0xB4: { code: 'LaunchMail' }, // [USB: 0x0c/0x018a]
    0xB5: { code: 'MediaSelect' },
    0xB6: { code: 'LaunchApp1' },
    0xB7: { code: 'LaunchApp2' },
    // 0xB8-0xB9 - reserved
    0xBA: { code: 'Semicolon',  keyCap: ';' }, // [USB: 0x33] ;: (US Standard 101)
    0xBB: { code: 'Equal', keyCap: '=' }, // [USB: 0x2e] =+
    0xBC: { code: 'Comma', keyCap: ',' }, // [USB: 0x36] ,<
    0xBD: { code: 'Minus', keyCap: '-' }, // [USB: 0x2d] -_
    0xBE: { code: 'Period', keyCap: '.' }, // [USB: 0x37] .>
    0xBF: { code: 'Slash', keyCap: '/' }, // [USB: 0x38] /? (US Standard 101)

    0xC0: { code: 'Backquote', keyCap: '`' }, // [USB: 0x35] `~ (US Standard 101)
    // 0xC1-0xCF - reserved

    // 0xD0-0xD7 - reserved
    // 0xD8-0xDA - unassigned
    0xDB: { code: 'BracketLeft', keyCap: '[' }, // [USB: 0x2f] [{ (US Standard 101)
    0xDC: { code: 'Backslash',  keyCap: '\\' }, // [USB: 0x31] \| (US Standard 101)
    0xDD: { code: 'BracketRight', keyCap: ']' }, // [USB: 0x30] ]} (US Standard 101)
    0xDE: { code: 'Quote', keyCap: '\'' }, // [USB: 0x34] '" (US Standard 101)
    // 0xDF - miscellaneous/varies

    // 0xE0 - reserved
    // 0xE1 - OEM specific
    0xE2: { code: 'IntlBackslash',  keyCap: '\\' }, // [USB: 0x64] \| (UK Standard 102)
    // 0xE3-0xE4 - OEM specific
    0xE5: { code: 'Process' }, // (Not in D3E)
    // 0xE6 - OEM specific
    // 0xE7 - VK_PACKET
    // 0xE8 - unassigned
    // 0xE9-0xEF - OEM specific

    // 0xF0-0xF5 - OEM specific
    0xF6: { code: 'Attn' }, // [USB: 0x9a] (Not in D3E)
    0xF7: { code: 'CrSel' }, // [USB: 0xa3] (Not in D3E)
    0xF8: { code: 'ExSel' }, // [USB: 0xa4] (Not in D3E)
    0xF9: { code: 'EraseEof' }, // (Not in D3E)
    0xFA: { code: 'Play' }, // (Not in D3E)
    0xFB: { code: 'ZoomToggle' }, // (Not in D3E)
    // 0xFC - VK_NONAME - reserved
    // 0xFD - VK_PA1
    0xFE: { code: 'Clear' } // [USB: 0x9c] (Not in D3E)
  };

  // No legacy keyCode, but listed in D3E:

  // code: usb
  // 'IntlHash': 0x070032,
  // 'IntlRo': 0x070087,
  // 'IntlYen': 0x070089,
  // 'NumpadBackspace': 0x0700bb,
  // 'NumpadClear': 0x0700d8,
  // 'NumpadClearEntry': 0x0700d9,
  // 'NumpadMemoryAdd': 0x0700d3,
  // 'NumpadMemoryClear': 0x0700d2,
  // 'NumpadMemoryRecall': 0x0700d1,
  // 'NumpadMemoryStore': 0x0700d0,
  // 'NumpadMemorySubtract': 0x0700d4,
  // 'NumpadParenLeft': 0x0700b6,
  // 'NumpadParenRight': 0x0700b7,

  //--------------------------------------------------------------------
  //
  // Browser/OS Specific Mappings
  //
  //--------------------------------------------------------------------

  mergeIf(keyCodeToInfoTable,
          'moz', {
            0x3B: { code: 'Semicolon', keyCap: ';' }, // [USB: 0x33] ;: (US Standard 101)
            0x3D: { code: 'Equal', keyCap: '=' }, // [USB: 0x2e] =+
            0x6B: { code: 'Equal', keyCap: '=' }, // [USB: 0x2e] =+
            0x6D: { code: 'Minus', keyCap: '-' }, // [USB: 0x2d] -_
            0xBB: { code: 'NumpadAdd', keyCap: '+', location: NUMPAD }, // [USB: 0x57]
            0xBD: { code: 'NumpadSubtract', keyCap: '-', location: NUMPAD } // [USB: 0x56]
          });

  mergeIf(keyCodeToInfoTable,
          'moz-mac', {
            0x0C: { code: 'NumLock', location: NUMPAD }, // [USB: 0x53]
            0xAD: { code: 'Minus', keyCap: '-' } // [USB: 0x2d] -_
          });

  mergeIf(keyCodeToInfoTable,
          'moz-win', {
            0xAD: { code: 'Minus', keyCap: '-' } // [USB: 0x2d] -_
          });

  mergeIf(keyCodeToInfoTable,
          'chrome-mac', {
            0x5D: { code: 'OSRight', location: RIGHT } // [USB: 0xe7]
          });

  // Windows via Bootcamp (!)
  if (0) {
    mergeIf(keyCodeToInfoTable,
            'chrome-win', {
              0xC0: { code: 'Quote', keyCap: '\'' }, // [USB: 0x34] '" (US Standard 101)
              0xDE: { code: 'Backslash',  keyCap: '\\' }, // [USB: 0x31] \| (US Standard 101)
              0xDF: { code: 'Backquote', keyCap: '`' } // [USB: 0x35] `~ (US Standard 101)
            });

    mergeIf(keyCodeToInfoTable,
            'ie', {
              0xC0: { code: 'Quote', keyCap: '\'' }, // [USB: 0x34] '" (US Standard 101)
              0xDE: { code: 'Backslash',  keyCap: '\\' }, // [USB: 0x31] \| (US Standard 101)
              0xDF: { code: 'Backquote', keyCap: '`' } // [USB: 0x35] `~ (US Standard 101)
            });
  }

  mergeIf(keyCodeToInfoTable,
          'safari', {
            0x03: { code: 'Enter' }, // [USB: 0x28] old Safari
            0x19: { code: 'Tab' } // [USB: 0x2b] old Safari for Shift+Tab
          });

  mergeIf(keyCodeToInfoTable,
          'ios', {
            0x0A: { code: 'Enter', location: STANDARD } // [USB: 0x28]
          });

  mergeIf(keyCodeToInfoTable,
          'safari-mac', {
            0x5B: { code: 'OSLeft', location: LEFT }, // [USB: 0xe3]
            0x5D: { code: 'OSRight', location: RIGHT }, // [USB: 0xe7]
            0xE5: { code: 'KeyQ', keyCap: 'Q' } // [USB: 0x14] On alternate presses, Ctrl+Q sends this
          });

  //--------------------------------------------------------------------
  //
  // Identifier Mappings
  //
  //--------------------------------------------------------------------

  // Cases where newer-ish browsers send keyIdentifier which can be
  // used to disambiguate keys.

  // keyIdentifierTable[keyIdentifier] -> keyInfo

  var keyIdentifierTable = {};
  if ('cros' === os) {
    keyIdentifierTable['U+00A0'] = { code: 'ShiftLeft', location: LEFT };
    keyIdentifierTable['U+00A1'] = { code: 'ShiftRight', location: RIGHT };
    keyIdentifierTable['U+00A2'] = { code: 'ControlLeft', location: LEFT };
    keyIdentifierTable['U+00A3'] = { code: 'ControlRight', location: RIGHT };
    keyIdentifierTable['U+00A4'] = { code: 'AltLeft', location: LEFT };
    keyIdentifierTable['U+00A5'] = { code: 'AltRight', location: RIGHT };
  }
  if ('chrome-mac' === browser_os) {
    keyIdentifierTable['U+0010'] = { code: 'ContextMenu' };
  }
  if ('safari-mac' === browser_os) {
    keyIdentifierTable['U+0010'] = { code: 'ContextMenu' };
  }
  if ('ios' === os) {
    // These only generate keyup events
    keyIdentifierTable['U+0010'] = { code: 'Function' };

    keyIdentifierTable['U+001C'] = { code: 'ArrowLeft' };
    keyIdentifierTable['U+001D'] = { code: 'ArrowRight' };
    keyIdentifierTable['U+001E'] = { code: 'ArrowUp' };
    keyIdentifierTable['U+001F'] = { code: 'ArrowDown' };

    keyIdentifierTable['U+0001'] = { code: 'Home' }; // [USB: 0x4a] Fn + ArrowLeft
    keyIdentifierTable['U+0004'] = { code: 'End' }; // [USB: 0x4d] Fn + ArrowRight
    keyIdentifierTable['U+000B'] = { code: 'PageUp' }; // [USB: 0x4b] Fn + ArrowUp
    keyIdentifierTable['U+000C'] = { code: 'PageDown' }; // [USB: 0x4e] Fn + ArrowDown
  }

  //--------------------------------------------------------------------
  //
  // Location Mappings
  //
  //--------------------------------------------------------------------

  // Cases where newer-ish browsers send location/keyLocation which
  // can be used to disambiguate keys.

  // locationTable[location][keyCode] -> keyInfo
  var locationTable = [];
  locationTable[LEFT] = {
    0x10: { code: 'ShiftLeft', location: LEFT }, // [USB: 0xe1]
    0x11: { code: 'ControlLeft', location: LEFT }, // [USB: 0xe0]
    0x12: { code: 'AltLeft', location: LEFT } // [USB: 0xe2]
  };
  locationTable[RIGHT] = {
    0x10: { code: 'ShiftRight', location: RIGHT }, // [USB: 0xe5]
    0x11: { code: 'ControlRight', location: RIGHT }, // [USB: 0xe4]
    0x12: { code: 'AltRight', location: RIGHT } // [USB: 0xe6]
  };
  locationTable[NUMPAD] = {
    0x0D: { code: 'NumpadEnter', location: NUMPAD } // [USB: 0x58]
  };

  mergeIf(locationTable[NUMPAD], 'moz', {
    0x6D: { code: 'NumpadSubtract', location: NUMPAD }, // [USB: 0x56]
    0x6B: { code: 'NumpadAdd', location: NUMPAD } // [USB: 0x57]
  });
  mergeIf(locationTable[LEFT], 'moz-mac', {
    0xE0: { code: 'OSLeft', location: LEFT } // [USB: 0xe3]
  });
  mergeIf(locationTable[RIGHT], 'moz-mac', {
    0xE0: { code: 'OSRight', location: RIGHT } // [USB: 0xe7]
  });
  mergeIf(locationTable[RIGHT], 'moz-win', {
    0x5B: { code: 'OSRight', location: RIGHT } // [USB: 0xe7]
  });


  mergeIf(locationTable[RIGHT], 'mac', {
    0x5D: { code: 'OSRight', location: RIGHT } // [USB: 0xe7]
  });

  mergeIf(locationTable[NUMPAD], 'chrome-mac', {
    0x0C: { code: 'NumLock', location: NUMPAD } // [USB: 0x53]
  });

  mergeIf(locationTable[NUMPAD], 'safari-mac', {
    0x0C: { code: 'NumLock', location: NUMPAD }, // [USB: 0x53]
    0xBB: { code: 'NumpadAdd', location: NUMPAD }, // [USB: 0x57]
    0xBD: { code: 'NumpadSubtract', location: NUMPAD }, // [USB: 0x56]
    0xBE: { code: 'NumpadDecimal', location: NUMPAD }, // [USB: 0x63]
    0xBF: { code: 'NumpadDivide', location: NUMPAD } // [USB: 0x54]
  });


  //--------------------------------------------------------------------
  //
  // Key Values
  //
  //--------------------------------------------------------------------

  // Mapping from `code` values to `key` values. Values defined at:
  // https://dvcs.w3.org/hg/dom3events/raw-file/tip/html/DOM3Events-key.html
  // Entries are only provided when `key` differs from `code`. If
  // printable, `shiftKey` has the shifted printable character. This
  // assumes US Standard 101 layout

  var codeToKeyTable = {
    // Modifier Keys
    ShiftLeft: { key: 'Shift' },
    ShiftRight: { key: 'Shift' },
    ControlLeft: { key: 'Control' },
    ControlRight: { key: 'Control' },
    AltLeft: { key: 'Alt' },
    AltRight: { key: 'Alt' },
    OSLeft: { key: 'OS' },
    OSRight: { key: 'OS' },

    // Whitespace Keys
    NumpadEnter: { key: 'Enter' },
    Space: { key: ' ' },

    // Printable Keys
    Digit0: { key: '0', shiftKey: ')' },
    Digit1: { key: '1', shiftKey: '!' },
    Digit2: { key: '2', shiftKey: '@' },
    Digit3: { key: '3', shiftKey: '#' },
    Digit4: { key: '4', shiftKey: '$' },
    Digit5: { key: '5', shiftKey: '%' },
    Digit6: { key: '6', shiftKey: '^' },
    Digit7: { key: '7', shiftKey: '&' },
    Digit8: { key: '8', shiftKey: '*' },
    Digit9: { key: '9', shiftKey: '(' },
    KeyA: { key: 'a', shiftKey: 'A' },
    KeyB: { key: 'b', shiftKey: 'B' },
    KeyC: { key: 'c', shiftKey: 'C' },
    KeyD: { key: 'd', shiftKey: 'D' },
    KeyE: { key: 'e', shiftKey: 'E' },
    KeyF: { key: 'f', shiftKey: 'F' },
    KeyG: { key: 'g', shiftKey: 'G' },
    KeyH: { key: 'h', shiftKey: 'H' },
    KeyI: { key: 'i', shiftKey: 'I' },
    KeyJ: { key: 'j', shiftKey: 'J' },
    KeyK: { key: 'k', shiftKey: 'K' },
    KeyL: { key: 'l', shiftKey: 'L' },
    KeyM: { key: 'm', shiftKey: 'M' },
    KeyN: { key: 'n', shiftKey: 'N' },
    KeyO: { key: 'o', shiftKey: 'O' },
    KeyP: { key: 'p', shiftKey: 'P' },
    KeyQ: { key: 'q', shiftKey: 'Q' },
    KeyR: { key: 'r', shiftKey: 'R' },
    KeyS: { key: 's', shiftKey: 'S' },
    KeyT: { key: 't', shiftKey: 'T' },
    KeyU: { key: 'u', shiftKey: 'U' },
    KeyV: { key: 'v', shiftKey: 'V' },
    KeyW: { key: 'w', shiftKey: 'W' },
    KeyX: { key: 'x', shiftKey: 'X' },
    KeyY: { key: 'y', shiftKey: 'Y' },
    KeyZ: { key: 'z', shiftKey: 'Z' },
    Numpad0: { key: '0' },
    Numpad1: { key: '1' },
    Numpad2: { key: '2' },
    Numpad3: { key: '3' },
    Numpad4: { key: '4' },
    Numpad5: { key: '5' },
    Numpad6: { key: '6' },
    Numpad7: { key: '7' },
    Numpad8: { key: '8' },
    Numpad9: { key: '9' },
    NumpadMultiply: { key: '*' },
    NumpadAdd: { key: '+' },
    NumpadComma: { key: ',' },
    NumpadSubtract: { key: '-' },
    NumpadDecimal: { key: '.' },
    NumpadDivide: { key: '/' },
    Semicolon: { key: ';', shiftKey: ':' },
    Equal: { key: '=', shiftKey: '+' },
    Comma: { key: ',', shiftKey: '<' },
    Minus: { key: '-', shiftKey: '_' },
    Period: { key: '.', shiftKey: '>' },
    Slash: { key: '/', shiftKey: '?' },
    Backquote: { key: '`', shiftKey: '~' },
    BracketLeft: { key: '[', shiftKey: '{' },
    Backslash: { key: '\\', shiftKey: '|' },
    BracketRight: { key: ']', shiftKey: '}' },
    Quote: { key: '\'', shiftKey: '"' },
    IntlBackslash: { key: '\\', shiftKey: '|' }
  };

  mergeIf(codeToKeyTable, 'mac', {
    OSLeft: { key: 'Meta' },
    OSRight: { key: 'Meta' }
  });

  // Corrections for 'key' names in older browsers (e.g. FF36-)
  // https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent.key#Key_values
  var keyFixTable = {
    Esc: 'Escape',
    Nonconvert: 'NonConvert',
    Left: 'ArrowLeft',
    Up: 'ArrowUp',
    Right: 'ArrowRight',
    Down: 'ArrowDown',
    Del: 'Delete',
    Menu: 'ContextMenu',
    MediaNextTrack: 'MediaTrackNext',
    MediaPreviousTrack: 'MediaTrackPrevious',
    SelectMedia: 'MediaSelect',
    HalfWidth: 'Hankaku',
    FullWidth: 'Zenkaku',
    RomanCharacters: 'Romaji',
    Crsel: 'CrSel',
    Exsel: 'ExSel',
    Zoom: 'ZoomToggle'
  };

  //--------------------------------------------------------------------
  //
  // Exported Functions
  //
  //--------------------------------------------------------------------


  var codeTable = remap(keyCodeToInfoTable, 'code');

  try {
    var nativeLocation = nativeKeyboardEvent && ('location' in new KeyboardEvent(''));
  } catch (_) {}

  function keyInfoForEvent(event) {
    var keyCode = 'keyCode' in event ? event.keyCode : 'which' in event ? event.which : 0;

    var keyInfo = (function(){
      if (nativeLocation || 'keyLocation' in event) {
        var location = nativeLocation ? event.location : event.keyLocation;
        if (location && keyCode in locationTable[location]) {
          return locationTable[location][keyCode];
        }
      }
      if ('keyIdentifier' in event && event.keyIdentifier in keyIdentifierTable) {
        return keyIdentifierTable[event.keyIdentifier];
      }
      if (keyCode in keyCodeToInfoTable) {
        return keyCodeToInfoTable[keyCode];
      }
      return null;
    }());

    // TODO: Track these down and move to general tables
    if (0) {
      // TODO: Map these for newerish browsers?
      // TODO: iOS only?
      // TODO: Override with more common keyIdentifier name?
      switch (event.keyIdentifier) {
      case 'U+0010': keyInfo = { code: 'Function' }; break;
      case 'U+001C': keyInfo = { code: 'ArrowLeft' }; break;
      case 'U+001D': keyInfo = { code: 'ArrowRight' }; break;
      case 'U+001E': keyInfo = { code: 'ArrowUp' }; break;
      case 'U+001F': keyInfo = { code: 'ArrowDown' }; break;
      }
    }

    if (!keyInfo)
      return null;

    var key = (function() {
      var entry = codeToKeyTable[keyInfo.code];
      if (!entry) return keyInfo.code;
      return (event.shiftKey && 'shiftKey' in entry) ? entry.shiftKey : entry.key;
    }());

    return {
      code: keyInfo.code,
      key: key,
      location: keyInfo.location,
      keyCap: keyInfo.keyCap
    };
  }

  function queryKeyCap(code, locale) {
    code = String(code);
    if (!codeTable.hasOwnProperty(code)) return 'Undefined';
    if (locale && String(locale).toLowerCase() !== 'en-us') throw Error('Unsupported locale');
    var keyInfo = codeTable[code];
    return keyInfo.keyCap || keyInfo.code || 'Undefined';
  }

  if ('KeyboardEvent' in global && 'defineProperty' in Object) {
    (function() {
      function define(o, p, v) {
        if (p in o) return;
        Object.defineProperty(o, p, v);
      }

      define(KeyboardEvent.prototype, 'code', { get: function() {
        var keyInfo = keyInfoForEvent(this);
        return keyInfo ? keyInfo.code : '';
      }});

      // Fix for nonstandard `key` values (FF36-)
      if ('key' in KeyboardEvent.prototype) {
        var desc = Object.getOwnPropertyDescriptor(KeyboardEvent.prototype, 'key');
        Object.defineProperty(KeyboardEvent.prototype, 'key', { get: function() {
          var key = desc.get.call(this);
          return keyFixTable.hasOwnProperty(key) ? keyFixTable[key] : key;
        }});
      }

      define(KeyboardEvent.prototype, 'key', { get: function() {
        var keyInfo = keyInfoForEvent(this);
        return (keyInfo && 'key' in keyInfo) ? keyInfo.key : 'Unidentified';
      }});

      define(KeyboardEvent.prototype, 'location', { get: function() {
        var keyInfo = keyInfoForEvent(this);
        return (keyInfo && 'location' in keyInfo) ? keyInfo.location : STANDARD;
      }});

      define(KeyboardEvent.prototype, 'locale', { get: function() {
        return '';
      }});
    }());
  }

  if (!('queryKeyCap' in global.KeyboardEvent))
    global.KeyboardEvent.queryKeyCap = queryKeyCap;

  // Helper for IE8-
  global.identifyKey = function(event) {
    if ('code' in event)
      return;

    var keyInfo = keyInfoForEvent(event);
    event.code = keyInfo ? keyInfo.code : '';
    event.key = (keyInfo && 'key' in keyInfo) ? keyInfo.key : 'Unidentified';
    event.location = ('location' in event) ? event.location :
      ('keyLocation' in event) ? event.keyLocation :
      (keyInfo && 'location' in keyInfo) ? keyInfo.location : STANDARD;
    event.locale = '';
  };

} (window));
/*jshint -W098 */
"use strict";

function CustomEventTarget() {
  var customEventTarget = document.createDocumentFragment();

  this.addEventListener = function (type, listener) {
    customEventTarget.addEventListener(type, listener, true);
  };

  this.removeEventListener = function (type, listener) {
    customEventTarget.removeEventListener(type, listener, true);
  };

  this.dispatchEvent = function (event) {
    customEventTarget.dispatchEvent(event);
  };

  this.emit = function (eventName, detail) {
    this.dispatchEvent(new CustomEvent(eventName, {
      detail: detail
    }));
  };
}/*! Copyright (c) Andrea Giammarchi - MIT License */
(function(d,f,l){function v(a){this._=a;this.currentTarget=a.currentTarget}if(!(!(l=!!d.pointerEnabled)&&!d.msPointerEnabled||"ontouchend"in f)){var w=l?"setPointerCapture":"msSetPointerCapture",x=l?"releasePointerCapture":"msReleasePointerCapture";d=Element.prototype;var m=Object.defineProperties,y=Object.defineProperty,n=function(a){var b=a.toLowerCase();a="MS"+a;t[a]=t[b];return l?b:a},g=function(a){return{value:function(){C[a].call(this);this._[a]()}}},p=function(a){var b="_on"+a;return{enumerable:!0,
configurable:!0,get:function(){return this[b]||null},set:function(e){this[b]&&this.removeEventListener(a,this[b]);(this[b]=e)&&this.addEventListener(a,e)}}},q=function(a,b){var e=a[b];y(a,b,{configurable:!0,value:function(a,b,c){a in h&&e.call(this,h[a],D,c);e.call(this,a,b,c)}})},c=function(a){return{get:function(){return this._[a]}}},z=function(a){return function(b){var e=b.pointerId,c=k[e],d=b.currentTarget;delete k[e];if(x in d)d[x](b.pointerId);u(a,b,c);delete r[e]}},u=function(a,b,e){var c=
f.createEvent("Event");c.initEvent(a,!0,!0);s.value=b;A.currentTarget.value=e.currentTarget;m(c,A);e.currentTarget.dispatchEvent(c)},B=function(a,b){function c(a){return b[a]}return function(){s.value=Object.keys(b).map(c);return y(this,a,s)[a]}},s={value:null},k=Object.create(null),r=Object.create(null),C=f.createEvent("Event"),A={_:s,touches:{configurable:!0,get:B("touches",k)},changedTouches:{configurable:!0,get:B("changedTouches",r)},currentTarget:{value:null},relatedTarget:c("relatedTarget"),
target:c("target"),altKey:c("altKey"),metaKey:c("metaKey"),ctrlKey:c("ctrlKey"),shiftKey:c("shiftKey"),preventDefault:g("preventDefault"),stopPropagation:g("stopPropagation"),stopImmediatePropagation:g("stopImmediatePropagation")},h=Object.create(null),D=function(a){var b;a:{switch(a.pointerType){case "mouse":case a.MSPOINTER_TYPE_MOUSE:b="mouse";break a}b="touch"}if("touch"===b)t[a.type](a)},t={pointerdown:function(a){var b=new v(a),c=a.pointerId,d=a.currentTarget;r[c]=k[c]=b;if(w in d)d[w](a.pointerId);
u("touchstart",a,b)},pointermove:function(a){var b=a.pointerId,c=k[b];c._=a;u("touchmove",a,c);r[b]._=a},pointerup:z("touchend"),pointercancel:z("touchcancel")},g={ontouchstart:p("touchstart"),ontouchmove:p("touchmove"),ontouchend:p("touchend"),ontouchcancel:p("touchcancel")};m(v.prototype,{identifier:c("pointerId"),target:c("target"),screenX:c("screenX"),screenY:c("screenY"),clientX:c("clientX"),clientY:c("clientY"),pageX:c("pageX"),pageY:c("pageY")});h.touchstart=n("PointerDown");h.touchmove=n("PointerMove");
h.touchend=n("PointerUp");h.touchcancel=n("PointerCancel");q(f,"addEventListener");q(f,"removeEventListener");q(d,"addEventListener");q(d,"removeEventListener");m(f,g);m(d,g)}})(navigator,document);"use strict";

function Vector(x, y) {
  this.x = x;
  this.y = y;
}

/**
 * Creates a Vector with the given polar coordinates.
 */
Vector.createFromPolar = function (angle, length) {
  return new Vector(length * Math.cos(angle), length * Math.sin(angle));
};

Vector.prototype.add = function (another) {
  this.x += another.x;
  this.y += another.y;
  return this;
};

Vector.prototype.multiply = function (scalar) {
  this.x *= scalar;
  this.y *= scalar;
  return this;
};

Vector.prototype.distanceFrom = function (another) {
  var xDiff = another.x - this.x,
    yDiff = another.y - this.y;
  return Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2));
};

Vector.prototype.length = function () {
  return this.distanceFrom(Vector.zero);
};

Vector.prototype.substractToNew = function (another) {
  return new Vector(this.x - another.x, this.y - another.y);
};

Vector.prototype.toUnitVector = function () {
  return this.multiply(1 / this.length());
};

Vector.prototype.toString = function () {
  return "(" + this.x + ", " + this.y + ")";
};

Vector.prototype.clone = function () {
  return new Vector(this.x, this.y);
};

Vector.zero = new Vector(0, 0);"use strict";

/**
 * Projects a portion of the model space to a view space.
 * If the view is wider than the projected area (e.g. the default 4:3 area on a 16:9 screen),
 * then centers the projected area horizontally so that the viewed area will be larger.
 * Currently it does the same in the opposite case, the view will be smaller, so that case should be avoided.
 * @class
 */
function ViewPort() {
    this.setBaseSize(1024, 768);
    this.setModelViewPort(0, 0, 1024, 768);
}

/**
 * Sets the base size of the ViewPort, which is the size of the rectangle
 * projected to the view at zoom level 1. Defaults to 1024 x 768
 * @param baseWidth
 * @param baseHeight
 */
ViewPort.prototype.setBaseSize = function (baseWidth, baseHeight) {
  this.baseWidth = baseWidth;
  this.baseHeight = baseHeight;
  this.modelAspectRatio = this.baseWidth / this.baseHeight;
};

/**
 * Sets the view size.
 * @param viewWidth
 * @param viewHeight
 */
ViewPort.prototype.setViewSize = function (viewWidth, viewHeight) {
  this.viewWidth = viewWidth;
  this.viewHeight = viewHeight;
  this.viewToBaseRatio = this.viewHeight / this.baseHeight;
  this.horizontalViewShift = (this.viewWidth - (this.baseWidth * this.viewToBaseRatio)) / 2;
};


/**
 * Sets the projected area of the model space.
 * @param x
 * @param y
 * @param width
 * @param height
 */
ViewPort.prototype.setModelViewPort = function (x, y, width, height) {
  if (height * this.modelAspectRatio > width) {
    width = Math.round(height * this.modelAspectRatio);
  } else {
    height = Math.round(width / this.modelAspectRatio);
  }
  this.modelViewPort = {
    x: x,
    y: y,
    width: width,
    height: height,
    center: new Vector(x + width / 2, y + width / 2)
  };
  this.zoom = this.baseWidth / width;
  this.viewScale = this.zoom * this.viewToBaseRatio;
};

/**
 * Sets the projected area of the model space using the center of the
 * area and the zoom level. Size of the area is calculated using the base size and zoom. See {@link ViewPort#setBaseSize}.
 * @param {Vector} center Center of the viewport rectangle
 * @param {number} zoom Zoom is linear, 1 is the default, 3 means that
 * the width and height of the projected area is 1/3 of the base size.
 */
ViewPort.prototype.setModelViewPortWithCenterZoom = function (center, zoom) {
  var width = Math.round(this.baseWidth / zoom);
  var height = Math.round(this.baseHeight / zoom);
  this.setModelViewPort(Math.round(center.x - width / 2),
    Math.round(center.y - height / 2),
    width, height);
};

/**
* Projects a Vector from the model space to the view space.
* @param {Vector} pos The vector to project
*/
ViewPort.prototype.projectToView = function (pos) {
  return new Vector((pos.x - this.modelViewPort.x) * this.viewScale + this.horizontalViewShift, (pos.y - this.modelViewPort.y) * this.viewScale);
};

/**
* Checks if the given Vector is in the view.
* @return the projected (view) vector if it is in the view, false otherwise.
* @param {Vector} modelPos The vector to project
* @param {number} radius 
*/
ViewPort.prototype.isInView = function (modelPos, radius) {
  var viewPos = this.projectToView(modelPos);
  radius = radius || 0;
  var viewRadius = radius * this.viewScale;
  if (viewPos.x >= -viewRadius && viewPos.y >= -viewRadius && viewPos.x < this.viewWidth + viewRadius && viewPos.y < this.viewHeight + viewRadius) {
    return viewPos;
  }
  return false;
};"use strict";
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
};"use strict";

/**
 * Base class to handle game timing. Executes steps using setInterval, synchronized with performance.now() if available, Date.now() otherwise.
 * @param {number} fps Number of steps per second
 * @class
 */
function GameEngine(fps) {
  this.fps = fps || 30;
  this.stepTime = 1000 / this.fps;
  /** Number of steps already done */
  this.stepsTaken = 0;
  /** Moving average of steps per timer callback. Values significantly higher than 1 indicate performance issues (timer was fired late regurarly during the last ~100 callbacks.)*/
  this.avgStepsPerCB = 1;
  this.interval = null;
}

GameEngine.prototype.getTS = function () {
  return window.performance && window.performance.now ? window.performance.now() : Date.now();
};

/**
 * Starts the engine
 */
GameEngine.prototype.start = function () {
  this.startTS = this.getTS();
  this.interval = setInterval(this.timerCB.bind(this),
    this.stepTime);
};

GameEngine.prototype.stop = function () {
  if (this.interval !== null) {
    clearInterval(this.interval);
    this.interval = null;
  }
};

/**
 * One step of the simulation. Should be extended in subclasses.
 */
GameEngine.prototype.oneStep = function () {
  this.stepsTaken += 1;
};

/**
 * Synchronizes with the time, calls oneStep 0-3 times.
 * @private
 */
GameEngine.prototype.timerCB = function () {
  var elapsedTime = this.getTS() - this.startTS;
  var currentSteps = 0;
  while (currentSteps < 3 && this.stepsTaken * this.stepTime <= elapsedTime) {
    this.oneStep();
    currentSteps += 1;
  }
  this.avgStepsPerCB = 0.95 * this.avgStepsPerCB + 0.05 * currentSteps;
};/*jshint -W098 */
"use strict";

/**
 * Main simulation class: handles all the game modeling.
 * @class
 */
function Simulation(fps) {
  GameEngine.call(this, fps);
  CustomEventTarget.call(this);
  this.spaceObjects = [];
  this.objectsToRemove = [];
}

Simulation.prototype = Object.create(GameEngine.prototype);
Simulation.prototype.constructor = Simulation;

Simulation.prototype.start = function () {
  this.setUpModel();
  GameEngine.prototype.start.call(this);
};

/**
 * Sets up the model.
 * @abstract
 */
Simulation.prototype.setUpModel = function () {
  console.log("Default setUpModel, you have to override it!");
};

/**
 * Adds a SpaceObject to the simulation.
 */
Simulation.prototype.addSpaceObject = function (spaceObject) {
  this.spaceObjects.push(spaceObject);
  spaceObject.simulation = this;
  this.dispatchEvent(new CustomEvent("spaceobjectadded", {
    detail: {
      spaceObject: spaceObject
    }
  }));
};

/**
 * Marks the {@link SpaceObject} for removal. It will be removed at the end of the current step.
 */
Simulation.prototype.removeSpaceObject = function (spaceObject) {
  this.objectsToRemove.push(spaceObject);
};

/**
 * @private
 */
Simulation.prototype.purgeSpaceObjects = function () {
  var removeIdx = this.objectsToRemove.length - 1;
  while (removeIdx >= 0) {
    var objectToRemove = this.objectsToRemove[removeIdx];
    var i = this.spaceObjects.length - 1;
    while (i >= 0) {
      if (this.spaceObjects[i] === objectToRemove) {
        this.spaceObjects.splice(i, 1);
        this.dispatchEvent(new CustomEvent("spaceobjectremoved", {
          detail: {
            spaceObject: objectToRemove
          }
        }));
        break;
      }
      i--;
    }
    removeIdx--;
  }
  this.objectsToRemove = [];
};

Simulation.prototype.oneStep = function () {
  var length = this.spaceObjects.length;
  var spaceObjects = this.spaceObjects;
  var outerIdx = 0;
  var innerObject, outerObject;
  var distance;
  while (outerIdx < length) {
    outerObject = spaceObjects[outerIdx];
    for (var j = outerIdx + 1; j < length; j++) {
      innerObject = spaceObjects[j];
      distance = SpaceObject.actGravityForce(outerObject, innerObject);
      outerObject.actOn(innerObject, distance);
      innerObject.actOn(outerObject, distance);
    }
    outerObject.oneStep();
    outerIdx++;
  }
  this.purgeSpaceObjects();

  this.dispatchEvent(new CustomEvent("onesteptaken"));
  GameEngine.prototype.oneStep.call(this);
};"use strict";

/** Base class for simulation entities.
 * @param pos {Vector} - Position of the object
 * @param v {Vector} - Speed
 * @param {number} [mass=1]
 * @param {number} [heading=0]
 * @param {number} [angularSpeed=0] - Speed of the rotation around the center of the object.
 * @class
 */
function SpaceObject(pos, v, mass, heading, angularSpeed) {
  this.pos = pos;
  this.v = v;
  this.mass = mass || 1;
  this.reciprocalMass = 1 / this.mass;
  this.heading = heading || 0;
  this.angularSpeed = angularSpeed || 0;
  /** The collected forces acting on the object in the current simulation step. Acting forces should be added to it.
   * @type {Vector}
   */
  this.stepForce = new Vector(0, 0);
  /** Radius of the circle used to approximate the shape of the object in basic collision-like calculations. For circular objects it is the radius of the object */
  this.radius = 20;
  this.id = SpaceObject.getNextId();
  this.simulation = null;
}

/** Gravitational constant {@link https://en.wikipedia.org/wiki/Gravitational_constant} */
SpaceObject.G = 50;

/** Permeable objects are not involved in collision-like events */
SpaceObject.prototype.permeable = false;

/** Indestructible objects cannot be destructed, they remain in the simulation after destruction with e.g. a missile*/
SpaceObject.prototype.isIndestructible = false;

/** simulates the gravity force between the two {@link SpaceObject}s. Does nothing when the distance is too small thus the high gravity force would lead to unacceptable calculation errors.
 * @return {number} The distance of the given SpaceObjects
 */
SpaceObject.actGravityForce = function (spaceObject1, spaceObject2) {
  var distance = spaceObject1.pos.distanceFrom(spaceObject2.pos);
  if (distance < 15) { //Minimal distance needed
    return;
  }
  var forceMagnitude = spaceObject1.mass * spaceObject2.mass * SpaceObject.G / Math.pow(distance, 2);
  var forceDirection = spaceObject1.pos.substractToNew(spaceObject2.pos).toUnitVector();
  var force = forceDirection.multiply(forceMagnitude);
  spaceObject2.stepForce.add(force);
  spaceObject1.stepForce.add(force.multiply(-1));
  return distance;
};

/* @private */
SpaceObject.nextId = 1;

/* @private */
SpaceObject.getNextId = function () {
  var id = "SO" + SpaceObject.nextId;
  SpaceObject.nextId += 1;
  return id;
};

/**
 * Simulates one step of this SpaceObject.
 * Calculates the acceleration of the object from {@link SpaceObject#stepForce} and {@link SpaceObject#mass}. Also simulates the heading and position change.
 * Should be extended in subclasses.
 */
SpaceObject.prototype.oneStep = function () {
  this.v.add(this.stepForce.multiply(this.reciprocalMass));
  this.pos.add(this.v);
  this.heading += this.angularSpeed;
  this.stepForce = new Vector(0, 0);
};

/*jshint -W098 */

/**
 * Acts on the another SpaceObject from the given distance.
 * Gravity action is not simulated here, only game-specific actions.
 *
 * Distance is calculated previously.
 * @param {SpaceObject} another The SpaceObject to act on.
 * @param distance The precalculated distance between this and another
 * @abstract
 */
SpaceObject.prototype.actOn = function (another, distance) {};


SpaceObject.prototype.toString = function() {
  return " " + this.constructor.name;
};"use strict";

function Star(pos, v, mass) {
  SpaceObject.call(this, pos, v, mass);
  this.radius = 135;
}

Star.prototype = Object.create(SpaceObject.prototype);
Star.prototype.constructor = Star;

Star.prototype.isIndestructible = true;"use strict";

function FixedStar(pos, v, mass) {
  Star.call(this, pos, v, mass);
}

FixedStar.prototype = Object.create(Star.prototype);
FixedStar.prototype.constructor = FixedStar;

FixedStar.prototype.oneStep = function () {
  this.stepForce = Vector.zero.clone();
  SpaceObject.prototype.oneStep.call(this);
};"use strict";

function Planet(pos, v, mass) {
  SpaceObject.call(this, pos, v, mass);
  this.radius = 25;
}

Planet.prototype = Object.create(SpaceObject.prototype);
Planet.prototype.constructor = Planet;/*jshint -W098 */
"use strict";

/**
 * Marks the SpaceObject as the center of the simulation, for optimization purposes.
 * Silently removes SpaceObjects from the simulation when they are
 * too far from this object.
 * Only one object with this capability should be added to a simulation.
 * @TODO the SpaceShip is also removed silently, which should be handled with game over or so.
 * jsdoc limitation: cannot document mixin initialization params, check the source for more info!
 * @param {number} maxDistance The radius of the simulation, object farer from the simulation center will be removed silently.
 * @mixin
 */
function SimulationCenter(maxDistance) {
  maxDistance = maxDistance || Infinity;

  var superActOn = this.actOn || function () {};
  this.actOn = function (another, distance) {
    if (distance > this.maxDistance) {
      this.simulation.removeSpaceObject(another);
    }
    superActOn.call(this, another, distance);
  };
}"use strict";

function Earth(pos, v, mass, radius) {
  SpaceObject.call(this, pos, v, mass);
  this.radius = radius;
  SimulationCenter.call(this);
}

Earth.prototype = Object.create(SpaceObject.prototype);
Earth.prototype.constructor = Earth;

Earth.prototype.isIndestructible = true;

Earth.prototype.oneStep = function () {
  this.stepForce = Vector.zero.clone();
  SpaceObject.prototype.oneStep.call(this);
};

Earth.prototype.actOn = function (another, distance) {
  if (!another.permeable && distance < this.radius + another.radius - 10) {
    var detonation = new Detonation(another.pos.clone(), Vector.zero.clone());
    this.simulation.addSpaceObject(detonation);
    this.simulation.removeSpaceObject(another);
  }
};
"use strict";

function Moon(pos, v, mass) {
  SpaceObject.call(this, pos, v, mass);
  this.radius = 15;
}

Moon.prototype = Object.create(SpaceObject.prototype);
Moon.prototype.constructor = Moon;/*jshint -W098 */
"use strict";

/**
 * Propulsion engine capability, can be mixed into {@link SpaceObject}s.
 * jsdoc limitation: cannot document mixin initialization params, check the source for more info!
 * @param {number} enginePower - the force that is generated by the engine. Direction of the force is based on the heading of the object.
 * @param {number} fuel - Fuel is used while the engine is running, 1 unit per simulation step. This is the initial value.
 * @param {boolean} engineRunning - Initial state of the engine.
 * @mixin
 */
function EnginePowered(enginePower, fuel, engineRunning) {
  this.enginePowered = {
    fuel: fuel || Infinity,
    engineRunning: engineRunning || false
  };
  enginePower = enginePower || 0.001;
  var props = this.enginePowered;

  var superOneStep = this.oneStep;
  this.oneStep = function () {
    if (this.enginePowered.engineRunning) {
      this.stepForce.add(Vector.createFromPolar(this.heading, enginePower));
      if (--props.fuel <= 0) {
        props.engineRunning = false;
      }
    }
    superOneStep.call(this);
  };

  this.startEngine = function () {
    if (props.fuel > 0) {
      props.engineRunning = true;
    }
  };

  this.stopEngine = function () {
    props.engineRunning = false;
  };
}"use strict";

function Asteroid(pos, v, mass) {
  SpaceObject.call(this, pos, v, mass, 0, Math.random() / 10 - 0.05);
  this.radius = 15;
}

Asteroid.prototype = Object.create(SpaceObject.prototype);
Asteroid.prototype.constructor = Asteroid;
/*jshint -W098 */
"use strict";


/**
 * Misile launching capability. Can be mixed into {@link SpaceObject}s.
 * @mixin
 */
function MissileLauncher(throttleInMs) {
  throttleInMs = throttleInMs || 500;
  var lastLaunchTS = 0;
  
  /**
   * Launches a missile to the current heading of this {@link SpaceObject}
   * Returns true if the missile is launched, false if throttling prevented the launch.
   */
  this.launchMissile = function () {
    if (this.getTimeToNextMissile() !== 0) {
      return false;
    }
    var direction = Vector.createFromPolar(this.heading, 1);
    var v = this.v.clone();
    var missile = new Missile(this.pos.clone(), v, this.heading);
    missile.pos.add(direction.clone().multiply(this.radius + missile.radius + 5));
    this.simulation.addSpaceObject(missile);
    lastLaunchTS = Date.now();
    return true;
  };
  
  this.getTimeToNextMissile = function () {
    return Math.min(0, Date.now() - lastLaunchTS - throttleInMs);
  };
}

"use strict";

function SpaceDebris(pos, v, mass, heading) {
  SpaceObject.call(this, pos, v, mass, heading);
  this.angularSpeed = Math.random() * 0.1 - 0.05;
}

SpaceDebris.prototype = Object.create(SpaceObject.prototype);
SpaceDebris.prototype.constructor = SpaceDebris;
"use strict";

function SpaceShip(simulation, pos, v, mass, heading, enginePower, fuel) {
  SpaceObject.call(this, pos, v, mass, heading);
  EnginePowered.call(this, enginePower, fuel);
  MissileLauncher.call(this);
  this.radius = 20;
  this.rotationEnginePower = 0.03 / simulation.fps * 100;
}

SpaceShip.prototype = Object.create(SpaceObject.prototype);
SpaceShip.prototype.constructor = SpaceShip;

SpaceShip.prototype.startRotationLeft = function () {
  this.angularSpeed = -this.rotationEnginePower;
};

SpaceShip.prototype.startRotationRight = function () {
  this.angularSpeed = this.rotationEnginePower;
};

SpaceShip.prototype.stopRotation = function () {
  this.angularSpeed = 0;
};"use strict";

function Missile(pos, v, heading, lifeSteps, fuel) {
  SpaceObject.call(this, pos, v, 0.001, heading);
  EnginePowered.call(this, 0.0001, fuel || 60, true);
  this.radius = 10;
  this.lifeSteps = lifeSteps || 480;
  this.detonated = false;
}

Missile.prototype = Object.create(SpaceObject.prototype);
Missile.prototype.constructor = Missile;

Missile.prototype.oneStep = function () {
  SpaceObject.prototype.oneStep.call(this);
  --this.lifeSteps;
  if (this.lifeSteps <= 0 && !this.detonated) {
    this.simulation.removeSpaceObject(this);
    this.detonate();
  }
};

Missile.prototype.actOn = function (another, distance) {
  if (distance < another.radius + this.radius && !this.detonated && !another.permeable) {
    this.detonate(another);
  }
};

Missile.prototype.detonate = function (spaceObjectHit) {
  if (this.detonated) {
    return;
  }
  spaceObjectHit = spaceObjectHit || this;
  this.detonated = true;
  var pos = spaceObjectHit.pos;
  if (spaceObjectHit.isIndestructible) {
    pos = this.pos;
  }
  var detonation = new Detonation(pos.clone(), Vector.zero.clone());
  this.simulation.addSpaceObject(detonation);
  this.simulation.removeSpaceObject(this);
  if (!spaceObjectHit.isIndestructible) {
    this.simulation.removeSpaceObject(spaceObjectHit);
  }
};
"use strict";

function Detonation(pos, v) {
  SpaceObject.call(this, pos, v, -0.15);
  this.permeable = true;
  this.lifeSteps = 100;
}

Detonation.prototype = Object.create(SpaceObject.prototype);
Detonation.prototype.constructor = Detonation;

Detonation.prototype.oneStep = function () {
  this.stepForce = Vector.zero.clone();
  SpaceObject.prototype.oneStep.call(this);
  if (--this.lifeSteps <= 0) {
    this.simulation.removeSpaceObject(this);
  }
};
"use strict";

/** Base class to define a scene, e.g. a level of the game.
 * @param {Simulation} simulation
 * @param {Renderer} renderer
 * @class
 * @abstract
 */
function Scene(simulation, renderer) {
  this.simulation = simulation;
  this.renderer = renderer;
  if (this.simulation) {
    this.simulation.setUpModel = this.setUpModel.bind(this);
  }
}

/**
 * Sets up the scene.
 * @abstract
 */
Scene.prototype.setUpModel = function () {};


Scene.scenes = {};

Scene.registerScene = function (sceneClass) {
  Scene.scenes[sceneClass.name] = sceneClass;
};

Scene.createScene = function (sceneName, simulation, renderer) {
  return new (Scene.scenes[sceneName])(simulation, renderer);
};"use strict";

/** Base class to define the objective of a scene.
* @param {Simulation} simulation
* @class
* @abstract
*/
function Objective(simulation, winAtStep, failAtStep) {
  this.simulation = simulation;
  SimulationObserver.call(this, simulation);
  CustomEventTarget.call(this);
  this.winAtStep = winAtStep || -1;
  this.failAtStep = failAtStep || -1;
  this.stepCount = 0;
  this.ended = false;
}

Objective.prototype.oneStepTaken = function () {
  this.stepCount += 1;
  if (this.stepCount == this.winAtStep) {
    this.emitWin();
  }
  if (this.stepCount == this.failAtStep) {
    this.emitFail();
  }
};

Objective.prototype.emitWin = function () {
  if (this.ended) {
    return;
  }
  this.ended = true;
  this.dispatchEvent(new CustomEvent("win"));
};

Objective.prototype.emitFail = function (eventData) {
  if (this.ended) {
    return;
  }
  this.ended = true;
  this.dispatchEvent(new CustomEvent("fail", {
    detail: eventData
  }));
};"use strict";

function ProtectObjective(simulation, protectedObjects, winAtStep) {
  Objective.call(this, simulation, winAtStep);
  this.protectedObjects = protectedObjects;
}

ProtectObjective.prototype = Object.create(Objective.prototype);

ProtectObjective.prototype.spaceObjectRemoved = function (spaceObject) {
  if (this.protectedObjects.indexOf(spaceObject) !== -1) {
    this.emitFail({
      lostObject: spaceObject
    });
  }
};"use strict";

function PuzzleScene(simulation, renderer) {
  Scene.call(this, simulation, renderer);
}

PuzzleScene.prototype = Object.create(Scene.prototype);
PuzzleScene.prototype.constructor = PuzzleScene;
Scene.registerScene(PuzzleScene);


PuzzleScene.prototype.setUpModel = function () {
  var simulation = this.simulation;
  var ship = new SpaceShip(simulation, new Vector(500, 350), new Vector(3, 0), 0.1, 0, 0.0015);
  var planet = new Planet(new Vector(400, 350), new Vector(-0.3, 0.3), 15);
  var moon = new Moon(new Vector(400, 650), new Vector(-1.3, 0.3), 1);
  var star = new FixedStar(new Vector(1400, 1050), new Vector(0, 0), 10);
  star.isIndestructible = false;
  var asteroids = [new Asteroid(new Vector(200, 0), new Vector(2, 0.1), 0.1),
  new Asteroid(new Vector(1600, 1350), new Vector(0.3, -1.51), 1),
  new Asteroid(new Vector(2900, 1750), new Vector(-0.7, -0.28), 1)];

  simulation.addSpaceObject(ship);
  simulation.addSpaceObject(planet);
  simulation.addSpaceObject(moon);
  asteroids.forEach(simulation.addSpaceObject.bind(simulation));
  simulation.addSpaceObject(star);

  var objectToProtect = [ship, planet, moon, star];
  objectToProtect.forEach(function (spaceObject) {
    spaceObject.actOn = function (another, distance) {
      if (distance < another.radius + spaceObject.radius - 8 && !another.permeable) {
        simulation.removeSpaceObject(spaceObject);
      }
    };
  });

  this.objective = new ProtectObjective(simulation, objectToProtect, 1800);
  var camera = new OutlineCamera(new SimpleCamera(this.simulation, this.renderer.viewPort, ship), 0, 0, 3000, 1800);
  this.renderer.setCamera(camera);

  new KeyboardController(ship, camera);
  var touchController = TouchController.createControllerFor(ship, camera);
  if (touchController) {
    this.renderer.viewElement.appendChild(touchController.view.rootElement);
  }
};"use strict";

function SpaceDebrisScene(simulation, renderer) {
  Scene.call(this, simulation, renderer);
}

SpaceDebrisScene.prototype = Object.create(Scene.prototype);
SpaceDebrisScene.prototype.constructor = SpaceDebrisScene;
Scene.registerScene(SpaceDebrisScene);

SpaceDebrisScene.prototype.setUpModel = function () {
  var simulation = this.simulation;
  var scene = this;
  var ship = new SpaceShip(simulation, new Vector(400, -550), new Vector(2.3, 0), 0.1, 0);
  var earth = new Earth(new Vector(400, 350), new Vector(0, 0), 105, 755);
  earth.maxDistance = 4000;

  simulation.addSpaceObject(ship);
  simulation.addSpaceObject(earth);
  setInterval(function () {
    if (simulation.spaceObjects.length < 25) {
      var debris = scene.generateDebris(earth, 800, 1200, scene.renderer.viewPort);
      if (debris) {
        simulation.addSpaceObject(debris);
      }
    }
  }, 1500);
  
  this.objective = new ProtectObjective(simulation, [ship]);

  var camera = new OutlineCamera(new SimpleCamera(this.simulation, this.renderer.viewPort, ship));
  this.renderer.setCamera(camera);

  new KeyboardController(ship, camera);
  var touchController = TouchController.createControllerFor(ship, camera);
  if (touchController) {
    this.renderer.viewElement.appendChild(touchController.view.rootElement);
  }
};

SpaceDebrisScene.prototype.generateDebris = function (centerObject, minDistance, maxDistance, viewPort) {
  var angle = Math.random() * Math.PI * 2;
  var distance = Math.random() * (maxDistance - minDistance) + minDistance;
  var relPos = Vector.createFromPolar(angle, distance);
  var pos = centerObject.pos.clone().add(relPos);
  if (!viewPort.isInView(pos, 20)) {
    var speed = Math.sqrt((5400 + 600 * Math.random()) / distance);
    return new SpaceDebris(pos, Vector.createFromPolar(angle - Math.PI / 2, speed));
  }
};/*global Media*/
"use strict";

function Sound() {}


Sound.prototype.playMusic = function (url) {
  if (!window.Media) {
    console.log("playMusic: Media plugin not found");
    return;
  }
  this.stopMusic();
  var mediaUrl = this.createLocalMediaUrl(url);
  this.runningMusic = new Media(mediaUrl,
    function () {
      console.log("playMusic(): Audio Success");
    },
    function (err) {
      console.log("playMusic():Audio Error: " + JSON.stringify(err));
    }
  );
  this.runningMusic.play();
};

Sound.prototype.stopMusic = function () {
  if (this.runningMusic) {
    this.runningMusic.stop();
    this.runningMusic.release();
  }
};

Sound.prototype.createLocalMediaUrl = function (relativeUrl) {
  if (window.device && window.device.platform == "Android") {
    var path = window.location.pathname;
    path = path.substr(path, path.lastIndexOf("/"));
    if (!path.startsWith("http") && !path.startsWith("file")) {
      path = "file://" + path;
    }
    return path + "/" + relativeUrl;
  } else {
    return relativeUrl;
  }
};"use strict";

/**
* Base camera class. Cameras change the viewport to reflect
* model changes, e.g. to follow the player.
* 
* @class
* @abstract
*/
function Camera(simulation, viewPort) {
  this.simulation = simulation;
  this.viewPort = viewPort;
}

/**
* Updates the {@link ViewPort} based on the current state of the simulation
* @abstract
*/
Camera.prototype.updateView = function () {
};"use strict";

/**
 * This camera follows an object. The object is not exactly in the center, the
 * camera uses the speed of the object to position it in the viewport.
 * @class
 */
function SimpleCamera(simulation, viewPort, centerObject) {
  Camera.call(this, simulation, viewPort);
  this.centerObject = centerObject;
}

SimpleCamera.prototype = Object.create(Camera.prototype);
SimpleCamera.prototype.constructor = SimpleCamera;

SimpleCamera.prototype.updateView = function () {
  this.viewPort.setModelViewPortWithCenterZoom(this.centerObject.pos.clone().add(this.centerObject.v.clone().multiply(50)), 1);
};"use strict";

function OutlineCamera(originalCamera, x, y, width, height) {
  Camera.call(this, originalCamera.simulation, originalCamera.viewPort);
  this.originalCamera = originalCamera;
  this.isOutLined = false;
  this.x = x || 0;
  this.width = width || 2048;
  this.y = x || 0;
  this.height = height || 1536;
  this.animationLength = 500;
}

OutlineCamera.prototype = Object.create(Camera.prototype);
OutlineCamera.prototype.constructor = OutlineCamera;

OutlineCamera.prototype.updateView = function () {
  if (this.animationRunning && this.animate()) {
    return;
  }
  if (this.isOutlined) {
    this.viewPort.setModelViewPort(this.x, this.y, this.width, this.height);
  } else {
    this.originalCamera.updateView();
  }
};

OutlineCamera.prototype.animate = function () {
  var phase = (Date.now() - this.animationStartedAt) / this.animationLength;
  if (phase >= 1) {
    this.animationRunning = false;
    return false;
  }
  if (!this.isOutlined) {
    phase = 1 - phase;
  }
  this.originalCamera.updateView();
  
  function animPos(a, b, phase) {
    return a + phase * (b - a);
  }
  var x = animPos(this.viewPort.modelViewPort.x, this.x, phase);
  var y = animPos(this.viewPort.modelViewPort.y, this.y, phase);
  var width = animPos(this.viewPort.modelViewPort.width, this.width, phase);
  var height = animPos(this.viewPort.modelViewPort.height, this.height, phase);
  this.viewPort.setModelViewPort(x, y, width, height);
  return true;
};

OutlineCamera.prototype.setOutlined = function (outlineFlag) {
  this.isOutlined = outlineFlag;
  this.animationRunning = true;
  this.animationStartedAt = Date.now();
};

OutlineCamera.prototype.switchOutlined = function () {
  this.setOutlined(!this.isOutlined);
};/*jshint -W098 */
"use strict";

function SimulationObserver(simulation) {
  this.simulation = simulation;
  if (simulation) {
    var observer = this;
    if (observer.spaceObjectAdded) {
      simulation.addEventListener("spaceobjectadded", function (event) {
        observer.spaceObjectAdded(event.detail.spaceObject);
      });
    }
    if (observer.spaceObjectRemoved) {
      simulation.addEventListener("spaceobjectremoved", function (event) {
        observer.spaceObjectRemoved(event.detail.spaceObject);
      });
    }
    if (observer.oneStepTaken) {
      simulation.addEventListener("onesteptaken", function (event) {
        observer.oneStepTaken();
      });
    }
  }
}"use strict";

function View(model, templateId) {
  this.model = model;
  this.rootElement = this.createRootElement(model, templateId);
  this.viewElements = this.loadElementsToObject("[data-view]", "data-view");
  this.updateAll();
}

View.prototype.idPrefix = "view_";
View.prototype.templateId = "view";
View.prototype.projection = {};

View.prototype.createRootElement = function (model, templateId) {
  templateId = templateId || this.templateId;
  var template = document.getElementById(templateId);
  if (!template) {
    return null;
  }
  var rootElement = template.cloneNode(true);
  var id = model && model.id ? model.id : "autogen" + Math.round(Math.random() * 100000);
  rootElement.id = id;
  rootElement.model = model;
  rootElement.classList.remove("template");
  return rootElement;
};

View.prototype.loadElementsToObject = function (selector, namingAttribute) {
  if (!this.rootElement) {
    return;
  }
  var retval = {};
  Array.from(this.rootElement.querySelectorAll(selector))
    .forEach(function (element) {
      retval[element.getAttribute(namingAttribute)] = element;
    });
  return retval;
};

View.prototype.calculateFieldValue = function (fieldName) {
  var fieldProjector = this.projection[fieldName];
  if (typeof fieldProjector === "undefined") {
    return this.model[fieldName];
  } else if (typeof fieldProjector == "function") {
    return fieldProjector.call(this, fieldName);
  }
  return fieldProjector;
};

View.prototype.updateField = function (fieldName) {
  var viewElement = this.viewElements[fieldName];
  var fieldValue = this.calculateFieldValue(fieldName);
  if (typeof fieldValue === "object") {
    for (var attributeName in fieldValue) {
      viewElement[attributeName] = fieldValue[attributeName];
    }
  } else {
    viewElement.textContent = fieldValue;
  }
};

View.prototype.updateAll = function () {
  for (var fieldName in this.viewElements) {
    this.updateField(fieldName);
  }
};"use strict";

function Renderer(simulation, viewElement) {
  SimulationObserver.call(this, simulation);
  this.simulation = simulation;
  this.viewElement = viewElement;
  this.redrawNeeded = true;
  this.viewPort = new DOMViewPort(viewElement);
  this.camera = null;
  this.stopped = false;
}

Renderer.prototype.start = function () {
  window.requestAnimationFrame(this.tick.bind(this));
  this.stopped = false;
};

Renderer.prototype.stop = function () {
  this.stopped = true;
};


Renderer.prototype.tick = function () {
  if (this.stopped) {
    return;
  }
  if (this.redrawNeeded) {
    this.redraw();
    this.redrawNeeded = false;
  }
  window.requestAnimationFrame(this.tick.bind(this));
};

Renderer.prototype.redraw = function () {
  console.log("Override redraw!");
};

Renderer.prototype.oneStepTaken = function () {
  this.redrawNeeded = true;
};

Renderer.prototype.setCamera = function (camera) {
  this.camera = camera;
};

Renderer.prototype.spaceObjectAdded = function () {
  this.redrawNeeded = true;
};

Renderer.prototype.spaceObjectRemoved = function () {
  this.redrawNeeded = true;
};"use strict";

function DOMRenderer(simulation, viewElement) {
  Renderer.call(this, simulation, viewElement);
  this.views = [];
  this.backgroundSpeedRatio = 2;
  this.defaultBgSize = 1024;
  this.displayedViewCount = 0;
}

DOMRenderer.prototype = Object.create(Renderer.prototype);

DOMRenderer.prototype.stop = function () {
  this.viewElement.innerHTML = "";
  Renderer.prototype.stop.call(this);
};

DOMRenderer.prototype.redraw = function () {
  this.camera.updateView();
  var length = this.views.length;
  this.displayedViewCount = 0;
  for (var i = 0; i < length; i++) {
    this.updateView(this.views[i]);
  }
  this.updateBackground();
};

DOMRenderer.prototype.spaceObjectAdded = function (spaceObject) {
  Renderer.prototype.spaceObjectAdded.call(this, spaceObject);

  var view = this.createView(spaceObject.constructor.name.toLowerCase(), spaceObject);
  if (spaceObject instanceof SpaceShip) {
    this.ship = view;
  }
};

DOMRenderer.prototype.spaceObjectRemoved = function (spaceObject) {
  Renderer.prototype.spaceObjectRemoved.call(this, spaceObject);
  var i = this.views.length - 1;
  while (i >= 0) {
    if (this.views[i].model === spaceObject) {
      this.views[i].parentElement.removeChild(this.views[i]);
      this.views.splice(i, 1);
      return;
    }
    i--;
  }
};

DOMRenderer.prototype.createView = function (templateid, spaceObject) {
  var template = document.getElementById(templateid);
  var view = template.cloneNode(true);
  view.id = spaceObject.id;
  view.model = spaceObject;
  view.physicalElement = view.getElementsByClassName("physicalview").item(0);
  view.classList.remove("template");
  this.viewElement.appendChild(view);
  this.views.push(view);
  return view;
};

DOMRenderer.prototype.updateView = function (view) {
  var spaceObject = view.model;
  var style = view.style;
  var projectedPos = this.viewPort.isInView(spaceObject.pos, spaceObject.radius);
  if (projectedPos) {
    style.left = projectedPos.x + "px";
    style.top = projectedPos.y + "px";
    if (view.physicalElement) {
      var transform = "rotate(" + spaceObject.heading + "rad)" + "scale(" + this.viewPort.viewScale + ")";
      var rotatedStyle = view.physicalElement.style;
      rotatedStyle.webkitTransform = transform;
      rotatedStyle.msTransform = transform;
      rotatedStyle.transform = transform;
    }
    style.display = "block";
    if (spaceObject instanceof Detonation) {
      this.updateDetonationView(view);
    } else if (spaceObject.enginePowered) {
      this.updateEnginePoweredView(view);
    }
    this.displayedViewCount++;
  } else {
    style.display = "none";
  }
};

DOMRenderer.prototype.updateBackground = function () {
  var center = this.viewPort.modelViewPort.center;
  var bgSizeRatio = 1 + (this.viewPort.viewScale - 1) / this.backgroundSpeedRatio;
  this.viewElement.style.backgroundImage = "url(img/background.jpg)";
  this.viewElement.style.backgroundPosition = Math.round(-center.x / this.backgroundSpeedRatio * bgSizeRatio) + "px " + Math.round(-center.y / this.backgroundSpeedRatio * bgSizeRatio) + "px";
  this.viewElement.style.backgroundSize = Math.round(bgSizeRatio * this.defaultBgSize) + "px";
};

DOMRenderer.prototype.updateEnginePoweredView = function (view) {
  if (view.model.enginePowered.engineRunning) {
    view.classList.add("enginerunning");
  } else {
    view.classList.remove("enginerunning");
  }
};

/*jshint -W098 */
DOMRenderer.prototype.updateDetonationView = function (view) {
  if (!view.classList.contains("detonated")) {
    // Reading clientHeight forces style recalculation which is needed
    // to start the transition
    var forceStyleRecalc = view.clientHeight != 0.001;
    view.classList.add("detonated");
  }
};"use strict";

function CanvasRenderer(simulation, area) {
  Renderer.call(this, simulation, area);
  this.views = [];
  this.backgroundSpeedRatio = 2;
  this.defaultBgSize = 1024;
  this.displayedViewCount = 0;
  this.canvas = document.createElement("canvas");
  this.area = area;
  this.area.appendChild(this.canvas);
  this.canvas.width = area.width || 1000;
  this.canvas.height = area.height || 800;
  this.ctx = this.canvas.getContext('2d');
}

CanvasRenderer.prototype = Object.create(Renderer.prototype);
CanvasRenderer.prototype.constructor = CanvasRenderer;
CanvasRenderer.viewClasses = [];

CanvasRenderer.prototype.stop = function () {
  this.area.removeChild(this.canvas);
  Renderer.prototype.stop.call(this);
};

CanvasRenderer.registerViewClass = function (modelName, canvasViewClass) {
  CanvasRenderer.viewClasses[modelName] = canvasViewClass;
};

CanvasRenderer.prototype.redraw = function () {
  this.updateCanvasSize();
  this.camera.updateView();
  this.updateBackground();
  var length = this.views.length;
  this.displayedViewCount = 0;
  for (var i = 0; i < length; i++) {
    this.updateView(this.views[i]);
  }
};

CanvasRenderer.prototype.updateCanvasSize = function () {
  if (this.canvas.width != this.viewElement.clientWidth || this.canvas.height != this.viewElement.clientHeight) {
    this.canvas.width = this.viewElement.clientWidth;
    this.canvas.height = this.viewElement.clientHeight;
  }
};

CanvasRenderer.prototype.spaceObjectAdded = function (spaceObject) {
  Renderer.prototype.spaceObjectAdded.call(this, spaceObject);

  var view = this.createView(spaceObject);
  if (spaceObject instanceof SpaceShip) {
    this.ship = view;
  }
};

CanvasRenderer.prototype.spaceObjectRemoved = function (spaceObject) {
  Renderer.prototype.spaceObjectRemoved.call(this, spaceObject);
  var i = this.views.length - 1;
  while (i >= 0) {
    if (this.views[i].model === spaceObject) {
      this.views.splice(i, 1);
      return;
    }
    i--;
  }
};

CanvasRenderer.prototype.createView = function (spaceObject) {
  var viewClassName = spaceObject.constructor.name.toLowerCase();
  var ViewClass = CanvasRenderer.viewClasses[viewClassName];
  if (!ViewClass) {
    throw "No View class for " + viewClassName;
  }
  var view = new ViewClass(spaceObject, this.viewPort);
  this.views.push(view);
  return view;
};

CanvasRenderer.prototype.updateView = function (view) {
  try {
    view.drawTo(this.ctx);
  } catch (e) {
    console.warn(e);
  }
  this.displayedViewCount++;
};

CanvasRenderer.prototype.updateBackground = function () {
  if (!this.backgroundImage) {
    this.backgroundImage = new Image();
    this.backgroundImage.src = "img/background.jpg";
  }

  function nonPositiveRemainder(value, width) {
    value = value % width;
    while (value > 0) {
      value -= width;
    }
    return value;
  }

  var center = this.viewPort.modelViewPort.center;
  var bgSizeRatio = 1 + (this.viewPort.viewScale - 1) / this.backgroundSpeedRatio;
  var bgWidth = Math.round(bgSizeRatio * this.defaultBgSize);
  var bgHeight = Math.round(bgWidth * this.backgroundImage.width / this.backgroundImage.height);
  if (bgWidth < 100 || bgHeight < 100) {
    return;
  }
  var x = nonPositiveRemainder(Math.round(-center.x / this.backgroundSpeedRatio * bgSizeRatio), bgWidth);
  var y = nonPositiveRemainder(Math.round(-center.y / this.backgroundSpeedRatio * bgSizeRatio), bgHeight);
  while (x < this.canvas.width) {
    var yy = y;
    while (yy < this.canvas.height) {
      this.ctx.drawImage(this.backgroundImage, x, yy, bgWidth, bgHeight);
      yy += bgHeight;
    }
    x += bgWidth;
  }
};"use strict";

function CanvasView(model, viewPort, parts) {
  this.model = model;
  this.viewPort = viewPort;
  this.parts = parts || [];
  this.maxAge = Infinity;
  this.createdAt = Date.now();
}

CanvasView.modelName = "spaceobject";
CanvasView.images = {};
CanvasRenderer.registerViewClass(CanvasView);

CanvasView.prototype.drawImage = function (descriptor) {
  var offsetX = descriptor.offsetX || 0;
  var offsetY = descriptor.offsetY || 0;
  this.ctx.translate(this.projectedPos.x, this.projectedPos.y);
  this.ctx.rotate(this.model.heading);
  this.ctx.scale(this.viewPort.viewScale, this.viewPort.viewScale);
  this.ctx.translate(offsetX, offsetY);
  this.ctx.globalAlpha = typeof descriptor.alpha === "undefined" ? 1 : descriptor.alpha;
  this.ctx.drawImage(descriptor.image, Math.round(-descriptor.width / 2), Math.round(-descriptor.height / 2), descriptor.width, descriptor.height);
};

CanvasView.prototype.drawPart = function (descriptor) {
  this.projectedPos = this.viewPort.isInView(this.model.pos, this.model.radius);
  if (!this.projectedPos) return;

  this.ctx.save();
  this.drawImage(descriptor);
  this.ctx.restore();
};

CanvasView.prototype.drawTo = function (ctx) {
  this.ctx = ctx;
  var age = Math.min(Date.now() - this.createdAt, this.maxAge);
  this.calcAnimationState(age);
  this.parts.forEach(this.drawPart.bind(this));
};

CanvasView.prototype.calcAnimationState = function (age) {
  return age;
};

CanvasView.loadImage = function (imageName) {
  if (CanvasView.images[imageName]) {
    return CanvasView.images[imageName];
  }
  var image = new Image();
  image.src = "img/" + imageName + ".png";
  image.width = 60;
  image.height = 60;
  CanvasView.images[imageName] = image;
  return image;
};"use strict";

function AteroidCanvasView(model, viewPort) {
  CanvasView.call(this, model, viewPort, [{
    image: CanvasView.loadImage("asteroid"),
    width: model.radius * 2,
    height: model.radius * 2
  }]);
}

AteroidCanvasView.prototype = Object.create(CanvasView.prototype);

CanvasRenderer.registerViewClass("asteroid", AteroidCanvasView);"use strict";

function EnginePoweredCanvasView(flameDescriptor) {
  var flame = flameDescriptor || EnginePoweredCanvasView.defaultFlame;
  this.parts.unshift(flame);
  var engineRunning = false;
  var animationDuration = 200;
  var flameWidth = flameDescriptor.width;
  var flameOffsetX = flameDescriptor.offsetX;
  var animationStartedAt;

  this.calcAnimationState = function (age) {
    if (engineRunning !== this.model.enginePowered.engineRunning) {
      engineRunning = this.model.enginePowered.engineRunning;
      animationStartedAt = age;
    }
    var transitionState = Math.min((age - animationStartedAt) / animationDuration, 1);
    transitionState = engineRunning ? transitionState : 1 - transitionState;
    flame.alpha = 1.5 - transitionState;
    flame.width = flameWidth * transitionState;
    flame.offsetX = -20 + flameOffsetX * transitionState;
  };
}

EnginePoweredCanvasView.defaultFlame = {
  image: CanvasView.loadImage("doubleflame"),
  width: 120,
  height: 30,
  offsetX: -77,
  offsetY: 0
};"use strict";

function DetonationCanvasView(model, viewPort) {
  var detonationImage = {
    image: CanvasView.loadImage("detonation"),
    width: 400,
    height: 400,
    alpha: 0
  };
  CanvasView.call(this, model, viewPort, [detonationImage]);
  this.detonationImage = detonationImage;
  this.maxAge = 1000;
}

DetonationCanvasView.prototype = Object.create(CanvasView.prototype);

CanvasRenderer.registerViewClass("detonation", DetonationCanvasView);


DetonationCanvasView.prototype.calcAnimationState = function (age) {
  var relativeAge = age / this.maxAge;
  this.detonationImage.alpha = 1 - relativeAge;
  this.detonationImage.width = Math.round(500 * relativeAge);
  this.detonationImage.height = Math.round(500 * relativeAge);
};"use strict";

function EarthCanvasView(model, viewPort) {
  CanvasView.call(this, model, viewPort, [{
    image: CanvasView.loadImage("earth"),
    width: model.radius * 2,
    height: model.radius * 2
  }]);
}

EarthCanvasView.prototype = Object.create(CanvasView.prototype);

CanvasRenderer.registerViewClass("earth", EarthCanvasView);"use strict";

function MoonCanvasView(model, viewPort) {
  CanvasView.call(this, model, viewPort, [{
    image: CanvasView.loadImage("moon"),
    width: model.radius * 2,
    height: model.radius * 2
  }]);
}

MoonCanvasView.prototype = Object.create(CanvasView.prototype);

CanvasRenderer.registerViewClass("moon", MoonCanvasView);"use strict";

function MissileCanvasView(model, viewPort) {
  CanvasView.call(this, model, viewPort, [{
    image: CanvasView.loadImage("missile"),
    width: 30,
    height: 12
  }]);
  var flame = {
    image: CanvasView.loadImage("flame"),
    width: 50,
    height: 10,
    offsetX: -18,
    offsetY: 0
  };
  EnginePoweredCanvasView.call(this, flame);
}

MissileCanvasView.prototype = Object.create(CanvasView.prototype);

CanvasRenderer.registerViewClass("missile", MissileCanvasView);"use strict";

function PlanetCanvasView(model, viewPort) {
  CanvasView.call(this, model, viewPort, [{
    image: CanvasView.loadImage("planet"),
    width: model.radius * 2,
    height: model.radius * 2
  }]);
}

PlanetCanvasView.prototype = Object.create(CanvasView.prototype);

CanvasRenderer.registerViewClass("planet", PlanetCanvasView);"use strict";

function SpaceDebrisCanvasView(model, viewPort) {
  CanvasView.call(this, model, viewPort, [{
    image: CanvasView.loadImage("spacedebris"),
    width: model.radius * 2,
    height: model.radius * 2
  }]);
}

SpaceDebrisCanvasView.prototype = Object.create(CanvasView.prototype);

CanvasRenderer.registerViewClass("spacedebris", SpaceDebrisCanvasView);"use strict";

function SpaceShipCanvasView(model, viewPort) {
  CanvasView.call(this, model, viewPort, [{
    image: CanvasView.loadImage("spaceship"),
    width: 40,
    height: 20
  }]);
  var flame = {
    image: CanvasView.loadImage("doubleflame"),
    width: 120,
    height: 30,
    offsetX: -57,
    offsetY: 0
  };
  EnginePoweredCanvasView.call(this, flame);
}

SpaceShipCanvasView.prototype = Object.create(CanvasView.prototype);

CanvasRenderer.registerViewClass("spaceship", SpaceShipCanvasView);"use strict";

function StarCanvasView(model, viewPort) {
  CanvasView.call(this, model, viewPort, [{
    image: CanvasView.loadImage("star"),
    width: model.radius * 2.2,
    height: model.radius * 2.2
  }]);
}

StarCanvasView.prototype = Object.create(CanvasView.prototype);

CanvasRenderer.registerViewClass("star", StarCanvasView);
CanvasRenderer.registerViewClass("fixedstar", StarCanvasView);"use strict";

function TouchControlView() {
  View.call(this, null, "touchcontrol");
}

TouchControlView.prototype = Object.create(View.prototype);
TouchControlView.prototype.constructor = TouchControlView;
"use strict";

function DebugView(simulation, renderer) {
  this.projection = {
    timerLag: function() {
      var val = Math.round(simulation.avgStepsPerCB * 100) / 100;
      return {
        textContent: val,
        className: val < 1.1 ? "normal" : "warning"
      };
    }
  };
  View.call(this, simulation, "debug");
  SimulationObserver.call(this, simulation);
}

DebugView.prototype = Object.create(View.prototype);
DebugView.prototype.constructor = DebugView;

DebugView.prototype.oneStepTaken = function () {
  this.updateAll();
};"use strict";

function Controller(model, view) {
  this.model = model;
  this.view = view;
  this.controlElements = this.view && this.view.loadElementsToObject("[data-control]", "data-control");
  this.bindEvents();
}

Controller.prototype.eventMapping = {};

/** @private */
Controller.prototype.bindEvents = function () {
  var that = this;
  function createHandler(eventName, eventHandler, control) {
    try {
      control.addEventListener(eventName, function (evt) {
        evt.preventDefault();
        eventHandler.call(that, evt);
      });
    } catch (e) {
      console.error("Cannot bind event " + eventName + " to control " + controlName, e);
    }
  }
  for (var controlName in this.eventMapping) {
    var control = this.controlElements[controlName];
    var events = this.eventMapping[controlName];
    for (var eventName in events) {
      createHandler(eventName, events[eventName], control);
    }
  }
};"use strict";

function KeyboardController(spaceShip, camera) {
  this.spaceShip = spaceShip;
  this.camera = camera;
  document.addEventListener("keydown", this.keydownHandler.bind(this));
  document.addEventListener("keyup", this.keyupHandler.bind(this));
}

/** @private */
KeyboardController.prototype.keydownHandler = function (keyEvent) {
  //console.log(this.getKey(keyEvent));
  switch (keyEvent.key) {
  case "ArrowRight":
    this.spaceShip.startRotationRight();
    break;
  case "ArrowLeft":
    this.spaceShip.startRotationLeft();
    break;
  case "ArrowUp":
    this.spaceShip.startEngine();
    break;
  case " ":
  case "Spacebar":
    this.spaceShip.launchMissile();
    break;
  case "Control":
    this.camera.switchOutlined();
  }
};

/** @private */
KeyboardController.prototype.keyupHandler = function (keyEvent) {
  switch (keyEvent.key) {
  case "ArrowRight":
  case "ArrowLeft":
    this.spaceShip.stopRotation();
    break;
  case "ArrowUp":
    this.spaceShip.stopEngine();
    break;
  }
};"use strict";

function TouchController(spaceShip, camera, touchControlView) {
  this.eventMapping = {
    leftcontrol: {
      touchstart: spaceShip.startRotationLeft.bind(spaceShip),
      touchend: spaceShip.stopRotation.bind(spaceShip),
      touchcancel: spaceShip.stopRotation.bind(spaceShip)
    },
    rightcontrol: {
      touchstart: spaceShip.startRotationRight.bind(spaceShip),
      touchend: spaceShip.stopRotation.bind(spaceShip),
      touchcancel: spaceShip.stopRotation.bind(spaceShip)
    },
    enginecontrol: {
      touchstart: spaceShip.startEngine.bind(spaceShip),
      touchend: spaceShip.stopEngine.bind(spaceShip),
      touchcancel: spaceShip.stopEngine.bind(spaceShip)
    },
    firecontrol: {
      touchstart: spaceShip.launchMissile.bind(spaceShip)
    },
    outlinecontrol: {
      touchstart: camera.switchOutlined.bind(camera)
    }
  };
  Controller.call(this, spaceShip, touchControlView);
}

TouchController.prototype = Object.create(Controller.prototype);
TouchController.prototype.constructor = TouchController;

/**
 * @static
 * Creates a touch screen controller (TouchControlView and TouchController) for the given spaceship. If the browser does not support touching, 
 then returns null
 */
TouchController.createControllerFor = function (spaceShip, simulation) {
  if (!BrowserFeatures.hasTouch) {
    return null;
  }
  var touchControlView = new TouchControlView();
  var touchController = new TouchController(spaceShip, simulation, touchControlView);
  return touchController;
};"use strict";

function SceneSelector() {
  this.model = {};
  this.view = new View(this.model, "sceneselector");
  this.eventMapping = {
    loadscene: {
      click: this.loadScene.bind(this),
    }
  };
  Controller.call(this, this.model, this.view);
  CustomEventTarget.call(this);
}

SceneSelector.prototype = Object.create(Controller.prototype);
SceneSelector.prototype.constructor = SceneSelector;

SceneSelector.prototype.loadScene = function (event) {
  var sceneName = event.target.dataset.scene;
  this.emit("sceneselected", sceneName);
};"use strict";

function MainController() {
  this.model = {};
  this.view = new View(this.model, "main");

  Controller.call(this, this.model, this.view);

  this.selectScene("SpaceDebrisScene");
  this.showSceneSelector();
}

MainController.prototype = Object.create(Controller.prototype);
MainController.prototype.constructor = MainController;

MainController.prototype.selectScene = function (sceneNameOrEvent) {
  this.hideSceneSelector();
  this.removeSimulation();

  var sceneName = sceneNameOrEvent;
  if (typeof sceneNameOrEvent === "object") {
    sceneName = sceneNameOrEvent.detail;
  }

  this.simulation = new Simulation(60);
  var area = document.getElementById('area');
  this.renderer = new CanvasRenderer(this.simulation, area);
  this.scene = Scene.createScene(sceneName, this.simulation, this.renderer);
  this.debugView = new DebugView(this.simulation, this.renderer);
  document.body.appendChild(this.debugView.rootElement);

  this.simulation.start();
  this.renderer.start();
  this.bindToObjective(this.scene.objective);
};

MainController.prototype.bindToObjective = function (objective) {
  if (!objective) {
    return;
  }
  this.unbindObjective();
  this.objective = objective;
  this.winHandler = (function winHandler() {
    alert("win!");
    this.showSceneSelector();
  }).bind(this);

  this.failhandler = (function failhandler(event) {
    var reason;
    try {
      reason = event.detail.lostObject.constructor.name;
    } catch (e) {}
    alert("fail: " + reason);
    this.showSceneSelector();
  }).bind(this);

  objective.addEventListener("win", this.winHandler);
  objective.addEventListener("fail", this.failhandler);
};

MainController.prototype.unbindObjective = function () {
  if (!this.objective) {
    return;
  }
  if (this.winHandler) {
    this.objective.removeEventListener("win", this.winHandler);
  }
  if (this.failHandler) {
    this.objective.removeEventListener("fail", this.failHandler);
  }
  this.objective = null;
};

MainController.prototype.removeSimulation = function () {
  if (!this.simulation) {
    return;
  }
  this.simulation.stop();
  this.simulation = null;

  this.renderer.stop();
  this.renderer = null;

  if (this.debugView) {
    document.body.removeChild(this.debugView.rootElement);
    this.debugView = null;
  }
  this.scene = null;
};

MainController.prototype.showSceneSelector = function () {
  if (!this.sceneSelector) {
    this.sceneSelector = new SceneSelector();
    this.sceneSelector.addEventListener("sceneselected", this.selectScene.bind(this));
  }
  this.view.rootElement.appendChild(this.sceneSelector.view.rootElement);
};

MainController.prototype.hideSceneSelector = function () {
  if (this.sceneSelector) {
    this.view.rootElement.removeChild(this.sceneSelector.view.rootElement);
  }
};