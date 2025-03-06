import { getColorForNormalizedLocation, whatFill } from "./utils/mapLayers.js";

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

  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/przemek54/cm62kpxxu003z01s73ogpap63/draft',
    center: [0, 10],
    zoom: 0.75,
    minZoom: 0.75, // Set the minimum zoom level
    maxZoom: 3, // Set the maximum zoom level
    projection: 'naturalEarth',
  });

  function updateMapStyle(variable, layers) {
    layers.forEach((layer) => {
      if (map.getLayer(layer)) {
        let paintProperty;
        switch (variable) {
          case 'progress':
            paintProperty = [
              'match',
              ['get', 'name'], // Match the 'name' property in the tileset
              ...progressData.flatMap(({name, Progress}) =>
                [name, progressColors[Progress.trim().toLowerCase()]]
              ),
              '#CCCCCC', // Default color if no match
            ];
            break;
          case 'locations':
            paintProperty = [
              'match',
              ['get', 'name'],
              ...progressData.flatMap(({name, NormalizedLocations}) => {
                const color = getColorForNormalizedLocation([255, 255, 255], [166, 164, 63], NormalizedLocations);
                return [name, color]
              }),
              '#CCCCCC', // Default color if no match
            ];
            break;
          case 'metas':
            paintProperty = [
              'match',
              ['get', 'name'],
              ...progressData.flatMap(({name, NormalizedMetas}) => {
                const color = getColorForNormalizedLocation([255, 255, 255], [143, 57, 57], NormalizedMetas);
                return [name, color]
              }),
              '#CCCCCC', // Default color if no match
            ];
            break;
          default:
            paintProperty = ['#CCCCCC'];
        };
        map.setPaintProperty(layer, whatFill(layer), paintProperty);
      } else {
        console.error(`Layer '${layer}' not found in the style.`);
      };
      
      if (layer === "centroids") {
        const centroidNames = progressData.filter(({InGeoGuessr}) => InGeoGuessr === 1).map(({name}) => name);
        map.setFilter(layer, ['in', ['get', 'name'], ["literal", centroidNames]]);
      };
    });
  };
  
  document.getElementById('js-variable-select').addEventListener('change', (event) => {
    updateMapStyle(event.target.value, ["countries", "centroids"]);
  });

  map.on('load', () => {
    document.getElementById('js-variable-select').value = 'progress';
    updateMapStyle('progress', ["countries", "centroids"]);
  });
});