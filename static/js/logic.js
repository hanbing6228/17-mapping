var quakeData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
var lineData = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";

readMap(quakeData, lineData);
function colorPaste(d) {
    
    return d > 5 ? "red" :      
           d > 4 ? "orange" :
           d > 3 ? "yellow" :
           d > 2 ? "blue" :
           d > 1 ? "purple" :
                     "pink";
  };
  
  function markerSize(magnitude) {
      return magnitude * 4;
  };
function readMap(quakeData, lineData) {
    d3.json(quakeData, function(response) {
        var quakeData = response;
        d3.json(lineData, function(response) {
            var lineData = response;
            createFeatures(quakeData, lineData);
        });

    });

    function createFeatures(quakeData, lineData) {
        function onEachquake(feature, layer) {
            layer.bindPopup("<h3>"+ feature.properties.place +"</h3><hr>" + 
            "<p><b>Time:</b> " + new Date(feature.properties.time) + "</p>" + 
            "</h3><hr><p>Magnitude: " + feature.properties.mag + "</p>");
    };

        function onEachLayer(feature, layer) {
            return new L.starMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
                fillOpacity: 0.7,
                weight: 0.5,
                color: "brown",
                fillColor: colorPaste(feature.properties.mag),
                radius: markerSize(feature.properties.mag)
            });
        }
        function onEachLine(feature, layer) {
            L.polyline(feature.geometry.coordinates);
        };

        var quake = L.geoJSON(quakeData, {
            onFeature: onEachquake,
            onLayer: onEachLayer
        });

        var line = L.geoJSON(lineData, {
            onFeature: onEachLine,
            style: {
                weight: 2,
                color: "blue"
            }
        });
        createMap(quake, line);
    };
    
    function createMap(quake, line) {
        var streets = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" +
        "access_token=pk.eyJ1IjoiaGFuYmluZzYyMjgiLCJhIjoiY2sweWo3b3BsMGVvODNobXZjNzk1ZjRnaSJ9.XiYR2FB_kWK0MqTNnmv-ZQ");
        

        var light = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?" +
        "access_token=pk.eyJ1IjoiaGFuYmluZzYyMjgiLCJhIjoiY2sweWo3b3BsMGVvODNobXZjNzk1ZjRnaSJ9.XiYR2FB_kWK0MqTNnmv-ZQ");
        
        var dark = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?" + 
        "access_token=pk.eyJ1IjoiaGFuYmluZzYyMjgiLCJhIjoiY2sweWo3b3BsMGVvODNobXZjNzk1ZjRnaSJ9.XiYR2FB_kWK0MqTNnmv-ZQ");
        
          var baseMaps = {
              "Street": streets,
              "Light": light,
              "Dark": dark
          };

          var overMap = {
              "Earthquake": quake,
              "Line": line
          };

          var myMap = L.map("map", {
              center: [37.09, -95.71],
              zoom: 5,
              layers: [light, line]
          });

          L.control.layers(baseMaps, overMap, {
              collapsed: false
          }).addTo(myMap)

          var legend = L.control({position: 'topleft'});
          legend.onAdd = function(myMap) {
              var div = L.DomUtil.create('div', 'info legend'),
                        grades = [0, 1, 2, 3, 4, 5],
                        label = ["0-1","1-2", '2-3', '3-4','4-5', "5+"];
              for (var i = 0; i < grades.length; i++) {
                  div.innerHTML += '<i style="background:' + colorPaste(grades[i] + 1) + '"></i>' +
                  grades[i] + (grades[i+1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
              };
              return div;
          };
          legend.addTo(myMap)



        
    };

}


