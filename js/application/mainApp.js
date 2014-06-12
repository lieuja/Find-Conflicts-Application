var map;
require([
    "esri/map",
    "dojo/parser",
    "dijit/layout/BorderContainer",
    "dijit/layout/ContentPane",
    "widgets/geocoder",
    "widgets/changeBasemap",
    "dojo/dom",
    "dojo/on",
    "dojo/dom-style",
    "dijit/Dialog",
    "dojo/store/Memory",
    "dijit/form/ComboBox",
    "dijit/form/DateTextBox",
    "dijit/form/Button",
    "esri/dijit/BasemapGallery",
    "esri/dijit/Geocoder",
    "dojo/fx",
    "dojo/fx/easing",
    "dgrid/Grid",
    "dijit/registry",

    "dijit/form/HorizontalSlider",
    "dijit/form/HorizontalRule",
    "dijit/form/HorizontalRuleLabels",
    "dijit/form/TextBox",
    "dojo/domReady!"
],
function (
    Map,
    parser,
    BorderContainer,
    ContentPane,
    GeocoderWidget,
    BasemapWidget,
    dom,
    on,
    domStyle,
    Dialog,
    Memory,
    ComboBox,
    DateTextBox,
    Button,
    BasemapGallery,
    Geocoder,
    coreFx,
    easing,
    Grid,
    registry
    ) {
    //parser.parse();
    //map content
    map = new Map("mapDiv", {
        center: [-80, 38.485],
        zoom: 6,
        basemap: "streets"
    });

    //geocoder tool
    var geocoder = new Geocoder({
        arcgisGeocoder: {
            placeholder: "find address"
        },
        autoComplete: true,
        map: map,
    }, 'search');
    geocoder.startup();

    //click legend tool
    on(dom.byId("legend"), "click", function (e) {
        var centerPane = registry.byId("centerPane");
        var bottomPane = registry.byId("bottomPane");

        if (domStyle.get(dom.byId("bottomPane"), "display") === "block") {
            //console.log("shown");

            coreFx.wipeOut({
                node: "bottomPane",
                duration: 800,
                easing: easing.expoOut
            }).play();
            domStyle.set(dom.byId("bottomPane"), "display", "none");
            centerPane.resize({ h: 900 });
            bottomPane.resize({ h: 0 });
        } else {
            //console.log("none");
            coreFx.wipeIn({
                node: "bottomPane",
                duration: 800,
                easing: easing.expoOut
            }).play();
            domStyle.set(dom.byId("bottomPane"), "display", "block");
            //registry.byId("bottomPane").resize({h: 400, w:400});
            centerPane.resize({ h: 600 });
            bottomPane.resize({ h: 0 });
        }
    });

    //data grid    
    var data = [
        { first: "Bob", last: "Barker", age: 89 },
        { first: "Vanna", last: "White", age: 55 },
        { first: "Pat", last: "Sajak", age: 65 }
    ];

    var grid = new Grid({
        columns: {
            first: "First Name",
            last: "Last Name",
            age: "Age"
        }
    }, "dgrid");
    console.log(grid);
    grid.renderArray(data);

    

    //change basemap tool
    on(dom.byId("changeBasemap"), "click", function (e) {
        if (domStyle.get(dom.byId("basemapGalleryContainer"), "display") === "block") {

            coreFx.wipeOut({
                node: "basemapGalleryContainer",
                duration: 800,
                easing: easing.expoOut
            }).play();
            domStyle.set(dom.byId("basemapGalleryContainer"), "display", "");
        } else {

            coreFx.wipeIn({
                node: "basemapGalleryContainer",
                duration: 800,
                easing: easing.expoOut
            }).play();
            domStyle.set(dom.byId("basemapGalleryContainer"), "display", "block");
        }
    });

    var basemapGallery = new BasemapGallery({
        showArcGISBasemaps: true,
        map: map
    }, "basemapGallery");

    //click 'find conflicts' tool
    on(dom.byId("findConflicts"), "click", function (e) {
        dijit.byId("conflictsDialog").show();
    });
    
    //drop down inputs: forOrg, forLayer, inOrd, inLayer
    var dropDownData = new Memory({
        data: [
            { name: "Alabama", id: "AL" },
            { name: "Alaska", id: "AK" },
            { name: "American Samoa", id: "AS" },
            { name: "Arizona", id: "AZ" },
            { name: "Arkansas", id: "AR" },
            { name: "Armed Forces Europe", id: "AE" },
            { name: "Armed Forces Pacific", id: "AP" },
            { name: "Armed Forces the Americas", id: "AA" },
            { name: "California", id: "CA" },
            { name: "Colorado", id: "CO" },
            { name: "Connecticut", id: "CT" },
            { name: "Delaware", id: "DE" }
        ]
    });

    var forOrgCB = new ComboBox({
        id: "forOrg",
        name: "state",
        value: "MC DOT",
        store: dropDownData,
        searchAttr: "name"
    }, "forOrg");

    var forLayerCB = new ComboBox({
        id: "forLayer",
        name: "state",
        value: "Layer",
        store: dropDownData,
        searchAttr: "name"
    }, "forLayer");

    var inOrgCB = new ComboBox({
        id: "inOrg",
        name: "state",
        value: "PGC Dot",
        store: dropDownData,
        searchAttr: "name"
    }, "inOrg");

    var inLayerCB = new ComboBox({
        id: "inLayer",
        name: "state",
        value: "Layer",
        store: dropDownData,
        searchAttr: "name"
    }, "inLayer");

    var cancelBtn = new Button({
        label: "Close",
        onClick: function () {
            console.log('clicked');
            dijit.byId("conflictsDialog").hide();
        }
    }, "cancel");   

});