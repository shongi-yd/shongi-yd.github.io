// For geoJson layers
var geojsonPredicted;
var geojsonConfirmed;
var geojsonRecovered;
var geojsonDeceased;

// Start and end date parameters
var startDate = new Date("03/23/2020"); 
var endDate= new Date("05/07/2020"); 

// Total number of days for the slider
var noOfDays = 75;

var todaysDate = new Date();
var daysTillToday = (todaysDate.getTime()-startDate.getTime())/(1000 * 3600 * 24);


// Set labels for slider
var startDateLabel = document.getElementById("start-date");
var endDateLabel = document.getElementById("end-date");
startDateLabel.innerHTML = calculatedDate(0).replace(/_/g, ' ');
endDateLabel.innerHTML = calculatedDate(noOfDays).replace(/_/g, ' ');

// Slider accessed by Id and values set
var slider = document.getElementById("myRange");
slider.value = daysTillToday;
slider.min = 0;
slider.max = noOfDays;



// Function to decide colors based on data
function getColor(value) {
    var state;
    var max = 0;
    for (state of statesData["features"]){
        if (Number(state["properties"][(slider.value).toString()]) > max){
            max = Number(state["properties"][(slider.value).toString()]);
        }
    }

    max = Math.ceil(max/100)*100;

    return value > max ? '#990000' :
           value > max/2  ? '#d7301f' :
           value > max/5  ? '#ef6548' :
           value > max/10  ? '#fc8d59' :
           value > max/20   ? '#fdd49e' :
           value > max/50   ? '#ffffe5' :
           value > max/100   ? '#d9f0a3' :
           value >= 0   ? '#78c679' :
                      '#fdfdfd';
}

function getColorConfirmed(value) {
    var state;
    var max = 0;
    for (state of statesData["features"]){
        if (Number(state["properties"]['Confirmed_' + calculatedDate(slider.value)]) > max){
            max = Number(state["properties"]['Confirmed_' + calculatedDate(slider.value)]);
        }
    }

    max = Math.ceil(max/100)*100;

    return value > max ? '#990000' :
           value > max/2  ? '#d7301f' :
           value > max/5  ? '#ef6548' :
           value > max/10  ? '#fc8d59' :
           value > max/20   ? '#fdd49e' :
           value > max/50   ? '#ffffe5' :
           value > max/100   ? '#d9f0a3' :
           value >= 0   ? '#78c679' :
                      '#fdfdfd';
}

function getColorRecovered(value) {
    var state;
    var max = 0;
    for (state of statesData["features"]){
        if (Number(state["properties"]['Recovered_' + calculatedDate(slider.value)]) > max){
            max = Number(state["properties"]['Recovered_' + calculatedDate(slider.value)]);
        }
    }

    max = Math.ceil(max/100)*100;

    return value > max ? '#990000' :
           value > max/2  ? '#d7301f' :
           value > max/5  ? '#ef6548' :
           value > max/10  ? '#fc8d59' :
           value > max/20   ? '#fdd49e' :
           value > max/50   ? '#ffffe5' :
           value > max/100   ? '#d9f0a3' :
           value >= 0   ? '#78c679' :
                      '#fdfdfd';
}

function getColorDeceased(value) {
    var state;
    var max = 0;
    for (state of statesData["features"]){
        if (Number(state["properties"]['Deceased_' + calculatedDate(slider.value)]) > max){
            max = Number(state["properties"]['Deceased_' + calculatedDate(slider.value)]);
        }
    }

    max = Math.ceil(max/100)*100;

    return value > max ? '#990000' :
           value > max/2  ? '#d7301f' :
           value > max/5  ? '#ef6548' :
           value > max/10  ? '#fc8d59' :
           value > max/20   ? '#fdd49e' :
           value > max/50   ? '#ffffe5' :
           value > max/100   ? '#d9f0a3' :
           value >= 0   ? '#78c679' :
                      '#fdfdfd';
}

// Function to set style for geoJson layer
function style(feature) {
    return {
        fillColor: getColor(feature.properties[(slider.value).toString()]),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '',
        fillOpacity: 0.7
    };
}

function styleConfirmed(feature) {
    return {
        fillColor: getColorConfirmed(feature.properties['Confirmed_' + calculatedDate(slider.value)]),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '',
        fillOpacity: 0.7
    };
}

function styleRecovered(feature) {
    return {
        fillColor: getColorRecovered(feature.properties['Recovered_' + calculatedDate(slider.value)]),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '',
        fillOpacity: 0.7
    };
}

