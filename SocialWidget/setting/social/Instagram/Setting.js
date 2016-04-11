

define([
    "dojo/_base/declare",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dojo/text!./Setting.html"
], function(declare, 
             _WidgetBase, 
             _TemplatedMixin,
            template
            ) {

    return declare([_WidgetBase, _TemplatedMixin], {
        templateString: template,
        config: null,
        
        startUp: function(){
                     
            this._initInput();
        },
        
        _initInput: function(){
            
            //summary: 
            //        Initializes the input for the social network
            //
            
            this.txtClientId.value = this.config.instagram.client_id;
        },
        
        saveInput: function(){
            
            //summary: 
            //        Saves the input for the social network
            //
            
            this.config.instagram.client_id = this.txtClientId.value;
            
        }

    });

});








