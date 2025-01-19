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
  async function fetchTsvData(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const tsvData = await response.text();
      return tsvToJson(tsvData);
    } catch (error) {
      console.error('Failed to fetch TSV data:', error);
      return null;
    }
  }

  function tsvToJson(tsv) {
    const lines = tsv.trim().split('\n');
    const headers = lines[0].split('\t');
    const result = [];

    for (let i = 1; i < lines.length; i++) {
      const obj = {};
      const currentLine = lines[i].split('\t');

      headers.forEach((header, index) => {
        obj[header.trim()] = currentLine[index]?.trim() || '';
      });

      // Convert numeric fields to integers
      obj.InGeoGuessr = parseInt(obj.InGeoGuessr, 10);
      obj.Locations = parseInt(obj.Locations, 10);
      obj.Metas = parseInt(obj.Metas, 10);

      result.push(obj);
    }

    return result;
  }

  mapboxgl.accessToken = 'pk.eyJ1IjoicHJ6ZW1lazU0IiwiYSI6ImNtNjFwazRsMjA2OXkycXB1MnFlOG9sZGoifQ.jOXAGgTKRWsqxgFfPOR8uQ';

  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/przemek54/cm62kpxxu003z01s73ogpap63',
    center: [0, 20],
    zoom: 2,
  });

  const tsvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQclsDyN6aq9eY0SYyKI4X66wXWT1eB5tfMgdBsTIKfI97QE4N9u-GOFY5u9T_tWgp2MvlaIPskmKnJ/pub?gid=1775399803&single=true&output=tsv';

  fetchTsvData(tsvUrl).then(progressData => {
    if (!progressData) {
      console.error('No progress data available');
      return;
    }

    const progressColors = {
      "Not applicable": "#CCCCCC",
      "Finished": "#9de3af",
      "Outdated": "#c8e3cf",
      "In progress": "#eddf9a",
      "Not started": "#e39d9d",
    };

    const applyStyles = () => {
      // Set fill-color for countries layer
      if (map.getLayer('countries-2ebq5h')) {
        map.setPaintProperty('countries-2ebq5h', 'fill-color', [
          'match',
          ['get', 'name'], // Match 'name' property in the tileset
          ...progressData.flatMap(({ name, Progress, InGeoGuessr }) =>
            InGeoGuessr === 0
              ? [name, '#CCCCCC'] // Gray for 'InGeoGuessr: 0'
              : [name, progressColors[Progress] || '#CCCCCC']
          ),
          '#CCCCCC', // Default color
        ]);
      } else {
        console.error("Layer 'countries-2ebq5h' not found in the style.");
      }

      // Set circle-color for centroids layer
      if (map.getLayer('centroids')) {
        map.setPaintProperty('centroids', 'circle-color', [
          'match',
          ['get', 'name'], // Match 'name' property in the tileset
          ...progressData.flatMap(({ name, Progress, InGeoGuessr }) =>
            InGeoGuessr === 1 ? [name, progressColors[Progress] || '#CCCCCC'] : []
          ),
          '#CCCCCC', // Default color
        ]);

        // Set filter for centroids visibility
        map.setFilter('centroids', ['==', ['get', 'InGeoGuessr'], 1]);
      } else {
        console.error("Layer 'centroids' not found in the style.");
      }
    };

    // Ensure styles are applied on map load
    map.on('load', applyStyles);

    // Reapply styles on any data reload
    map.on('styledata', applyStyles);
  });
</script>