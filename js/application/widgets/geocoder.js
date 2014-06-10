define([
    "dojo/_base/declare",
    "esri/dijit/Geocoder",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "esri/graphic",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/geometry/screenUtils",
    "dojo/dom",
    "dojo/dom-construct",
    "dojo/query",
    "dojo/_base/Color",
    "dojo/domReady!"
],
function (
    declare,
    Geocoder,
    _WidgetBase,
    _TemplatedMixin,
    _WidgetsInTemplatedMixin,
    Graphic,
    SimpleMarkerSymbol,
    screenUtils,
    dom,
    domConstruct,
    query,
    Color
    ) {

    var GeocoderWidget = declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplatedMixin], {
        templateString: "<div><div id='locate'></div></div>",
        map: null,
        startup: function () {
            console.log(this);
            if (this.map) {
                var map = this.map;
                var geocoder = new Geocoder({
                    arcgisGeocoder: {
                        placeholder: "find address"
                    },
                    autoComplete: true,
                    map: map,
                }, 'locate');
                geocoder.startup();
                map.on("load", this.enableSpotlight);

                geocoder.on("select", this.showLocation);
                geocoder.on("select", this.removeSpotlight);
            } else {
                console.error("This map does not exist.");
            }
        },

        enableSpotlight: function () {
            var html = "<div id='spotlight' class='spotlight'></div"
            domConstruct.place(html, dom.byId("map_container"), "first");
        },

        showLocation: function (evt) {
            map.graphics.clear();
            var point = evt.result.feature.geometry;
            var symbol = new SimpleMarkerSymbol().setStyle(
                SimpleMarkerSymbol.STYLE_SQUARE).setColor(
                new Color([255, 0, 0, 0.5])
                );
            var graphic = new Graphic(point, symbol);
            map.graphics.add(graphic);

            map.infoWindow.setTitle("Search Result");
            map.infoWindow.setContent(evt.result.name);
            map.infoWindow.show(evt.result.feature.geometry);

            var spotlight = map.on("extent-change", function (extentChange) {
                var geom = screenUtils.toScreenGeometry(map.extent, map.width, map.height, extentChange.extent);
                var width = geom.xmax - geom.xmin;
                var height = geom.ymin - geom.ymax;

                var max = height;
                if (width > height) {
                    max = width;
                }
                var margin = '-' + Math.floor(max / 2) + 'px 0 0 -' + Math.floor(max / 2) + 'px';

                query(".spotlight").addClass("spotlight-active").style({
                    width: max + "px",
                    height: max + "px",
                    margin: margin
                });
                spotlight.remove();
            });
        },

        

        removeSpotlight: function () {
            query(".spotlight").removeClass("spotlight-active");
            map.infoWindow.hide();
            map.graphics.clear();
        }
    });

    return GeocoderWidget;

});