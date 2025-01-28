---
layout: article
title: Map
aside:
  toc: true
header:
  theme: dark
  background: 'linear-gradient(135deg, rgb(34, 139, 87), rgb(139, 34, 139))'
---
<div id="map" style="width: 100%; height: 500px"></div>
<select id="variable-select">
  <option value="hdi">Progress</option>
  <option value="gdp">Locations</option>
  <option value="birthRate">Metas</option>
</select>

## About
The goal of the map is to represent every clue on PlonkIt by at least 5 unique locations, with current progress shown on the map above. The vast majority of locations contain enough clues to identify the country. There are a couple that are more ambiguous, so you can expect to use your nogging every now and then.

## Statistics
As of the latest version, An Easy World 

You can use the controls on the map to display the number of locations or PlonkIt metas per country.

<script src="https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js"></script>
<link href="https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css" rel="stylesheet" />

<script>
  function tsvToJson(tsv) {
    const lines = tsv.trim().split('\n');
    const headers = lines[0].split('\t');
    const result = [];

    for (let i = 1; i < lines.length; i++) {
      const obj = {};
      const currentLine = lines[i].split('\t');

      headers.forEach((header, index) => {
        obj[header.trim()] = currentLine[index].trim();
      });

      // Convert InGeoGuessr, Locations, and Metas to integers
      obj.InGeoGuessr = parseInt(obj.InGeoGuessr, 10);
      obj.Locations = parseInt(obj.Locations, 10);
      obj.Metas = parseInt(obj.Metas, 10);

      result.push(obj);
    }

    return result;
  }

  async function fetchTsvData(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Network error');
      }
      const tsvData = await response.text();
      const progressData = tsvToJson(tsvData);

      // Calculate max values for Locations and Metas
      const maxLocations = Math.max(...progressData.map(item => item.Locations));
      const maxMetas = Math.max(...progressData.map(item => item.Metas));

      // Normalize Locations and Metas
      progressData.forEach(item => {
        item.NormalizedLocations = item.Locations / maxLocations;
        item.NormalizedMetas = item.Metas / maxMetas;
      });

      console.log(progressData); // For debugging purposes
      return progressData;
    } catch (error) {
      console.error('Failed to fetch TSV data:', error);
    }
  }

  mapboxgl.accessToken = 'pk.eyJ1IjoicHJ6ZW1lazU0IiwiYSI6ImNtNjFwazRsMjA2OXkycXB1MnFlOG9sZGoifQ.jOXAGgTKRWsqxgFfPOR8uQ';

  const tsvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQclsDyN6aq9eY0SYyKI4X66wXWT1eB5tfMgdBsTIKfI97QE4N9u-GOFY5u9T_tWgp2MvlaIPskmKnJ/pub?gid=1775399803&single=true&output=tsv';

  fetchTsvData(tsvUrl).then(progressData => {
    if (!progressData) {
      console.error('No progress data available');
      return;
    }

    const progressColors = {
      "not applicable": "#CCCCCC",
      "finished": "#70c286",
      "outdated": "#bcf0b6",
      "in progress": "#e3d981",
      "not started": "#db6969"
    };

    console.log(progressData);

    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/przemek54/cm62kpxxu003z01s73ogpap63',
      center: [0, 10],
      zoom: 0.75,
      minZoom: 0.75, // Set the minimum zoom level
      maxZoom: 3, // Set the maximum zoom level
      maxBounds: [[-240, -80], [240, 80]] // Set the geographical bounds to cover a wider area
    });

    const progressStyle = () => {
      if (map.getLayer('countries')) {
        // Dynamically set paint properties for the layer
        map.setPaintProperty('countries', 'fill-color', [
          'match',
          ['get', 'name'], // Match the 'name' property in the tileset
          ...progressData.flatMap(({name, Progress, InGeoGuessr}) =>
            InGeoGuessr === 0
              ? [name, '#CCCCCC'] // Gray for 'InGeoGuessr: 0'
              : [name, progressColors[Progress.trim().toLowerCase()]]
          ),
          '#CCCCCC', // Default color if no match
        ]);
      } else {
        console.error("Layer 'countries' not found in the style.");
      }

      if (map.getLayer('centroids')) {
        // Dynamically set paint properties for the centroids layer
        map.setPaintProperty('centroids', 'circle-color', [
          'match',
          ['get', 'join_name'], // Match the 'join_name' property in the tileset
          ...progressData.flatMap(({name, Progress, InGeoGuessr}) =>
            InGeoGuessr === 1
              ? [name, progressColors[Progress.trim().toLowerCase()]] // Color based on progress
              : []
          ),
          '#CCCCCC', // Default color if no match
        ]);
        const centroidNames = progressData.filter(({InGeoGuessr}) => InGeoGuessr === 1).map(({name}) => name);

        // Set visibility based on InGeoGuessr
        map.setFilter('centroids', ['in', ['get', 'join_name'], ["literal", centroidNames]]);
      } else {
        console.error("Layer 'centroids' not found in the style.");
      }

      if (map.getLayer('Locations')) {
        map.setPaintProperty('Locations', )
      }
    }

    map.on('load', progressStyle);
    map.on('styledata', progressStyle);
  });
</script>