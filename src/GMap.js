// Google API Methods
import assert from 'fl-assert';
import { get } from 'lodash/fp';
const geocodingUrl = 'https://maps.googleapis.com/maps/api/geocode/json';

export default function GMap(google) {
  const DEFAULTS = {
    apiKey: 'AIzaSyACR9XwTnLLG11mr2ncrIgR7vwAlAzBK08',
    mapOptions: {
      center: { lat: 51.473663, lng: -0.203287 },
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      zoom: 10,
      scrollwheel: false,
      maxZoom: 17,
    },
  };

  function addressToLatLng(address, apiKey = DEFAULTS.apiKey) {
    const encodedAddress = encodeURIComponent(address);
    const url = `${geocodingUrl}?address=${encodedAddress}&key=${apiKey}`;
    // Get url and safely get properties
    return fetch(url)
      .then(r => r.json())
      .then(get('results[0].geometry.location'));
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
    createInfoWindow,
  };
}
