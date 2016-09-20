import { get } from 'lodash/fp';
const geocodingUrl = 'https://maps.googleapis.com/maps/api/geocode/json';

export default function geodecode(postcode, apiKey) {
  const encodedPostcode = encodeURIComponent(postcode);
  const url = `${geocodingUrl}?address=${encodedPostcode}&key=${apiKey}`;
  // Get url and safely get properties
  return fetch(url)
    .then(r => r.json())
    .then(get('results[0].geometry.location'));
}