function styleDeceased(feature) {
    return {
        fillColor: getColorDeceased(feature.properties['Deceased_' + calculatedDate(slider.value)]),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '',
        fillOpacity: 0.7
    };
}


function legendGrades(){
    var state;
    var max = 0;
    for (state of statesData["features"]){
        if (Number(state["properties"][(slider.value).toString()]) > max){
            max = Number(state["properties"][(slider.value).toString()]);
        }
    }

    max = Math.ceil(max/100)*100;

    return [0, max/100, max/50, max/20, max/10, max/5, max/2, max];
}

// Event listener function to highlight a feature when mouse hovers on it
function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 4,
        color: '#552631',
        dashArray: '',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
    info.update(layer.feature.properties);
}

// Event listener function to reset highlight when mouse moves out of a feature
function resetHighlight(e) {
    geojsonPredicted.resetStyle(e.target);
    info.update();
}

function resetHighlightConfirmed(e) {
    geojsonConfirmed.resetStyle(e.target);
    info.update();
}

function resetHighlightRecovered(e) {
    geojsonRecovered.resetStyle(e.target);
    info.update();
}

function resetHighlightDeceased(e) {
    geojsonDeceased.resetStyle(e.target);
    info.update();
}

// Event listener function to zoom to a feature when clicked on it
function zoomToFeature(e) {
    mymap.fitBounds(e.target.getBounds());
}

// Function to add the event listeners to each of the
// features using onEachFeature of geoJson layer
function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}

function onEachFeatureConfirmed(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlightConfirmed,
        click: zoomToFeature
    });
}

function onEachFeatureRecovered(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlightRecovered,
        click: zoomToFeature
    });
}

function onEachFeatureDeceased(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlightDeceased,
        click: zoomToFeature
    });
}

// Set location and zoom 
var mymap = L.map('mapid',{zoomControl: false}).setView([22.146, 79.088], 5);


// Google Streets Tile Layer
var googleStreets = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        minZoom: 2,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
        attribution: 'Map Data &copy; <a href="https://www.google.com/maps/">2020 Google Maps</a>'
    }).addTo(mymap);


// GeoJson Layer
geojsonPredicted = L.geoJson(statesData, {
    style: style,
    onEachFeature: onEachFeature
}).addTo(mymap);

geojsonConfirmed = L.geoJson(statesData, {
    style: styleConfirmed,
    onEachFeature: onEachFeatureConfirmed
});

geojsonRecovered = L.geoJson(statesData, {
    style: styleRecovered,
    onEachFeature: onEachFeatureRecovered
});

geojsonDeceased = L.geoJson(statesData, {
    style: styleDeceased,
    onEachFeature: onEachFeatureDeceased
});


// Title info control
var title = L.control();

title.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'title'); // Create a div with a class "info"
    this.update();
    return this._div;
};

title.update = function () {
    this._div.innerHTML = '<h4>COVID-19 cases in India</h4>' 
                            + "Total predicted cases: " + totalData[0][slider.value.toString()]
                            + "<br> Total confirmed cases: " 
                            + totalData[0]["Confirmed_" + calculatedDate(slider.value)]
                            + "<br> Total recovered cases: " 
                            + totalData[0]["Recovered_" + calculatedDate(slider.value)]
                            + "<br> Total deceased cases: " 
                            + totalData[0]["Deceased_" + calculatedDate(slider.value)];
};

title.setPosition('topleft');

title.addTo(mymap);

// Info control
var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // Create a div with a class "info"
    this.update();
    return this._div;
};

// Method that we will use to update the control based on feature properties passed
info.update = function (props) {
    this._div.innerHTML = '<h4>'+ calculatedDate(slider.value).replace(/_/g, ' ') + '</h4>' +  (props ?
        '<b>' + props.name +'</b>'
        +'<br />' + 'Predicted Cases: ' + props[slider.value.toString()]
        +'<br />' + 'Confirmed Cases: ' + props["Confirmed_" + calculatedDate(slider.value)]
        +'<br />' + 'Recovered Cases: ' + props["Recovered_" + calculatedDate(slider.value)] 
        +'<br />' + 'Deceased Cases: ' + props["Deceased_" + calculatedDate(slider.value)] 
        : 'Hover over a state');
};

// Add to info control to the map
info.addTo(mymap);



// Legend Control
var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    this._div = L.DomUtil.create('div', 'info legend');
    this.update();
    return this._div;
};

legend.update = function (){
    var grades = legendGrades(),
        labels = [];

    this._div.innerHTML = "";
    for (var i = 0; i < grades.length; i++) {
        this._div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }
}


