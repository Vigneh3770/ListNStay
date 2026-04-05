mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map", // container ID
  center: data.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
  zoom: 9, // starting zoom
});

console.log(data.geometry.coordinates);

const marker1 = new mapboxgl.Marker({ color: "red" })
  .setLngLat(data.geometry.coordinates)
  .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(`${data.location}`))
  .addTo(map);
