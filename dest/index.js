(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('lodash/fp')) :
  typeof define === 'function' && define.amd ? define(['lodash/fp'], factory) :
  (global.flMaps = factory(global.lodash_fp));
}(this, (function (lodash_fp) { 'use strict';

// Bug checking function that will throw an error whenever
// the condition sent to it is evaluated to false
/**
 * Processes the message and outputs the correct message if the condition
 * is false. Otherwise it outputs null.
 * @api private
 * @method processCondition
 * @param  {Boolean} condition - Result of the evaluated condition
 * @param  {String} errorMessage - Message explainig the error in case it is thrown
 * @return {String | null}  - Error message if there is an error, nul otherwise.
 */
function processCondition(condition, errorMessage) {
  if (!condition) {
    var completeErrorMessage = '';
    var re = /at ([^\s]+)\s\(/g;
    var stackTrace = new Error().stack;
    var stackFunctions = [];

    var funcName = re.exec(stackTrace);
    while (funcName && funcName[1]) {
      stackFunctions.push(funcName[1]);
      funcName = re.exec(stackTrace);
    }

    // Number 0 is processCondition itself,
    // Number 1 is assert,
    // Number 2 is the caller function.
    if (stackFunctions[2]) {
      completeErrorMessage = stackFunctions[2] + ': ' + completeErrorMessage;
    }

    completeErrorMessage += errorMessage;
    return completeErrorMessage;
  }

  return null;
}

/**
 * Throws an error if the boolean passed to it evaluates to false.
 * To be used like this:
 * 		assert(myDate !== undefined, "Date cannot be undefined.");
 * @api public
 * @method assert
 * @param  {Boolean} condition - Result of the evaluated condition
 * @param  {String} errorMessage - Message explainig the error in case it is thrown
 * @return void
 */
function assert(condition, errorMessage) {
  var error = processCondition(condition, errorMessage);
  if (typeof error === 'string') {
    throw new Error(error);
  }
}

/**
 * Logs a warning if the boolean passed to it evaluates to false.
 * To be used like this:
 * 		assert.warn(myDate !== undefined, "No date provided.");
 * @api public
 * @method warn
 * @param  {Boolean} condition - Result of the evaluated condition
 * @param  {String} errorMessage - Message explainig the error in case it is thrown
 * @return void
 */
assert.warn = function warn(condition, errorMessage) {
  var error = processCondition(condition, errorMessage);
  if (typeof error === 'string') {
    console.warn(error);
  }
};

// Google API Methods
const geocodingUrl = 'https://maps.googleapis.com/maps/api/geocode/json';

function GMap(google) {
  const DEFAULTS = {
    apiKey: 'AIzaSyACR9XwTnLLG11mr2ncrIgR7vwAlAzBK08',
    mapOptions: {
      center: { lat: 51.473663, lng: -0.203287 },
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      zoom: 14,
      scrollwheel: false,
      maxZoom: 17
    }
  };

  function addressToLatLng(address, apiKey = DEFAULTS.apiKey) {
    const encodedAddress = encodeURIComponent(address);
    const url = `${ geocodingUrl }?address=${ encodedAddress }&key=${ apiKey }`;
    // Get url and safely get properties
    return fetch(url).then(r => r.json()).then(lodash_fp.get('results[0].geometry.location'));
  }

  /**
   * @method createBounds
   * @return {Object} - map bounds
   */
  function createBounds() {
    return new google.maps.LatLngBounds();
  }

  /**
   * @param {HTMLElement} mapContainer
   * @param {Object} options
   * @return map
   */
  function createMap(mapContainer, options = {}) {
    const mapOptions = Object.assign({}, DEFAULTS.mapOptions, options);
    const map = new google.maps.Map(mapContainer, mapOptions);
    return map;
  }

  function createPosition(lat, lng) {
    return new google.maps.LatLng(lat, lng);
  }

  function createMarker(map, config) {
    assert(config, 'No marker configuration provided');
    assert(config.position, 'No marker position provided');
    const position = createPosition(config.lat, config.lng);
    const markerConfig = Object.assign({}, config, { position, map });
    const marker = new google.maps.Marker(markerConfig);
    return marker;
  }

  return {
    addressToLatLng,
    createBounds,
    createMap,
    createPosition,
    createMarker
  };
}

var asyncToGenerator = function (fn) {
  return function () {
    var gen = fn.apply(this, arguments);
    return new Promise(function (resolve, reject) {
      function step(key, arg) {
        try {
          var info = gen[key](arg);
          var value = info.value;
        } catch (error) {
          reject(error);
          return;
        }

        if (info.done) {
          resolve(value);
        } else {
          return Promise.resolve(value).then(function (value) {
            return step("next", value);
          }, function (err) {
            return step("throw", err);
          });
        }
      }

      return step("next");
    });
  };
};











var get$1 = function get$1(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get$1(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};

















var set = function set(object, property, value, receiver) {
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent !== null) {
      set(parent, property, value, receiver);
    }
  } else if ("value" in desc && desc.writable) {
    desc.value = value;
  } else {
    var setter = desc.set;

    if (setter !== undefined) {
      setter.call(receiver, value);
    }
  }

  return value;
};

/* globals google */
function withoutIndex(array, index) {
  return array.slice(0, index).concat(array.slice(index + 1, array.length));
}

class MapDriver {
  constructor(google, mapContainerSelector, options) {
    assert(google, 'Google Maps not loaded.');
    const mapContainer = document.querySelector(mapContainerSelector);
    const containerIsValid = mapContainer && mapContainer.nodeName;
    assert(containerIsValid, `Invalid map container from selector: ${ mapContainerSelector }`);

    this.gmap = new GMap(google);
    this.map = this.gmap.createMap(mapContainer, options);
    this.markers = [];
    Object.preventExtensions(this);
  }

  /**
   * @private
   */
  addMarker(marker) {
    this.markers = this.markers.concat([marker]);
    return this;
  }

  /**
   * @public
   */
  getMarkers() {
    return Array.from(this.markers);
  }

  createMarker(config) {
    var _this = this;

    return asyncToGenerator(function* () {
      const coord = yield _this.toLatLng(config);
      const fullConfig = Object.assign({}, config, coord);
      const marker = _this.gmap.createMarker(_this.map, fullConfig);
      _this.addMarker(marker);
      return marker;
    })();
  }

  moveMarker(marker, destination) {
    var _this2 = this;

    return asyncToGenerator(function* () {
      lodash_fp.flow((yield _this2.toLatLng), _this2.gmap.createPosition, marker.setPosition)(destination);
      return _this2;
    })();
  }

  destroyMarker(marker) {
    const mIndex = this.markers.indexOf(marker);
    assert(mIndex !== -1, 'Attempting to destroy a marker that is not in the map.');
    this.markers = withoutIndex(this.markers, mIndex);
    marker.setMap(null);
    return this;
  }

  focusMarkers(markers) {
    const bounds = this.gmap.createBounds();
    markers.forEach(m => bounds.extend(m.getPosition()));
    this.map.fitBounds(bounds);
  }

  toLatLng(address) {
    var _this3 = this;

    return asyncToGenerator(function* () {
      const isPostcode = !address.lat && address.postcode;
      return isPostcode ? yield _this3.gmap.addressToLatLng(address) : address;
    })();
  }
}

return MapDriver;

})));

//# sourceMappingURL=index.js.map
