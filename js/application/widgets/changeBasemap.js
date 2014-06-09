define([
  "esri/map",
  "esri/dijit/BasemapGallery",
  "esri/arcgis/utils",
  "dojo/parser", "dijit/_WidgetBase",
  "dijit/_TemplatedMixin",
  "dijit/_WidgetsInTemplateMixin", "dojo/_base/declare",

  "dijit/layout/BorderContainer", "dijit/layout/ContentPane", "dijit/TitlePane",
  "dojo/domReady!"
],
function (
  Map, BasemapGallery, arcgisUtils,
  parser, _WidgetBase,
  _TemplatedMixin,
  _WidgetsInTemplatedMixin,
  declare
  ) {
    var BasemapWidget = declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplatedMixin], {

        templateString: "<div><div id='geoz'></div></div>",
        map: null,
        startup: function () {

            //add the basemap gallery, in this case we'll display maps from ArcGIS.com including bing maps
            var basemapGallery = new BasemapGallery({
                showArcGISBasemaps: true,
                map: map
            }, "basemapGallery");
            basemapGallery.startup();

            basemapGallery.on("error", function (msg) {
                console.log("basemap gallery error:  ", msg);
            });
        }
    });

    return BasemapWidget;
});