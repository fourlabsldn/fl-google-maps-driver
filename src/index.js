/* globals google */
import assert from 'fl-assert';
import GMap from './GMap';
import { flow } from 'lodash/fp';

function withoutIndex(array, index) {
  return array.slice(0, index).concat(array.slice(index + 1, array.length));
}

export default class MapDriver {
  constructor(google, mapContainerSelector, options) {
    assert(google, 'Google Maps not loaded.');
    const mapContainer = document.querySelector(mapContainerSelector);
    const containerIsValid = mapContainer && mapContainer.nodeName;
    assert(containerIsValid, `Invalid map container from selector: ${mapContainerSelector}`);

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

  async createMarker(config) {
    const coord = await this.toLatLng(config);
    const fullConfig = Object.assign({}, config, coord);
    const marker = this.gmap.createMarker(this.map, fullConfig);
    this.addMarker(marker);
    return marker;
  }

  async moveMarker(marker, destination) {
    flow(
      await this.toLatLng,
      this.gmap.createPosition,
      marker.setPosition
    )(destination);
    return this;
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

  async toLatLng(address) {
    const isPostcode = !address.lat && address.postcode;
    return isPostcode
      ? await this.gmap.addressToLatLng(address)
      : address;
  }
}
