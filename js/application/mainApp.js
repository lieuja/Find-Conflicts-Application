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
    BasemapGallery
    ) {
    //parser.parse();
    map = new Map("mapDiv", {
        center: [-80, 38.485],
        zoom: 6,
        basemap: "streets"
    });

    //var legend = new LegendWidget({ map: map }, "legend");
    //legend.startup();

    on(dom.byId("legend"), "click", function (e) {
        //var saveMyTabWidget = dom.byId('legendContainer');
        //dom.byId('legendContainer').removeChild(dom.byId('legendContainer'));

        //if (typeof saveMyTabWidget != "undefined") {
        //    saveMyTabWidget.setHref(theURL);
        //    dom.byId('legendContainer').addChild(saveMyTabWidget, 0);
        //    saleProductsTabWidget = undefined;
        //}
        dojo.toggleClass("legendContainer", "style1");
        dojo.toggleClass("centerPane", "style2");
        //var display = domStyle.get(dom.byId("legendContainer"), "display");
        //if (display == "none") {
        //    domStyle.set(dom.byId("legendContainer"), "display", '');
        //} else {
        //    domStyle.set(dom.byId("legendContainer"), "display", 'none');
        //}
        map.resize();
    });


    var forOrganization = new Memory({
        data: [
            {name:"Alabama", id:"AL"},
            {name:"Alaska", id:"AK"},
            {name:"American Samoa", id:"AS"},
            {name:"Arizona", id:"AZ"},
            {name:"Arkansas", id:"AR"},
            {name:"Armed Forces Europe", id:"AE"},
            {name:"Armed Forces Pacific", id:"AP"},
            {name:"Armed Forces the Americas", id:"AA"},
            {name:"California", id:"CA"},
            {name:"Colorado", id:"CO"},
            {name:"Connecticut", id:"CT"},
            {name:"Delaware", id:"DE"}
        ]
    });

    var comboBox = new ComboBox({
        id: "forOrg",
        name: "state",
        value: "California",
        store: forOrganization,
        searchAttr: "name"
    }, "forOrg");

    var comboBox = new ComboBox({
        id: "forLayer",
        name: "state",
        value: "California",
        store: forOrganization,
        searchAttr: "name"
    }, "forLayer");

    var comboBox = new ComboBox({
        id: "inOrg",
        name: "state",
        value: "California",
        store: forOrganization,
        searchAttr: "name"
    }, "inOrg");

    var comboBox = new ComboBox({
        id: "inLayer",
        name: "state",
        value: "California",
        store: forOrganization,
        searchAttr: "name"
    }, "inLayer");

    var cancelBtn = new Button({
        label: "Close",
        onClick: function () {
            console.log('clicked');
            dijit.byId("conflictsDialog").hide();
        }
    }, "cancel");

    on(dom.byId("findConflicts"), "click", function (e) {
        dijit.byId("conflictsDialog").show();
    });

    
    console.log(GeocoderWidget);
    //var geocoder = new GeocoderWidget({ map: map }, "search");
    //geocoder.startup();

    //var BasemapWidget = new BasemapWidget ({ map: map }, "changeBasemap");
    //BasemapWidget.startup();

    var basemapGallery = new BasemapGallery({
        showArcGISBasemaps: true,
        map: map
    }, "changeBasemap");

});