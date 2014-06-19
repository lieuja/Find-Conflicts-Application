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
    registry,
    declare,
    Keyboard,
    Selection,
    Geoprocessor,
    HomeButton
    ) {
    //parser.parse();

    gp = new Geoprocessor("http://bmajor2.esri.com/arcgis/rest/directories/arcgisoutput/wssc_jdp/WSSCFindConflicts_GPServer/wssc_jdp_WSSCFindConflicts/WSSCFindConflicts");

    //map content
    map = new Map("mapDiv", {
        center: [-80, 38.485],
        zoom: 6,
        basemap: "streets"
    });
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