define([

  "./social/twitter/Widget",
  "./social/instagram/Widget",
  "./social/youtube/Widget",

  "dojo/_base/declare",
  "dojo/_base/lang",


  'jimu/BaseWidget',

  "dijit/_TemplatedMixin",

  "dijit/_WidgetsInTemplateMixin"

],
  function (

    Twitter,
    Instagram,
    Youtube,
     
    declare,
    lang,


    BaseWidget,
    _TemplatedMixin,
    _WidgetsInTemplateMixin
    ) {

    var _socialConstructor = {
        Twitter: Twitter,
        Instagram: Instagram,
        Youtube: Youtube
    }
    
    return declare([BaseWidget, _TemplatedMixin, _WidgetsInTemplateMixin], {

      baseClass: 'jimu-widget-social',
      name: 'Social Widget',


      startup: function () {
        
        //summary: 
        //        Called when the widget it's started for the first time
        //
        //description:
        //        First checks if there is a config.json, 
        //        then makes any operation needed for the social network 
        //        and initializes its module 
        //  
        //tags:
        //        public
        //              
        
        this.inherited(arguments);


        if (!this.config) {
          
          this.showError();
          return;
        }

                    
        var socialName = this.config.social;              
          
        var SocialNetwork = _socialConstructor[socialName];              
          
        socialName = socialName.toLowerCase();
        
        var socialConfig = this.config[socialName];        
                   
        if(SocialNetwork && socialConfig){
            
            this._initSocialWidget(SocialNetwork);
            
        }else {
            
            this.showError();
            return;
        }  
                  
        
      },

      _initSocialWidget: function (/*Widget*/ Social) {

        //summary: 
        //        Called to initilize the widget
        //
        //description:
        //        Creates a new widget and gives it every data it needs before it runs 
        //  
        //tags:
        //        private
        // 
          
        this.social = new Social({
          config: this.config,
          map: this.map,
          folderUrl: this.folderUrl
        }, this.social);

        this.social.startup();

      },
 

      _showError: function () {


      },

      onOpen: function () {
        
        //summary: 
        //        Called when the widget window is opened
        //
        //description:
        //        For usability reasons every popup on the map it's hidden
        //        when the widget it's opened by the user
        //  
        //tags:
        //        public
        //         
        
        this.map.infoWindow.hide();
        
      }
    });


  });