var map;
require([
    "esri/map",
    "dojo/parser",
    "dijit/layout/BorderContainer",
    "dijit/layout/ContentPane",
    "dojo/domReady!"
],
function (
    Map,
    parser,
    BorderContainer,
    ContentPane
    ) {
    map = new Map("mapDiv", {
        center: [-56.049, 38.485],
        zoom: 3,
        basemap: "streets"
    });
});