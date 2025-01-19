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
  mapboxgl.accessToken = 'YOUR_MAPBOX_ACCESS_TOKEN';

  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/your-style-id',
    center: [0, 20],
    zoom: 2,
  });

  // Dataset with progress info
  const progressData = [
    { name: "Afghanistan", InGeoGuessr: 0, Progress: "Not applicable" },
    { name: "Alaska", InGeoGuessr: 1, Progress: "Finished" },
    { name: "Albania", InGeoGuessr: 1, Progress: "Not started" },
  ];

  const progressColors = {
    "Not applicable": "#CCCCCC",
    "Finished": "#008000",
    "Not started": "#FF0000",
  };

  map.on('load', () => {
    // Check if the layer exists in the style
    if (map.getLayer('countries')) {
      // Dynamically set paint properties for the layer
      map.setPaintProperty('countries', 'fill-color', [
        'match',
        ['get', 'name'], // Match the 'name' property in the tileset
        ...progressData.flatMap(({ name, Progress, InGeoGuessr }) =>
          InGeoGuessr === 0
            ? [name, '#CCCCCC'] // Gray for 'InGeoGuessr: 0'
            : [name, progressColors[Progress]]
        ),
        '#CCCCCC', // Default color if no match
      ]);
    } else {
      console.error("Layer 'countries' not found in the style.");
    }
  });
</script>
