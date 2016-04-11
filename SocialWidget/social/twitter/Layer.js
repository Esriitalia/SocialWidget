define([
    "dojo/_base/declare",
    "dojo/_base/array",
    "dojo/_base/lang",
    "dojo/on",
    "dojo/request/script",
    "dojo/date/locale",

    "./Element",

    "esri/geometry/Point",
    "esri/geometry/Polygon",
    "esri/geometry/Polyline",
    "esri/layers/FeatureLayer",
    "esri/tasks/query",
    "esri/geometry/geodesicUtils",
    "esri/units",


    "esri/symbols/SimpleMarkerSymbol",
    "esri/symbols/PictureMarkerSymbol",
    "esri/Color",
    "esri/InfoTemplate",
    "esri/graphic",

    'dojo/text!./InfoTemplate.html',


], function (
    declare,
    array,
    lang,
    on,
    requestScript,
    locale,
    
    Element,

    Point,
    Polygon,
    Polyline,
    FeatureLayer,
    Query,
    geodesicUtils,
    Units,


    SimpleMarkerSymbol,
    PictureMarkerSymbol,
    Color,
    InfoTemplate,
    Graphic,

    infoTemplateHtml

    ) {

        return declare(null, {

            name: "Twitter",
            layerName: "twitter",
            pointerImageName: "twitterPointer.png",

            constructor: function (widget) {

                //summary: 
                //          Called when a new instance it's created
                //
                //description:
                //          Sets the class variables.
                //          Sets an event listener for ExtentChange in the map.
                //          Initializes the layer in the map.
                //  
                //tags:
                //          public
                //
                //widget:
                //          The widget which creates this instance
                //
                //proxyUrl:
                //          A map with all the url to the proxy
                //
                //densityConfig:
                //          An object with all the default value on density for the layer
                //
                //graphicsPerExtent:
                //          The max number of graphics added to the layer after a search
                //
                //graphicsPerExtent:
                //          The max number of graphics added to the layer before the widget starts
                //          removing the oldest graphics from the layer
                //
                //graphicsIndexPerExtent:
                //         The number of graphics added to the layer during a search 
                //

                this.widget = widget;

                this.proxyUrl = widget.config.twitter.urls;

                this.densityConfig = widget.config.density;

                this.graphicsPerExtent = this.densityConfig.defaultGPE || 50;
                this.graphicsPerExtent = this.densityConfig.maxGPL || 200;

                this.graphicsIndexPerExtent = 0;

                var _onExtentChange = lang.hitch(this, "_onExtentChange");
                on(this.widget.map, "ExtentChange", _onExtentChange);

                this._initLayer();
            },

            _initLayer: function () {
                
                //summary: 
                //          Called from the constructor to create a new layer on the map
                //
                //description:
                //          Sets the picture for the graphic element.
                //          Defines the layer and which attribute in the graphic is the id,
                //          so that we can be interact with graphics later.
                //          Defines the infoTemplate to enable the popup after a graphic item is been clicked.
                //          Creates the layer and adds it to the map. 
                //          Add an event listener to parse the text only when needed.        
                //  
                //tags:
                //          private
                //
                
                var pictureMarkerSymbol = new PictureMarkerSymbol(
//                    '/webappviewer/widgets/MyWidgets/SocialWidget/images/' + this.pointerImageName,
                    this.widget.folderUrl + "images/" + this.pointerImageName,
                    30,
                    30
                    );
                    
                    
                var drawingInfo = {
                    "renderer": {
                        "type": "simple",
                        "symbol": pictureMarkerSymbol
                    }
                };

                var layerDefinition = {
                    "geometryType": "esriGeometryPoint",
                    "objectIdField": "id",
                    "drawingInfo": drawingInfo,
                    "name": this.name,
                    "fields": [
                        { "name": "id", "alias": "id", "type": "esriFieldTypeOID" }
                    ]
                };

                var infoTemplate = new InfoTemplate();
                infoTemplate.setTitle(this.name);
                infoTemplate.setContent(infoTemplateHtml);

                var featureCollection = {
                    layerDefinition: layerDefinition,
                    featureSet: {
                        "features": [],
                        "geometryType": "esriGeometryPoint"
                    }
                };

                var layerOptions = {
                    mode: FeatureLayer.MODE_AUTO,
                    id: this.layerName,
                    name: this.name,
                    infoTemplate: infoTemplate,
                    outFields: ["*"]
                };

                this.layer = new FeatureLayer(featureCollection, layerOptions);
                
                on(this.layer, "query-features-complete", lang.hitch(this, "_onLayerSelection"));
                
                this.widget.map.addLayer(this.layer);


            },

            _onLayerSelection: function (evt) {
                
                //summary: 
                //          Called when a graphic is selected
                //
                //description:
                //          If the user clicks on a graphics, his text is wraped in html before
                //          it's used in the infoTemplate        
                //  
                //tags:
                //          callback
                //
                   
                   
                var selectedFeatures = evt.featureSet.features;
                     
                if(selectedFeatures.length){
                                        
                    array.forEach(selectedFeatures, function(element) {
                        
                        var graphicAttributes = element.attributes;
                
                        if(graphicAttributes){                    
                            Element.formatElement(graphicAttributes);
                        } 
                        
                    }, this);
                }                  

            },

            _onExtentChange: function () {

                //summary: 
                //          Called when the extent in the map changes
                //
                //description:
                //          Checks if the user is logged.
                //          Resets the graphicsIndexPerExtent.
                //          Prevents a search with a previous extent to start.
                //          Set a timeout so the search start half a second later, 
                //          so if the extent changes again before the widget doesn't make a pointless search.
                //  
                //tags:
                //          callback
                //
                
                if (!this.widget.oauth.logged) { return; }

                this._resetIndex();

                var search = lang.hitch(this, "search");

                var extent = this.widget.map.geographicExtent;

                this._stopSearch();

                this.searchTimeout = setTimeout(search(extent), 500);

            },

            _stopSearch: function () {
                
                //summary: 
                //          Stops the timeout
                //  
                //tags:
                //          private
                //
                
                if (this.searchTimeout) {
                    clearTimeout(this.searchTimeout);
                }
            },

            _isExtentFull: function () {
               
                //summary: 
                //          Checks if the number of graphics is bigger 
                //          than the maximum value for a single search
                //  
                //tags:
                //          private
                //
                //returns:
                //          True, if the number of graphics is bigger, or
                //          false otherwise.
                //
                
                return this.graphicsIndexPerExtent >= this.graphicsPerExtent; // Boolean
            },

            _isLayerFull: function () {
                
                //summary: 
                //          Checks if the number of graphics is bigger 
                //          than the maximum value for the entire layer
                //  
                //tags:
                //          private
                //
                //returns:
                //          True, if thr number of graphics is bigger, or
                //          false otherwise.
                //
                
                return this.layer.graphics.length >= this.graphicsPerLayer;
            },

            _resetIndex: function () {

                //summary: 
                //          Resets the graphicsIndexPerExtent, usually before a new search starts
                //  
                //tags:
                //          private
                //

                this.graphicsIndexPerExtent = 0;
            },

            cleanLayer: function () {
                
                //summary: 
                //          Clean the layer
                //
                //description:
                //          Resets the graphicsIndexPerExtent.
                //          Hides all open popup on the map.
                //          Clean the layer.
                //  
                //tags:
                //          public
                //
                
                this._resetIndex();
                this.widget.map.infoWindow.hide();
                this.layer.clear();
            },

            _removeOldGraphics: function () {
                
                //summary: 
                //          Remove old graphics from the layer
                //
                //description:
                //          Graphics are saved by the FeatureLayer inside an array.
                //          ArrayEnd is the number of element it will be removed from it by this function.
                //          It is calculated from the number of excesive graphics in the layer plus 
                //          2 times the maximum number of graphics can be added by a single search.
                //          By removing more than it actually needed, this process won't be repeated
                //          constantly after the threshold is reached.         
                //  
                //tags:
                //          private
                //
                
                var graphics = this.layer.graphics;

                var arrayEnd = this.graphicsPerLayer -
                    graphics.length +
                    2 * this.graphicsPerExtent;


                if (arrayEnd <= 0) { arrayEnd = this.graphicsPerExtent; }

                var i;

                for (i = 0; i < arrayEnd; i++) {
                    this.layer.remove(graphics[i]);
                }

            },

            _addGraphicToLayer: function (/*Object*/ data) {

                //summary: 
                //          Add a graphic to the layer
                //
                //description:
                //          Checks first if the user is logged.
                //          Uses a query to see if the element we want to add to the layer
                //          is already inside it using is unique id, this will avoid duplication.
                //          After the layer interrogation, a new graphic item is defined,
                //          the element is formatted to be display in the info template
                //          and then set as attribute to the graphic.
                //          The graphic is added to the layer and the index is increase by 1. 
                //  
                //tags:
                //          private
                //

                if (!this.widget.oauth.logged) { return; }

                var query = new Query();

                query.objectIds = [data.id];

                this.layer.queryFeatures(query, lang.hitch(this, function (r) {

                    if (r && r.features.length > 0) {
                        return;
                    }

                    var point = new Point(data.longitude, data.latitude);

                    var graphic = new Graphic(point);

                    graphic.setAttributes(data);

                    this.layer.add(graphic);

                    this.graphicsIndexPerExtent++;


                }));

            },



            _getRadiusFromExtent: function (/*Extent*/ extent) {
                
                //summary: 
                //          Calculate the radius of a given extent
                //
                //description:
                //          Gets the points in the lower left and the upper right corner
                //          from the extent.
                //          Makes a polyline with those points and uses geodesicUtils to 
                //          calculates the distance between them. 
                //          GeodesicUtils are used so the curvature of the earth is considered
                //          when getting the distance.
                //  
                //tags:
                //          private
                //
                //returns:
                //          The radius of the extent in kilometers
                //
                
                var minPoint = new Point(extent.xmin, extent.ymin, this.widget.map.spatialReference);
                var maxPoint = new Point(extent.xmax, extent.ymax, this.widget.map.spatialReference);

                var polyline = new Polyline();

                polyline.addPath([maxPoint, minPoint]);

                var diam = geodesicUtils.geodesicLengths([polyline], Units.KILOMETERS);

                var rad = Math.ceil(diam[0] / 2);

                return rad; // Integer
            },




            _compareExtent: function (/*Extent*/ extent1, /*Extent*/ extent2) {

                //summary: 
                //          Compare two extent to see if they are identical
                //
                //description:
                //          Checks if the two extent are defined.
                //          Gets all the name of the properties inside the extent objects.
                //          If both objects have the same number of properties a loop
                //          iterate through them to see if they have the same value as well.
                //  
                //tags:
                //          private
                //
                //returns:
                //          True if the extent are identical,
                //          false otherwise
                //


                if (!extent1 || !extent2) { return false; }

                var property1 = Object.getOwnPropertyNames(extent1);
                var property2 = Object.getOwnPropertyNames(extent2);

                if (property1.length != property2.length) {
                    return false;
                }

                for (var i = 0; i < property1.length; i++) {
                    var propName = property1[i];

                    if (extent1[propName] !== extent2[propName]) {
                        return false; // Boolean
                    }
                }

                return true; // Boolean
            },
            
            //the number is not decide by extent size but from the map area on the dispay (in px)
            
            _setGraphicsPerExtent: function () {
                
                //summary: 
                //          Sets the graphicsPerExtent value based on the size of the user's display
                //
                //description:
                //          Gets the area in pixel from the map.
                //          Checks if the densityFactor value set by the user is valide. 
                //          For a smaller density put a smaller densityFactor value.        
                //          Calculates the density number, that is the maximum number of
                //          graphics per extent based by the sized of the screen.
                //          Sets the graphicsPerExtent value to the minimum between the density and 
                //          the its default value.
                //  
                //tags:
                //          private
                //
                
                // map area in px                
                var area = this.widget.map.width * this.widget.map.height;

                if (area <= 0) { this.graphicsPerExtent = this.densityConfig.defaultGPE; }

                var iconArea = 30;

                var densityFactor = this.widget.txtDensity.value;

                if (densityFactor < this.densityConfig.minDensity ||
                    densityFactor > this.densityConfig.maxDensity) {

                    densityFactor = this.densityConfig.defaultDensity;
                }


                densityFactor = this.densityConfig.maxDensity - densityFactor + 1;

                var density = area / Math.pow(iconArea * densityFactor, 2);

                density = Math.ceil(density);

                density = Math.min(density, this.densityConfig.maxGPE);

                this.graphicsPerExtent = density;

            },

            search: function (/*Extent*/ extent, /*String*/ recursiveQuery) {

                //summary: 
                //          Searches the social network to get informations
                //
                //description:
                //          Stops recursion if the extent was changed.
                //          Calculate the maximum number of graphics to add for this search,
                //          based on the screen sizes and it's done every time because they may change.
                //          Stops if this search can no longer add graphics because it surpasses its limit.
                //          Removes old graphics if the layer is to crowded from previous searches.
                //          Gets all the information need to query the server or uses the ones already
                //          defined in the input string recursiveQuery.
                //          Makes a jsonp request to the server.
                //          If the request returns some data they are parsed.
                //          If the server says there are more data to fetch a new search it's started
                //          recursively after half a second. 
                //  
                //tags:
                //          public
                //


                if (!this._compareExtent(extent, this.widget.map.geographicExtent)) {
                    return;
                }

                    
                //done every time because the sceen sizes may change
                this._setGraphicsPerExtent();                    
        
                //stops if the layer is full        
                if (this._isExtentFull()) { return; }
                
                // remove old tweets if the layer is too crowded                  
                if (this._isLayerFull()) { this._removeOldGraphics(); }

                var centerPoint = new Point(extent.getCenter());

                var searchParameters = {};
                var url = this.proxyUrl.search;

        
                // makes the request to the server     
                if (!recursiveQuery) {
                    
                    // get the keyword from the user input or from the configuration file
                    var query = "";

                    if(this.widget.config.fixedKeyword){

                        query = this.widget.config.keyword;

                    }else{

                        query = this.widget.txtQuery.value;	                    
                    }

                    query = lang.trim(query);
                    
                    this.layer.name = this.name;
                                
                    if(query){ this.layer.name = this.name + " - " + query;}  

                    var until = new Date();
                    
                    until.setDate(until.getDate() - this.widget.selUntil.value);

                    until = until.toISOString().substring(0, 10);

                    var radius = this._getRadiusFromExtent(extent);

                    searchParameters = {
                        q: query,
                        geocode: centerPoint.getLatitude() + "," +
                        centerPoint.getLongitude() + "," +
                        radius +
                        "km",
                        until: until
                    }                
                    
                } else {
                    url += recursiveQuery;
                }

                if (!this.widget.oauth.logged) { return; }
				
                requestScript.get(url, {
                    jsonp: "callback",
                    query: searchParameters
                }).then(lang.hitch(this, function (data) {
                       
                    //parses data from the server and call again the function in case there are more
                                     
                    try {
                                               
                        this._parse(data);                                            

                        recursiveQuery = data.search_metadata.next_results;

                        if (recursiveQuery) {

                            this._stopSearch();

                            var search = lang.hitch(this, "search");

                            this.searchTimeout = setTimeout(search(extent, recursiveQuery), 500);
                        }

                    } catch (error) {
                        //show error
                    }



                }), function (err) {
                    //console.log(err);
                });
            },

            _parse: function (/*Object*/ data) {
                
                //summary: 
                //          Parses the data from a search
                //
                //description:
                //          Parses the data and obtains an array from the Element class.
                //          Iterates through the array and adds the elements in the layer.
                //  
                //tags:
                //          private
                //                          
                
                
                var elementArray = Element.parse(data);
                
                array.forEach(elementArray, function (element) {

                    if (this._isExtentFull()) { return; }

                    try {                       

                        this._addGraphicToLayer(element);

                    } catch (error) {

                    }

                }, this);

            }

        });
    });


