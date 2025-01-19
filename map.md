---
layout: article
title: Progress Map
header:
  theme: dark
  background: 'linear-gradient(135deg, rgb(34, 139, 87), rgb(139, 34, 139))'
---

<div id="map" style="width: 100%; height: 500px;"></div>

<script src="https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js"></script>
<link href="https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css" rel="stylesheet" />

<script>
  mapboxgl.accessToken = 'pk.eyJ1IjoicHJ6ZW1lazU0IiwiYSI6ImNtNjFwazRsMjA2OXkycXB1MnFlOG9sZGoifQ.jOXAGgTKRWsqxgFfPOR8uQ';

  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/przemek54/cm62kpxxu003z01s73ogpap63',
    center: [0, 20],
    zoom: 2
  });

  // Dataset for countries and progress
  const progressData = [
    { name: "Afghanistan", InGeoGuessr: 0, Progress: "Not applicable" },
    { name: "Alaska", InGeoGuessr: 1, Progress: "Finished" },
    { name: "Albania", InGeoGuessr: 1, Progress: "Not started" }
  ];

  const progressColors = {
    "Not applicable": "#CCCCCC",
    "Finished": "#008000",
    "Not started": "#FF0000"
  };

  map.on('load', () => {
    map.addLayer({
      id: 'countries',
      type: 'fill',
      source: {
        type: 'vector',
        url: 'mapbox://przemek54.c6bv078c'
      },
      'source-layer': 'your-layer-name',
      paint: {
        'fill-color': [
          'match',
          ['get', 'name'],
          ...progressData.flatMap(({ name, Progress, InGeoGuessr }) => {
            return InGeoGuessr === 0 ? [name, '#CCCCCC'] : [name, progressColors[Progress]];
          }),
          '#CCCCCC' // Default color
        ]
      }
    });
  });
</script>