// Add legend to map
legend.addTo(mymap);



var baseMaps = {
    "Predicted": geojsonPredicted,
    "Confirmed": geojsonConfirmed,
    "Recovered": geojsonRecovered,
    "Deceased" : geojsonDeceased
};

L.control.layers(baseMaps).addTo(mymap);

// Function to return shortened month name
// Output of the JavaScript date function 'getMonth()' is passed as argument
function getMonthName(month){
    return month == 0  ? 'Jan' :
           month == 1  ? 'Feb' :
           month == 2  ? 'Mar' :
           month == 3  ? 'Apr' :
           month == 4  ? 'May' :
           month == 5  ? 'Jun' :
           month == 6  ? 'Jul' :
           month == 7  ? 'Aug' :
           month == 8  ? 'Sep' :
           month == 9  ? 'Oct' :
           month == 10 ? 'Nov' :
           month == 11 ? 'Dec' :
                      'Error: Invalid Argument';
}

// Function to pad a zero on the left for single digit dates
// Output of the JavaScript date function 'getDate()' is passed as argument
function getPaddedDate(date){
    if (date >= 10){
        return date.toString();
    }
    else{
        return "0" + date.toString();
    }
}

// Function to calculate date from the slider value
function calculatedDate(value){
    var reqDate = new Date(startDate.getTime() + value * (1000 * 3600 * 24));

    return (getPaddedDate(reqDate.getDate()) + "_"
            + getMonthName(reqDate.getMonth()) + "_"
            + reqDate.getFullYear().toString().substring(2)).toString();

}


// Update info control and geoJson layer(on dragging slider)
slider.oninput = function() {
  info.update();
  title.update();
  geojsonPredicted.resetStyle();
  geojsonConfirmed.resetStyle();
  geojsonRecovered.resetStyle(); 
  geojsonDeceased.resetStyle();
  legend.update();
}

// Custom zoom control bar with a Zoom to Home button
L.Control.zoomHome = L.Control.extend({
    options: {
        position: 'topleft',
        zoomInText: '<big>+</big>',
        zoomInTitle: 'Zoom In',
        zoomOutText: '<big>-</big>',
        zoomOutTitle: 'Zoom Out',
        zoomHomeText: '<i class="fa fa-home"></i>',
        zoomHomeTitle: 'Zoom Home'
    },

    onAdd: function (map) {
        var controlName = 'gin-control-zoom',
            container = L.DomUtil.create('div', controlName + ' leaflet-bar'),
            options = this.options;

        this._zoomInButton = this._createButton(options.zoomInText, options.zoomInTitle,
        controlName + '-in', container, this._zoomIn);
        this._zoomHomeButton = this._createButton(options.zoomHomeText, options.zoomHomeTitle,
        controlName + '-home', container, this._zoomHome);
        this._zoomOutButton = this._createButton(options.zoomOutText, options.zoomOutTitle,
        controlName + '-out', container, this._zoomOut);

        this._updateDisabled();
        map.on('zoomend zoomlevelschange', this._updateDisabled, this);

        return container;
    },

    onRemove: function (map) {
        map.off('zoomend zoomlevelschange', this._updateDisabled, this);
    },

    _zoomIn: function (e) {
        this._map.zoomIn(e.shiftKey ? 3 : 1);
    },

    _zoomOut: function (e) {
        this._map.zoomOut(e.shiftKey ? 3 : 1);
    },

    _zoomHome: function (e) {
        this._map.setView([22.146, 79.088], 5);
    },

    _createButton: function (html, title, className, container, fn) {
        var link = L.DomUtil.create('a', className, container);
        link.innerHTML = html;
        link.href = '#';
        link.title = title;

        L.DomEvent.on(link, 'mousedown dblclick', L.DomEvent.stopPropagation)
            .on(link, 'click', L.DomEvent.stop)
            .on(link, 'click', fn, this)
            .on(link, 'click', this._refocusOnMap, this);

        return link;
    },

    _updateDisabled: function () {
        var map = this._map,
            className = 'leaflet-disabled';

        L.DomUtil.removeClass(this._zoomInButton, className);
        L.DomUtil.removeClass(this._zoomOutButton, className);

        if (map._zoom === map.getMinZoom()) {
            L.DomUtil.addClass(this._zoomOutButton, className);
        }
        if (map._zoom === map.getMaxZoom()) {
            L.DomUtil.addClass(this._zoomInButton, className);
        }
    }
});

// add zoom control bar to the map
var zoomBar = new L.Control.zoomHome();
zoomBar.addTo(mymap);