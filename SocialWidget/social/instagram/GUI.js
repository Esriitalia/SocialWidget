define([
    "dojo/_base/declare",
    "dojo/_base/array",
    "dojo/_base/lang",
    "dojo/on",
    "dojo/keys",
	"dojo/dom",
    "dojo/dom-class",
    "dojo/dom-construct",
    "dojo/dom-attr",
    "dijit/focus",
    "dojo/request/script",
    "dojo/html",


    "dijit/form/Form",
    "dijit/form/TextBox",
    "dijit/form/NumberTextBox",
    "dijit/form/NumberSpinner",
    "dijit/form/Select",
    "dijit/form/FilteringSelect",
    "dijit/form/Button",
    "dijit/form/DateTextBox",


    "esri/symbols/SimpleMarkerSymbol",
    "esri/Color",
    "esri/InfoTemplate",
    "esri/graphic",



], function (
    declare,
    array,
    lang,
    on,
    keys,
	dom,
    domClass,
    domConstruct,
    domAttr,
    focusUtil,
    requestScript,
    html,


    Form,
    TextBox,
    NumberTextBox,
    NumberSpinner,
    Select,
    FilteringSelect,
    Button,
    DateTextBox,

    SimpleMarkerSymbol,
    Color,
    InfoTemplate,
    Graphic

    ) {



        return declare(null, {

            constructor: function (/*Widget*/ widget) {

                //summary: 
                //        Called when a new instance it's created
                //
                //description:
                //        Sets the widget variable and initializes the widget graphic interface
                //  
                //tags:
                //        public
                //
                //widget:
                //        The widget which creates this instance
                //

                this.widget = widget;

                var _initGUI = lang.hitch(this, "_initGUI");

                _initGUI();


            },

            _initGUI: function () {

                //summary: 
                //          Initializes the graphic inteface
                //
                //description:
                //          Creates and starts dojo widgets in the interface.
                //          Sets the event listener on buttons click.
                //          
                //  
                //tags:
                //          private
                //
             
                // init txtQuery
                this.widget.txtQuery = new TextBox({placeHolder: "instagram, #instagram"}, this.widget.txtQuery);
                
                domAttr.set(this.widget.txtQuery, "style", "width: 100%;");
                
                this.widget.txtQuery.startup();              

                // init txtDensity
                var densityConfig = this.widget.config.density;

                this.widget.txtDensity = new NumberSpinner({
                    name: "txtDensity",
                    smallDelta: densityConfig.deltaDensity,
                    constraints: {
                        min: densityConfig.minDensity,
                        max: densityConfig.maxDensity
                    },
                    value: densityConfig.defaultDensity
                }, this.widget.txtDensity);

                domAttr.set(this.widget.txtDensity, "style", "width: 100%;");

                this.widget.txtDensity.startup();

                //sets eventlistener
                on(this.widget.btnSignin, "click", lang.hitch(this.widget, this._onBtnSigninClick));
                on(this.widget.btnLogout, "click", lang.hitch(this.widget, this._onBtnLogoutClick));
                on(this.widget.btnSearch, "click", lang.hitch(this.widget, this._onBtnSearchClick));				

            },

            _onBtnSearchClick: function () {
                
                //summary: 
                //        Called when the search button is pressed
                //
                //description:
                //        Cleans the layer from all the graphics and starts a new search
                //  
                //tags:
                //        callback
                //
               
                this.layer.cleanLayer();

                this.layer.search(this.map.geographicExtent);
            
            },

            _onBtnSigninClick: function () {

                //summary: 
                //        Called when the signin button is pressed
                // 
                //tags:
                //        callback
                //

                this.oauth.signin();
            },

            _onBtnLogoutClick: function () {

                //summary: 
                //        Called when the logout button is pressed
                // 
                //tags:
                //        callback
                //
                                
                this.oauth.logout();
            },


        });

    });


