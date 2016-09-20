/* globals google */
import assert from 'fl-assert';
import GMap from './GMap';

function withoutIndex(array, index) {
  return array.slice(0, index).concat(array.slice(index + 1, array.length));
}

function easeInOutQuad(t) {
  return t < 0.5 ? 2 * t * t : - 1 + (4 - 2 * t) * t;
}

function easeInOutCoord(frame, totalFrames, fromCoord, toCoord) {
  const animPercentage = totalFrames ? frame / totalFrames : 1;
  return {
    lat: easeInOutQuad(animPercentage) * (toCoord.lat - fromCoord.lat) + fromCoord.lat,
    lng: easeInOutQuad(animPercentage) * (toCoord.lng - fromCoord.lng) + fromCoord.lng,
  };
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
      lng: marker.getPosition().lng(),
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
    console.log(durationInFrames);
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
  async toLatLng(address) {
    return this.gmap.addressToLatLng(address);
  }
}
