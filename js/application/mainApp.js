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
    "dojo/_base/declare",
    "dgrid/Keyboard",
    "dgrid/Selection",
    "esri/tasks/Geoprocessor",
    "esri/dijit/HomeButton",
    "esri/layers/ArcGISDynamicMapServiceLayer",
    "dijit/form/FilteringSelect",
    "dijit/form/Select",
    "dojo/_base/window",
    "dijit/form/TextBox",

    "dijit/form/HorizontalSlider",
    "esri/layers/FeatureLayer",
    "esri/graphic", 
    "esri/tasks/FeatureSet",
    "dojo/_base/array",
    "esri/config",
    "esri/dijit/Legend",
    "esri/IdentityManager",
    "esri/ServerInfo",

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
    registry,
    declare,
    Keyboard,
    Selection,
    Geoprocessor,
    HomeButton,
    ArcGISDynamicMapServiceLayer,
    FilteringSelect,
    Select,
    win,
    TextBox,
    HorizontalSlider,
    FeatureLayer,
    Graphic,
    FeatureSet,
    array,
    esriConfig,
    Legend,
    IdentityManager,
    ServerInfo
    ) {
    //parser.parse();
    
    esriConfig.defaults.io.proxyUrl = "/proxyDotNet/proxy.ashx";
    esriConfig.defaults.io.alwaysUseProxy = true;
    //esriConfig.defaults.io.corsEnabledServers.push("http://170.93.140.79/");
    //esriConfig.defaults.io.corsEnabledServers.push("http://gisweb.wsscwater.com/");
    //esriConfig.defaults.io.corsEnabledServers.push("http://gis.montgomerycountymd.gov/");

    var serverInfo = new esri.ServerInfo();
    serverInfo.server = 'http://gisweb.wsscwater.com/ArcGIS/';
    serverInfo.tokenServiceUrl = 'http://gisweb.wsscwater.com/ArcGIS/tokens/';

    esri.id.registerServers([serverInfo]);

    var conflictResults = function (r, m) {
        console.log(r);
        console.log(m);

    };

    //onClick 'Find Conflicts' Btn - fires off feature layers and GP service
    var myButton = new Button({
        label: "Find Conflicts",
        onClick: function () {
            //clear all layers from the map
            //map.removeAllLayers();
            //inLayerFeatureLayer.removeAllLayers();
            //check dijit layers for its values
            
            var forLayerValue = registry.byId("forLayer").get("value");
            console.log(registry.byId("forLayer").get("value"));

            var inLayerValue = registry.byId("inLayer").get("value");
            console.log(registry.byId("inLayer").get("value"));

            var distanceValue = registry.byId("distanceSlider").get("value");
            console.log(registry.byId("distanceSlider").get("value"));
            //get all the values of the layers
            //create a feature layer for each of the layers, FOR and IN
            gp = new Geoprocessor("http://bmajor2.esri.com/arcgis/rest/services/wssc_jdp/WSSCFindConflictsTest/GPServer/WSSC%20Find%20Conflicts%20Test");

            //create new feature layers
            //FOR feature layer
            var forLayerFeatureLayer = new
                FeatureLayer(forLayerValue, {
                    id: 'Organization'
                });

            var forLayerArray = [];
            if (forLayerFeatureLayer.graphics) {
                array.forEach(forLayerFeatureLayer.graphics, function (graphic) {
                    console.log(graphic);
                });
            };

            var fs1 = new FeatureSet();
            fs1.features = forLayerFeatureLayer.graphics;

           map.addLayer(forLayerFeatureLayer);
            //IN feature layer
            var inLayerFeatureLayer = new
                FeatureLayer(inLayerValue, {
                    id: 'Layer'
                });

            var inLayerArray = [];
            if (inLayerFeatureLayer.graphics) {
                array.forEach(inLayerFeatureLayer.graphics, function (graphic) {
                    console.log(graphic);
                });
            };

            var fs2 = new FeatureSet();
            fs2.features = inLayerFeatureLayer.graphics;
            map.addLayer(inLayerFeatureLayer);
            registry.byId("conflictsDialog").hide();

            var params = {
                fs1: fs1,
                fs2: fs2,
                csd: distanceValue
            };

            gp.submitJob(params, conflictResults);

            
        }
    }, "findConflictsBtn");
     
    //map content
    map = new Map("mapDiv", {
        center: [-77.0367, 38.8951],
        zoom: 10,
        basemap: "streets"
    });

    //legend
    var legend = new Legend({
       map: map
    }, "legendDiv");
    legend.startup();

    //map home button
    var home = new HomeButton({
        map: map
    }, "HomeButton");
    home.startup();

    //geocoder tool
    var geocoder = new Geocoder({
        arcgisGeocoder: {
            placeholder: "Find Address"
        },
        autoComplete: true,
        map: map,
    }, 'search');
    geocoder.startup();    

    //click legend tool
    on(dom.byId("legend"), "click", function (e) {
        
        //if leftPane is displayed, hide leftPane and adjust others on legend onClick 
        if (domStyle.get(dom.byId("leftPane"), "display") === "block") {
            domStyle.set(dom.byId("leftPane"), "display", "none");            
            domStyle.set(dom.byId("centerPane"), "width", "100%");
            domStyle.set(dom.byId("centerPane"), "left", "0");
            domStyle.set(dom.byId("resultsGridTab"), "left", "2%");
        }
            //else show leftPane and adjust others
        else {
            domStyle.set(dom.byId("leftPane"), "display", "block");            
            domStyle.set(dom.byId("centerPane"), "width", "84%");
            domStyle.set(dom.byId("centerPane"), "left", "16.3%");
            domStyle.set(dom.byId("resultsGridTab"), "left", "17%");
        }
    });
    
    //click results tab
    on(dom.byId("resultsGridTab"), "click", function (e) {
        //if bottomPane is displayed, hide bottomPane and adjust others on resultsGridTab onClick 
        if (domStyle.get(dom.byId("bottomPane"), "display") === "block") {
            domStyle.set(dom.byId("bottomPane"), "display", "none");
            domStyle.set(dom.byId("resultsGridTab"), "top", "96.5%");
            domStyle.set(dom.byId("centerPane"), "height", "91.3%");
            domStyle.set(dom.byId("leftPane"), "height", "89.5%");
        }
            //else show bottomPane and adjust others
        else {
            domStyle.set(dom.byId("bottomPane"), "display", "block");
            domStyle.set(dom.byId("resultsGridTab"), "top", "75.4%");
            domStyle.set(dom.byId("centerPane"), "height", "70%");
            domStyle.set(dom.byId("leftPane"), "height", "68.2%");
        }
    });

    //data grid
    //DUMMY DATA just for viewing purposes
    var data = [
        { department: "MC DOT", projectId: "AAABBB", conflictDpt: "WSSC", conflictProject:"Main St Dig", contact:"John Doe (222) 222-2222" },
        { department: "MC DOT", projectId: "AAABBB", conflictDpt: "PG DPW", conflictProject:"12-13-14", contact:"John Doe (222) 222-2222" },
        { department: "MC DOT", projectId: "CCCDDD", conflictDpt: "WSSC", conflictProject:"Main St Dig", contact:"John Doe (222) 222-2222" },        
        { department: "MC DOT", projectId: "CCCDDD", conflictDpt: "WSSC", conflictProject: "Main St Dig", contact: "John Doe (222) 222-2222" },
        { department: "MC DOT", projectId: "CCCDDD", conflictDpt: "WSSC", conflictProject: "Main St Dig", contact: "John Doe (222) 222-2222" },
        { department: "MC DOT", projectId: "CCCDDD", conflictDpt: "WSSC", conflictProject: "Main St Dig", contact: "John Doe (222) 222-2222" },
        { department: "MC DOT", projectId: "CCCDDD", conflictDpt: "WSSC", conflictProject: "Main St Dig", contact: "John Doe (222) 222-2222" },
        { department: "MC DOT", projectId: "CCCDDD", conflictDpt: "WSSC", conflictProject: "Main St Dig", contact: "John Doe (222) 222-2222" },
    ];

    var CustomGrid = declare([Grid, Keyboard, Selection]);

    var grid = new CustomGrid({
        columns: {
            department: "Department",
            projectId: "Project ID",
            conflictDpt: "Conflict Dpt.",
            conflictProject: "Conflicting Project",
            contact: "Contact"
        },
        selectionMode: "single",
        cellNavigation: false
    }, "dgrid");
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
    var layersConfig = {
        "": [],
        "WSSC": [
            { label: "Sewer Manhole Replacements", value: "http://gisweb.wsscwater.com/ArcGIS/rest/services/AgencyProjetCoordination/WSSCAPCLayers/MapServer/0" },
            { label: "Sewer Pipe  Replacements", value: "http://gisweb.wsscwater.com/ArcGIS/rest/services/AgencyProjetCoordination/WSSCAPCLayers/MapServer/1" },
            { label: "Water Meter Vault Replacements", value: "http://gisweb.wsscwater.com/ArcGIS/rest/services/AgencyProjetCoordination/WSSCAPCLayers/MapServer/2" },
            { label: "Water Main Projects", value: "http://gisweb.wsscwater.com/ArcGIS/rest/services/AgencyProjetCoordination/WSSCAPCLayers/MapServer/3" },
            { label: "County Boundaries", value: "http://gisweb.wsscwater.com/ArcGIS/rest/services/AgencyProjetCoordination/WSSCAPCLayers/MapServer/4" }
        ],
        "SHA": [
            { label: "APC DATA", value: "http://170.93.140.79/ArcGIS/rest/services/WSSC/SHA_APC_Data/MapServer/0" }
        ],
        "MC DOT": [
            { label: "Planned", value: "http://gis.montgomerycountymd.gov/ArcGIS/rest/services/DOT/moco_planned/MapServer/0" },
            { label: "In-Progress", value: "http://gis.montgomerycountymd.gov/ArcGIS/rest/services/DOT/moco_in_progress/MapServer/0" },
            { label: "Moratorium", value: "http://gis.montgomerycountymd.gov/ArcGIS/rest/services/DOT/moco_moratorium/MapServer/0" }
        ],
        "Municipalities Paving": [
            { label: "Municipalities Paving Projects", value: "http://gisweb.wsscwater.com/ArcGIS/rest/services/AgencyProjetCoordination/Municipatilies_Paving/MapServer/0" }
        ]
    };

    //"FOR" div
    var forOptions = [];
    for (var forOrganization in layersConfig) {
        forOptions.push({
            label: forOrganization,
            value: forOrganization
        });
    }; console.log(forOptions);

    var forOrgSelect = new Select({
        options: forOptions
    }, "forOrg");
    forOrgSelect.startup();

    var forLayerSelect = new Select({
       // disabled: "disabled"
    },"forLayer");

    on(forOrgSelect, "change", function (value) {
        //populate value based on selection
        console.log(value);
        var forLayerOptions = layersConfig[value];
        if (forLayerOptions) {
            forLayerSelect.set("options", forLayerOptions);
            forLayerSelect.set("value", forLayerOptions[0].label);
            console.log(forLayerOptions);
        };
    });

    //"IN" div
    var inOptions = [];
    for (var inOrganization in layersConfig) {
        inOptions.push({
            label: inOrganization,
            value: inOrganization
        });
    }; console.log(inOptions);

    var inOrgSelect = new Select({
        options: inOptions
    }, "inOrg");
    inOrgSelect.startup();

    var inLayerSelect = new Select({
        // disabled: "disabled"
    }, "inLayer");

    on(inOrgSelect, "change", function (value) {
        //populate value based on selection
        console.log(value);
        var inLayerOptions = layersConfig[value];
        if (inLayerOptions) {
            inLayerSelect.set("options", inLayerOptions);
            inLayerSelect.set("value", inLayerOptions[0].label);
            console.log(inLayerOptions);
        };
    });

    //Hides Find Conflicts Dialog
    var cancelBtn = new Button({
        label: "Close",
        onClick: function () {
            console.log('clicked');
            dijit.byId("conflictsDialog").hide();
        }
    }, "cancel");   

});