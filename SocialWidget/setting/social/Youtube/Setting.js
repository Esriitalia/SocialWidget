

define([
    "dojo/_base/declare",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    'dijit/_WidgetsInTemplateMixin',
    
    "dojo/_base/lang",
    "dojo/on",
    "dojo/dom-attr",
    "dijit/form/CheckBox",
    
    
    "dojo/text!./Setting.html",
    
    "dojo/domReady!"
], function(declare, 
             _WidgetBase, 
             _TemplatedMixin,
             _WidgetsInTemplateMixin,
             
             lang,
             on,
             domAttr,
             CheckBox,             

             template
            ) {

    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        templateString: template,
        config: null,
                
        startUp: function(){
        
            this._initInput();            
        },
        
        _initInput: function(){
            
            //summary: 
            //        Initializes the input for the social network
            //
            
            this.txtClientId.value = this.config.youtube.client_id;
            this.txtVideo.value = this.config.youtube.urls.video;
            this.txtChannel.value = this.config.youtube.urls.channel;     
            
            this.checkKeyword = new CheckBox({
                name: "checkKeyword",       
                checked: false                
            }, this.checkKeyword);
            
            
            on(this.checkKeyword, "change", lang.hitch(this, this._onCheckKeywordChange));
                        
            this.checkKeyword.startup();
             
        },
        
        _onCheckKeywordChange: function(){            
                        
            //summary: 
            //        Adds or removes the disabled attribute to the textbox 
            //        for the keyword
            //
            
            if(this.checkKeyword.checked){
                
                domAttr.remove(this.txtKeyword, "disabled");
                
            }else{

                domAttr.set(this.txtKeyword, "disabled", "");
            }
        },
        
        saveInput: function(){
            
            //summary: 
            //        Saves the input for the social network
            //
            
            this.config.youtube.client_id = this.txtClientId.value;
            this.config.youtube.urls.video = this.txtVideo.value;
            this.config.youtube.urls.channel = this.txtChannel.value;
            
            this.config.fixedKeyword = this.checkKeyword.checked;
            
            if(this.config.fixedKeyword){
                
                this.config.keyword = this.txtKeyword.value
            }
            
            
        }

    });

});








