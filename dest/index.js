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
      zoom: 10,
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
    assert(config.lat && config.lng, 'No marker position provided');
    const position = createPosition(config.lat, config.lng);
    const markerConfig = Object.assign({}, config, { position, map });
    const marker = new google.maps.Marker(markerConfig);
    return marker;
  }

  function createInfoWindow() {
    return new google.maps.InfoWindow({});
  }

  return {
    addressToLatLng,
    createBounds,
    createMap,
    createPosition,
    createMarker,
    createInfoWindow
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

function easeInOutQuad(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

function easeInOutCoord(frame, totalFrames, fromCoord, toCoord) {
  const animPercentage = totalFrames ? frame / totalFrames : 1;
  return {
    lat: easeInOutQuad(animPercentage) * (toCoord.lat - fromCoord.lat) + fromCoord.lat,
    lng: easeInOutQuad(animPercentage) * (toCoord.lng - fromCoord.lng) + fromCoord.lng
  };
}

class MapDriver {
  constructor(google, mapContainerSelector, options) {
    assert(google, 'Google Maps not loaded.');
    const mapContainer = document.querySelector(mapContainerSelector);
    const containerIsValid = mapContainer && mapContainer.nodeName;
    assert(containerIsValid, `Invalid map container from selector: ${ mapContainerSelector }`);

    this.gmap = new GMap(google);
    this.map = this.gmap.createMap(mapContainer, options);
    this.infoWindow = this.gmap.createInfoWindow();
    this.markers = [];
    Object.preventExtensions(this);
  }

  /**
   * Adds a marker to this.markers list
   * @private
   * @method addMarker
   * @param {Marker}
   */
  addMarker(marker) {
    this.markers = this.markers.concat([marker]);
    return this;
  }

  /**
   * Returns all markers currently in the map
   * @public
   * @return {Array<Marker>}
   */
  getMarkers() {
    return Array.from(this.markers);
  }

  /**
   * Creates a map marker
   * @public
   * @param {Object} config - Must have 'lat' and lng'
   * @return {Marker}
   */
  createMarker(config) {
    const marker = this.gmap.createMarker(this.map, config);
    if (config.infoWindow) {
      const infoContent = typeof config.infoWindow === 'function' ? config.infoWindow : () => config.infoWindow;

      marker.addListener('click', () => this.showInfoWindow(marker, infoContent()));
    }

    this.addMarker(marker);
    return marker;
  }

  /**
   * Animates a marker to a specific coordinate
   * @public
   * @param {Marker} marker
   * @param {Object} destination - 'lat' and 'lng'
   * @param {Int} duration - In milliseconds
   */
  moveMarker(marker, destination, duration = 1000) {
    const toCoord = destination;
    const fromCoord = {
      lat: marker.getPosition().lat(),
      lng: marker.getPosition().lng()
    };

    const slideMarker = (frameNo, totalFrames) => {
      const currentCoord = easeInOutCoord(frameNo, totalFrames, fromCoord, toCoord);
      const pos = this.gmap.createPosition(currentCoord);
      marker.setPosition(pos);

      if (frameNo < totalFrames) {
        requestAnimationFrame(() => slideMarker(frameNo + 1, totalFrames));
      }
    };
    const durationInFrames = duration * 0.060;
    slideMarker(0, durationInFrames);
    return this;
  }

  /**
   * Removes a marker from the map.
   * @public
   * @param {Marker} marker
   */
  destroyMarker(marker) {
    const mIndex = this.markers.indexOf(marker);
    assert(mIndex !== -1, 'Attempting to destroy a marker that is not in the map.');
    this.markers = withoutIndex(this.markers, mIndex);
    marker.setMap(null);
    return this;
  }

  /**
   * Fits map's focus on specified markers
   * @public
   * @param {Array<Marker}
   */
  focusMarkers(markers) {
    const bounds = this.gmap.createBounds();
    markers.forEach(m => bounds.extend(m.getPosition()));
    this.map.fitBounds(bounds);
  }

  /**
   * Converts an array into an object with 'lat' and 'lng'
   * @public
   * @param {String} address
   * @return {Object}
   */
  toLatLng(address) {
    var _this = this;

    return asyncToGenerator(function* () {
      return _this.gmap.addressToLatLng(address);
    })();
  }

  /**
   * @private
   * @method showInfoWindow
   * @param {Marker} marker
   * @param {String} content
   */
  showInfoWindow(marker, content) {
    this.infoWindow.setContent(content);
    this.infoWindow.open(this.map, marker);
    return this;
  }
}

return MapDriver;

})));

//# sourceMappingURL=index.js.map
