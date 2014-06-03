require([
    "esri/dijit/Geocoder"
],
function (
    Geocoder
    ) {
    var geocoder = new Geocoder({
        map: mapDiv,
        autoComplete: true,
        arcgisGeocoder: {
            url: "http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer",
            name: "Esri World Geocoder",
            placeholder: "Find Address",
            sourceCountry: "USA" // limit search to the United States
        }
    },"geocoder");
    geocoder.startup();
});