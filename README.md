# Dead simple Google maps driver

[Checkout the example](https://cdn.rawgit.com/fourlabsldn/fl-google-maps-driver/master/examples/index.html)
## How to use:
Give a look at the examples folder.
``` javascript
  const mapDriver = new MapDriver(google, '#map', { center: { lat: 51.473663, lng: -0.203287 }});

  // Crate markers with latitude and longitude
  const marker = mapDriver.createMarker({
     lat: 51.473663,
     lng: -0.203287 ,
     icon: 'http://example.com/icon.jpg'
  });

  // Move marker
  mapDriver.moveMarker(marker, { lat: 51.579663, lng: -0.613287 });

  // Set anination duration
  mapDriver.moveMarker(marker, { lat: 51.579663, lng: -0.613287 }, 2500);

  // get locations for addresses
  mapDriver.toLatLng('21 Heathmans Road, London, Uk')
  .then(coord => {
    const marker2 = mapDriver.createMarker({
      lat: coords.lat,
      lng: coords.lng,
    });
  });

  // Get existing markers
  const allMarkers = mapDriver.getMarkers();

  // Focus markers
  mapDriver.focusMarkers(allMarkers);

  // Destroy markers
  mapDriver.destroyMarker(marker);
```

## API
``` javascript
  /**
   * Adds a marker to this.markers list
   * @private
   * @method addMarker
   * @param {Marker}
   */
  addMarker(marker)

  /**
   * Returns all markers currently in the map
   * @public
   * @return {Array<Marker>}
   */
  getMarkers()

  /**
   * Creates a map marker
   * @public
   * @param {Object} config - Must have 'lat' and lng'
   * @return {Marker}
   */
  createMarker(config)

  /**
   * Animates a marker to a specific coordinate
   * @public
   * @param {Marker} marker
   * @param {Object} destination - 'lat' and 'lng'
   * @param {Int} duration - In milliseconds
   */
  moveMarker(marker, destination, duration = 1000)

  /**
   * Removes a marker from the map.
   * @public
   * @param {Marker} marker
   */
  destroyMarker(marker)

  /**
   * Fits map's focus on specified markers
   * @public
   * @param {Array<Marker}
   */
  focusMarkers(markers)

  /**
   * Converts an array into an object with 'lat' and 'lng'
   * @public
   * @param {String} address
   * @return {Promise<Object>}
   */
  async toLatLng(address)
```
