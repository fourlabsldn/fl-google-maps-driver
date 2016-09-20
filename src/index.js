/* globals google */
import assert from 'fl-assert';

const DEFAULTS = {
  apiKey: 'AIzaSyACR9XwTnLLG11mr2ncrIgR7vwAlAzBK08',
  mapOptions: {
    center: { lat: 51.473663, lng: -0.203287 },
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    zoom: 14,
    scrollwheel: false,
    maxZoom: 17,
  },
};

function withoutIndex(array, index) {
  return array.slice(0, index).concat(array.slice(index + 1, array.length));
}

/**
 * @function createMap
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

export default class MapDriver {
  constructor(mapContainerSelector, options) {
    assert(window.google, 'Google Maps not loaded.');
    const mapContainer = document.querySelector(mapContainerSelector);
    const containerIsValid = mapContainer && mapContainer.nodeName;
    assert(containerIsValid, `Invalid map container from selector: ${mapContainerSelector}`);

    this.map = createMap(mapContainer, options);
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

  /**
   * @public
   */
  async createMarker(config) {
    const marker = createMarker(this.map, config);
    this.addMarker(marker);
    return marker;
  }

  moveMarker(marker, destination) {
    const position = createPosition(destination);
    marker.setPosition(position);
    return this;
  }

  destroyMarker(marker) {
    const mIndex = this.markers.indexOf(marker);
    assert(mIndex !== -1, 'Attempting to destroy a marker that is not in the map.');
    this.markers = withoutIndex(this.markers, mIndex);
    marker.setMap(null);
    return this;
  }
}
