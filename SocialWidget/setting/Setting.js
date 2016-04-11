define([
  'dojo/_base/declare',
  'jimu/BaseWidgetSetting',
  'dijit/_WidgetsInTemplateMixin',

  "dojo/text!./social/social.json",
  "./social/Instagram/Setting",
  "./social/Twitter/Setting",
  "./social/Youtube/Setting",

   "dojo/_base/lang",
  "dojo/_base/array",
  "dojo/data/ObjectStore",
  "dojo/store/Memory",
    
  "dojo/dom-construct",
    "dojo/dom-style",
    "dojo/dom-class",
    "dijit/registry",

  "dijit/form/TextBox",
  "dijit/form/NumberTextBox",
  "dijit/form/Select",

  'dojo/json'
 
],
  function (
    declare,
    BaseWidgetSetting,
    _WidgetsInTemplateMixin,

    socialJson,
    Instagram,
    Twitter,
    Youtube,
    
    lang,
    array,
    ObjectStore,
    Memory,
     
    domConstruct,
     domStyle,
     domClass,
     registry,
     
    TextBox,
    NumberTextBox,
    Select,

    json
     
    ) {
    
    var _socialConstructor = {
        Twitter: Twitter,
        Instagram: Instagram,
        Youtube: Youtube
    }
    
    return declare([BaseWidgetSetting, _WidgetsInTemplateMixin], {

      baseClass: 'jimu-widget-social-setting',


      startup: function () {

        //summary: 
        //        Called when the widget it's started for the first time
        //
        //description:
        //        Gets the default configuration values and init the gui
        //
          
        this.inherited(arguments);
                  
        if (typeof (this.config) === 'undefined') {
          this.config = {};
        }
          
        this.setConfig(this.config);
          
        this.optionsPanel = null;

        this._initSelect(); 
          
      },
      
      _initSelect: function(){

        //summary: 
        //        Initializes the dojo/select in the gui with the available social network
        //        and sets an event for when it changes value
        //
        //description:
        //        Gets the default configuration values and init the gui
        //
          
        var socialArray = json.parse(socialJson);
                
        var dataStore = [];
        
        array.forEach(socialArray, function (social){
           
          dataStore.push({id:social, label:social});  
            
        }, this);
        
        var socialStore = new Memory({
          data: dataStore
        });

        var os = new ObjectStore({ objectStore: socialStore });
          
        this.selSocial = new Select({
          store: os
        }, this.selSocial);
          
        


        this.selSocial.startup();
        
         
        var _changeSocialSettings = lang.hitch(this, "_changeSocialSettings");
              
        _changeSocialSettings(this.selSocial.value);
                       
        this.selSocial.on("change", function(){
          
          var social = this.get("value");
          
          if(social){                            
            _changeSocialSettings(social);
          }
        });   
        

                  
          if(this.config.social){
              this.selSocial.set("value", this.config.social);
          }
        
        
      },
      
      
      _changeSocialSettings: function(/*String*/ social){
        
        //summary: 
        //        Called when the select changes value
        //
        //description:
        //        Loads the configuration for the new social network
        //
          
        this._initInputUrls(social);

        this._loadOptionsPanel(social); 
          
      },
        
      _initInputUrls: function(/*String*/ social){      
          
        //summary: 
        //        
        //        Called when the select changes value
        //description:
        //        Sets the default values for the textbox
        //
          
          social = social.toLowerCase();
          
          var urls = this.config[social].urls;  
                    
          this.txtOauth.value = urls.oauth;
          this.txtCheck.value = urls.check;
          this.txtSearch.value = urls.search;
          this.txtLogout.value = urls.logout;                   
      },
        
      _saveInputUrls: function(/*String*/ social){      
          
         //summary: 
         //        
         //        Called when the user saves 
         //description:
         //        Saves the new configuration values in the config file
         //
          
          social = social.toLowerCase();
          
          var urls = this.config[social].urls;  
                    
          urls.oauth = this.txtOauth.value;
          urls.check = this.txtCheck.value;
          urls.search = this.txtSearch.value;
          urls.logout = this.txtLogout.value;           
          
          this.config[social].urls = urls;          
      },
      
    _loadOptionsPanel: function(/*String*/ social){
         
        
         //summary: 
         //        
         //        Called when the select changes value
         //description:
         //        Loads a different option panel for each social network
         //
       
        if(this.optionsPanel){
            this.optionsPanel.destroy();
        }       
        
        this.optionsPanel = domConstruct.create("div");
                
        domConstruct.place(this.optionsPanel, this.divSocialOptions, "only");
                
        var SocialNetwork = _socialConstructor[social];
        
        this.optionsPanel = new SocialNetwork({config: this.config, nls: this.nls}, this.optionsPanel);  
        
        
        this.optionsPanel.startUp();
        
    },

      setConfig: function (/*Object*/ config) {
          
          this.config = config;
          
      },
        
      getConfig: function () {        
                        
        var social = this.selSocial.value;
          
        this.config.social = social;
          
        social = social.toLowerCase();
       
        this._saveInputUrls(social);  
          
        this.optionsPanel.saveInput();
        
        return this.config;
      }
        
    });
  });