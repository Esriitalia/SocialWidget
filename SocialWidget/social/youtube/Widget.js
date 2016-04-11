define([
  "./GUI",
  "./Layer",
  "./OAuth",

  'dojo/_base/declare',

  'dijit/_WidgetBase',
  'dijit/_TemplatedMixin',
  'dijit/_WidgetsInTemplateMixin',

  'dojo/text!./Widget.html',
    'dojo/i18n!./nls/strings'

],
  function (
    GUI,
    Layer,
    OAuth,
     
    declare,

    _WidgetBase,
    _TemplatedMixin,
    _WidgetsInTemplateMixin,

    template,
     nls
    ) {



    return declare([_WidgetBase, _TemplatedMixin
    //, _WidgetsInTemplateMixin
    ], {
      baseClass: 'jimu-widget-social-youtube',
      templateString: template,
      nls: nls.root || nls,


      startup: function () {
        
        //summary: 
        //        Called when the widget it's started for the first time
        //
        //description:
        //        Creates an objects for every class neede by the widget 
        //  
        //tags:
        //        public
        //
        //layer:
        //        This class manages the layer on the map, 
        //        the calls to the server when fetching data and parses them
        //
        //oauth:  
        //        This class manages the authentication process with the server of the social network
        //
        //gui:
        //        This class manages the graphic interface of the widget, 
        //        initializes the widget HTML DOM and sets the event listener 
        //
         
        
        this.layer = new Layer(this);  
        this.oauth = new OAuth(this);
        this.gui = new GUI(this);   
      }
     
    });
  });